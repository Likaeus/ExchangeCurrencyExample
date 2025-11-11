import nock from 'nock';
import { QuoteService } from '../src/services/quoteService.js';
import { Api1Provider } from '../src/providers/api1.js';
import { Api2Provider } from '../src/providers/api2.js';
import { Api3Provider } from '../src/providers/api3.js';
import { NoQuotesError } from '../src/domain/models.js';

describe('QuoteService', () => {
  afterEach(() => nock.cleanAll());

  test('picks highest and handles failures', async () => {
    nock('https://api1.example.com').post('/rate').reply(200, { rate: 0.90 });                 
    nock('https://api2.example.com').post('/rate').reply(500);                                  
    nock('https://api3.example.com').post('/quotes').reply(200, { statusCode: 200, data: { total: 101.25 } }); 

    const svc = new QuoteService([ new Api1Provider(), new Api2Provider(), new Api3Provider() ]);
    const best = await svc.findBestQuote('USD','EUR',100);
    expect(best.provider).toBe('API3');
    expect(best.converted_amount).toBeCloseTo(101.25);
  });

  test('all fail throws', async () => {
    nock('https://api1.example.com').post('/rate').reply(200, {});
    nock('https://api2.example.com').post('/rate').reply(200, '<XML></XML>');
    nock('https://api3.example.com').post('/quotes').reply(200, { statusCode: 500, data: {} });
    const svc = new QuoteService([ new Api1Provider(), new Api2Provider(), new Api3Provider() ]);
    await expect(svc.findBestQuote('USD','EUR',100)).rejects.toThrow(NoQuotesError);
  });
});
