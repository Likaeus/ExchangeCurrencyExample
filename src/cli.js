#!/usr/bin/env node
// src/cli.js
import "dotenv/config";
import { QuoteService } from "./services/quoteService.js";
import { Api1Provider } from "./providers/api1.js";
import { Api2Provider } from "./providers/api2.js";
import { Api3Provider } from "./providers/api3.js";
import { logger } from "./domain/logger.js";

// Si creaste el modo demo, descomenta esta línea y asegúrate de tener src/providers/demo.js
import { DemoProvider } from "./providers/demo.js";

function usage() {
  console.log("Usage: node src/cli.js <FROM> <TO> <AMOUNT>");
  console.log("Example: node src/cli.js USD EUR 1000");
}

function parseArgs() {
  const [src, dst, amtRaw] = process.argv.slice(2);
  if (!src || !dst || !amtRaw || Number.isNaN(Number(amtRaw))) {
    usage();
    process.exit(2);
  }
  return {
    source: String(src).toUpperCase(),
    target: String(dst).toUpperCase(),
    amount: Number(amtRaw),
  };
}

async function main() {
  const { source, target, amount } = parseArgs();

  // Selección de proveedores: demo sin red vs. reales
  const providers =
    process.env.DEMO_MODE === "1"
      ? [
          new DemoProvider("API1", "rate", 0.95),

          new DemoProvider("API2", "total", 960),

          new DemoProvider("API3", "total", 980),
        ]
      : [new Api1Provider(), new Api2Provider(), new Api3Provider()];

  const service = new QuoteService(providers);

  try {
    const best = await service.findBestQuote(source, target, amount);
    
    console.log(JSON.stringify(best, null, 2));
    process.exit(0);
  } catch (err) {
    logger.warn({ err: String(err) }, "cli_failed");
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  }
}


process.on("unhandledRejection", (e) => {
  console.error(
    JSON.stringify({ error: `unhandledRejection: ${e?.message || e}` })
  );
  process.exit(1);
});
process.on("uncaughtException", (e) => {
  console.error(
    JSON.stringify({ error: `uncaughtException: ${e?.message || e}` })
  );
  process.exit(1);
});

main();
