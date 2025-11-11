import nock from 'nock';
import { Api1Provider } from '../src/providers/api1.js';
import { Api2Provider } from '../src/providers/api2.js';
import { Api3Provider } from '../src/providers/api3.js';
import { QuoteInput } from '../src/domain/models.js';

describe('Providers', () => {
  afterEach(() => nock.cleanAll());

  test('Api1 success', async () => {
    const url = 'https://api1.example.com';
    nock(url).post('/rate').reply(200, { rate: 0.9 });
    const p = new Api1Provider();
    const res = await p.getQuote(new QuoteInput('USD','EUR',100));
    expect(res.converted_amount).toBeCloseTo(90);
  });

  test('Api2 success (XML converted amount)', async () => {
    const url = 'https://api2.example.com';
    nock(url).post('/rate').reply(200, '<XML><Result>95.5</Result></XML>');
    const p = new Api2Provider();
    const res = await p.getQuote(new QuoteInput('USD','EUR',100));
    expect(res.converted_amount).toBeCloseTo(95.5);
    expect(res.rate).toBeCloseTo(0.955);
  });

  test('Api3 success', async () => {
    const url = 'https://api3.example.com';
    nock(url).post('/quotes').reply(200, { statusCode: 200, message: 'ok', data: { total: 101.25 } });
    const p = new Api3Provider();
    const res = await p.getQuote(new QuoteInput('USD','EUR',100));
    expect(res.converted_amount).toBeCloseTo(101.25);
    expect(res.rate).toBeCloseTo(1.0125);
  });

  test('Api3 error status', async () => {
    const url = 'https://api3.example.com';
    nock(url).post('/quotes').reply(200, { statusCode: 500, message: 'err', data: {} });
    const p = new Api3Provider();
    await expect(p.getQuote(new QuoteInput('USD','EUR',100))).rejects.toThrow();
  });
});
