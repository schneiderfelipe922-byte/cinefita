/* Private, device-local film marks. No account, server, or cross-device sync. */
const CinefitaCollection = (() => {
  const KEY = 'cinefitaCollection.v1';
  const TYPES = ['owned', 'wanted', 'watched'];
  function createStore({ storage, filmIds, onChange = () => {} }) {
    const known = new Set(filmIds);
    let records = new Map(), persistent = true;
    function decode(value) {
      const parsed = JSON.parse(value || '{"version":1,"marks":[]}');
      if (parsed?.version !== 1 || !Array.isArray(parsed.marks)) throw new Error('Formato não reconhecido.');
      const result = new Map();
      for (const item of parsed.marks) {
        if (!item || !known.has(item.filmId)) continue;
        const marks = Object.fromEntries(TYPES.map(type => [type, item[type] === true]));
        if (TYPES.some(type => marks[type])) result.set(item.filmId, marks);
      }
      return result;
    }
    function load() {
      try { records = decode(storage.getItem(KEY)); persistent = true; }
      catch { persistent = false; }
    }
    load();
    function get(id) { return { owned: false, wanted: false, watched: false, ...records.get(id) }; }
    function set(id, type, enabled) {
      if (!known.has(id) || !TYPES.includes(type) || typeof enabled !== 'boolean') throw new Error('Marcação inválida.');
      // Merge another tab's latest marks before committing this independent change.
      if (persistent) load();
      const marks = { ...get(id), [type]: enabled };
      if (TYPES.some(key => marks[key])) records.set(id, marks); else records.delete(id);
      try {
        storage.setItem(KEY, JSON.stringify({ version: 1, marks: [...records].map(([filmId, value]) => ({ filmId, ...value })) }));
        persistent = true;
      } catch { persistent = false; }
      onChange();
      return { persistent };
    }
    function reload() { if (!persistent) return; load(); onChange(); }
    return { get, set, reload, ids: () => [...records.keys()], isPersistent: () => persistent };
  }
  return { KEY, TYPES, createStore };
})();
if (typeof module !== 'undefined') module.exports = CinefitaCollection;
