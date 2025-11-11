import axios from 'axios';
import { QuoteResult } from '../domain/models.js';
import { config } from '../domain/env.js';

export class Api1Provider {
  constructor(client = axios.create({ timeout: config.requestTimeoutMs })) {
    this.client = client;
    this.name = 'API1';
  }
  async getQuote(q) {
    const payload = { from: q.sourceCurrency, to: q.targetCurrency, value: q.amount };
    const headers = { Authorization: `Bearer ${config.api1Key}` };
    const resp = await this.client.post(config.api1Url, payload, { headers });
    if (!resp.data || typeof resp.data.rate !== 'number') {
      throw new Error('Invalid response: missing rate');
    }
    const rate = Number(resp.data.rate);
    return new QuoteResult(this.name, q.sourceCurrency, q.targetCurrency, q.amount, rate, rate * q.amount);
  }
}