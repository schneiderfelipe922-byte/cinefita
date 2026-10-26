const {test} = require('node:test');
const assert = require('node:assert/strict');
const checkout = require('../checkout-core.js');

test('PIX e débito preservam o total à vista', () => {
  for (const method of ['pix','debit']) {
    const quote = checkout.quote(10480,method);
    assert.deepEqual(quote.installments,[10480]);
    assert.equal(quote.label,checkout.methods[method]);
  }
});

test('crédito de 1 a 12 vezes distribui centavos sem alterar o total', () => {
  for (const total of [3990,8490,10480,18970,840510]) {
    for (let count=1;count<=12;count++) {
      const quote=checkout.quote(total,'credit',count);
      assert.equal(quote.installments.length,count);
      assert.equal(quote.installments.reduce((a,b)=>a+b,0),total);
      assert.ok(quote.installments.every(Number.isSafeInteger));
      assert.ok(Math.max(...quote.installments)-Math.min(...quote.installments)<=1);
    }
  }
  assert.deepEqual(checkout.quote(10480,'credit',3).installments,[3494,3493,3493]);
});

test('rejeita total, método e parcelamento inválidos', () => {
  for (const total of [0,-1,NaN,Infinity,84.9,'8490',Number.MAX_SAFE_INTEGER+1]) assert.throws(()=>checkout.quote(total,'pix'),RangeError);
  for (const method of ['cash','__proto__','toString',undefined]) assert.throws(()=>checkout.quote(8490,method),RangeError);
  for (const count of [0,-1,13,2.5,NaN,'3']) assert.throws(()=>checkout.quote(8490,'credit',count),RangeError);
  assert.throws(()=>checkout.quote(8490,'debit',2),RangeError);
  assert.throws(()=>checkout.quote(1,'credit',2),RangeError);
});
