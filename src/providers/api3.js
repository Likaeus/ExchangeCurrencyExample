import axios from 'axios';
import { QuoteResult } from '../domain/models.js';
import { config } from '../domain/env.js';

export class Api3Provider {
  constructor(client = axios.create({ timeout: config.requestTimeoutMs })) {
    this.client = client;
    this.name = 'API3';
  }
  async getQuote(q) {
    const payload = { exchange: { sourceCurrency: q.sourceCurrency, targetCurrency: q.targetCurrency, quantity: q.amount } };
    const headers = { 'X-AUTH': config.api3Key };
    const resp = await this.client.post(config.api3Url, payload, { headers });
    const body = resp.data || {};
    if (body.statusCode !== 200) throw new Error(`API3 error: ${body.message}`);
    const total = body?.data?.total;
    if (typeof total !== 'number') throw new Error('Invalid response: missing data.total');
    const converted = Number(total);
    const rate = q.amount ? converted / q.amount : 0;
    return new QuoteResult(this.name, q.sourceCurrency, q.targetCurrency, q.amount, rate, converted);
  }
}