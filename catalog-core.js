/* Shared local catalog rules; also exercised by the Node test suite. */
const CinefitaCatalog = (() => {
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const title = film => film.displayTitle || film.title;
  const hasOffer = film => typeof film.price === 'number' && Number.isFinite(film.price) && film.price > 0;
  const compareTitle = (a, b) => title(a).localeCompare(title(b), 'pt-BR', { sensitivity: 'base', numeric: true });
  function select(catalog, { query = '', genre = '', format = '', decade = '', director = '', country = '', sort = 'category' } = {}) {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    const result = catalog.filter(film => {
      const text = normalize([film.title, film.displayTitle, film.originalTitle, film.aliases, film.year, film.category, film.format, ...(film.directors || []), ...(film.countries || [])].filter(Boolean).join(' '));
      return (!genre || film.category === genre) && (!format || film.format === format)
        && (!decade || Math.floor(film.year / 10) * 10 === Number(decade))
        && (!director || film.directors?.includes(director))
        && (!country || film.countries?.includes(country)) && terms.every(term => text.includes(term));
    });
    const priceCompare = direction => (a, b) => {
      if (hasOffer(a) !== hasOffer(b)) return hasOffer(a) ? -1 : 1;
      return (hasOffer(a) ? direction * (a.price - b.price) : 0) || compareTitle(a, b);
    };
    const orders = {
      az: compareTitle, za: (a, b) => compareTitle(b, a),
      rating: (a, b) => (b.imdb?.rating ?? -1) - (a.imdb?.rating ?? -1) || compareTitle(a, b),
      newest: (a, b) => b.year - a.year || compareTitle(a, b),
      oldest: (a, b) => a.year - b.year || compareTitle(a, b),
      added: (a, b) => Number(Boolean(b.added)) - Number(Boolean(a.added)) || compareTitle(a, b),
      'price-low': priceCompare(1), 'price-high': priceCompare(-1)
    };
    return orders[sort] ? result.sort(orders[sort]) : result;
  }
  return { normalize, title, hasOffer, compareTitle, select };
})();
if (typeof module !== 'undefined') module.exports = CinefitaCatalog;
