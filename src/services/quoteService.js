import { NoQuotesError, QuoteInput } from '../domain/models.js';
import { withTimeout } from '../domain/timeout.js';
import { config } from '../domain/env.js';
import { logger } from '../domain/logger.js';

export class QuoteService {
  constructor(providers) {
    this.providers = providers;
  }

  async findBestQuote(source, target, amount) {
    const q = new QuoteInput(source, target, amount);
    const calls = this.providers.map(p => 
      withTimeout(
        p.getQuote(q).catch(err => { 
          logger.warn({ provider: p.name, err: String(err) }, 'provider_failed');
          return null;
        }),
        config.requestTimeoutMs + 50,
        'provider timeout'
      )
    );

    const overall = withTimeout(
      Promise.allSettled(calls),
      config.overallTimeoutMs,
      'overall timeout'
    );

    const settled = await overall;
    let best = null;
    for (const s of settled) {
      if (s.status !== 'fulfilled') continue;
      const res = s.value;
      if (!res) continue;
      if (!best || res.converted_amount > best.converted_amount) {
        best = res;
        logger.info({ provider: res.provider, converted: res.converted_amount }, 'new_best');
      }
    }
    if (!best) throw new NoQuotesError();
    return best;
  }
}