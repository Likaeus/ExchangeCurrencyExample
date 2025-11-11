import { DemoProvider } from "../src/providers/demo.js";
import { QuoteInput } from "../src/domain/models.js";

describe("DemoProvider", () => {
  test("mode=rate usa la tasa * amount", async () => {
    const p = new DemoProvider("API1", "rate", 0.95);
    const res = await p.getQuote(new QuoteInput("USD", "EUR", 1000));
    expect(res.converted_amount).toBeCloseTo(950);
    expect(res.rate).toBeCloseTo(0.95);
  });

  test("mode=total usa el monto convertido literal", async () => {
    const p = new DemoProvider("API2", "total", 960);
    const res = await p.getQuote(new QuoteInput("USD", "EUR", 1000));
    expect(res.converted_amount).toBeCloseTo(960);
    expect(res.rate).toBeCloseTo(0.96);
  });
});
