import { QuoteResult } from "../domain/models.js";

export class DemoProvider {
  /**
   * @param {string} name  
   * @param {'rate'|'total'} mode  
   * @param {number} value  
   */
  constructor(name, mode = "rate", value = 1) {
    this.name = String(name || "DEMO");
    this.mode = String(mode).toLowerCase() === "total" ? "total" : "rate";
    const num = Number(value);
    this.value = Number.isFinite(num) ? num : 0;
  }

  async getQuote(q) {
    const amount = Number(q?.amount);
    const sourceCurrency = String(q?.sourceCurrency || "");
    const targetCurrency = String(q?.targetCurrency || "");

    // Si amount no es numérico, trátalo como 0 para evitar NaN
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    const converted =
      this.mode === "total"
        ? this.value // ya es un monto final
        : safeAmount * this.value; // tasa * amount

    const rate = safeAmount > 0 ? converted / safeAmount : 0;

    return new QuoteResult(
      this.name,
      sourceCurrency,
      targetCurrency,
      safeAmount,
      rate,
      converted
    );
  }
}
