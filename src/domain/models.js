export class QuoteInput {
  constructor(sourceCurrency, targetCurrency, amount) {
    this.sourceCurrency = sourceCurrency;
    this.targetCurrency = targetCurrency;
    this.amount = Number(amount);
  }
}

export class QuoteResult {
  constructor(provider, sourceCurrency, targetCurrency, amount, rate, convertedAmount, receivedAt = new Date().toISOString()) {
    this.provider = provider;
    this.sourceCurrency = sourceCurrency;
    this.targetCurrency = targetCurrency;
    this.amount = Number(amount);
    this.rate = Number(rate);
    this.converted_amount = Number(convertedAmount);
    this.received_at = receivedAt;
  }
}

export class NoQuotesError extends Error {
  constructor(msg='No valid quotes received within deadline') {
    super(msg);
    this.name = 'NoQuotesError';
  }
}