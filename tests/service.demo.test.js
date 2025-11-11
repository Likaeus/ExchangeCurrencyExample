import { QuoteService } from "../src/services/quoteService.js";
import { DemoProvider } from "../src/providers/demo.js";
import { NoQuotesError } from "../src/domain/models.js";

describe("QuoteService con DemoProviders", () => {
  test("elige el mayor converted_amount sin HTTP", async () => {
    const svc = new QuoteService([
      new DemoProvider("API1", "rate", 0.95), // 950
      new DemoProvider("API2", "total", 960), // 960
      new DemoProvider("API3", "total", 980), // 980 <- ganador
    ]);
    const best = await svc.findBestQuote("USD", "EUR", 1000);
    expect(best.provider).toBe("API3");
    expect(best.converted_amount).toBeCloseTo(980);
  });

  test("si todos fallan, lanza NoQuotesError", async () => {
    // Providers que simulan fallo lanzando excepción
    const bad = {
      name: "BAD",
      getQuote: async () => {
        throw new Error("oops");
      },
    };
    const svc = new QuoteService([bad, bad, bad]);
    await expect(svc.findBestQuote("USD", "EUR", 1000)).rejects.toThrow(
      NoQuotesError
    );
  });
});
