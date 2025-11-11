import express from "express";
import "dotenv/config";
import { config } from "./domain/env.js";
import { logger } from "./domain/logger.js";
import { QuoteService } from "./services/quoteService.js";
import { Api1Provider } from "./providers/api1.js";
import { Api2Provider } from "./providers/api2.js";
import { Api3Provider } from "./providers/api3.js";
import { DemoProvider } from "./providers/demo.js";

const app = express();
app.use(express.json());

const providers =
  process.env.DEMO_MODE === "1"
    ? [
        new DemoProvider("API1", 0.95, false),
        new DemoProvider("API2", 960, true),
        new DemoProvider("API3", 980, true),
      ]
    : [new Api1Provider(), new Api2Provider(), new Api3Provider()];

app.post("/quote", async (req, res) => {
  const { source, target, amount } = req.body || {};
  if (!source || !target || typeof amount !== "number") {
    return res
      .status(400)
      .json({ error: "Body must be {source, target, amount:number}" });
  }
  try {
    const best = await service.findBestQuote(
      String(source).toUpperCase(),
      String(target).toUpperCase(),
      Number(amount)
    );
    return res.json(best);
  } catch (e) {
    logger.warn({ err: String(e) }, "quote_failed");
    return res.status(502).json({ error: e.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  logger.info({ port: config.port }, "server_started");
});
