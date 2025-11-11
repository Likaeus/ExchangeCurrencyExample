import axios from 'axios';
import { QuoteResult } from '../domain/models.js';
import { config } from '../domain/env.js';
import { parseStringPromise } from 'xml2js';

export class Api2Provider {
  constructor(client = axios.create({ timeout: config.requestTimeoutMs })) {
    this.client = client;
    this.name = 'API2';
  }
  async getQuote(q) {
    const xml = `<XML><From>${q.sourceCurrency}</From><To>${q.targetCurrency}</To><Amount>${q.amount}</Amount></XML>`;
    const headers = { 'X-API-KEY': config.api2Key, 'Content-Type': 'application/xml' };
    const resp = await this.client.post(config.api2Url, xml, { headers });
    const parsed = await parseStringPromise(resp.data);
    const result = parsed?.XML?.Result?.[0];
    if (result === undefined) throw new Error('Invalid XML: missing Result');
    const converted = Number(result);
    const rate = q.amount ? converted / q.amount : 0;
    return new QuoteResult(this.name, q.sourceCurrency, q.targetCurrency, q.amount, rate, converted);
  }
}