# Comparing Exchange Rate Offers — Express.js

Service (no UI/DB) that queries multiple exchange APIs **in parallel**, ignores failures, and returns the **highest converted amount** as fast as possible. Includes unit tests and Dockerfile.

## Requirements

- Node.js 18+

## Install & test

```bash
npm i
npm test
```

## Run API (Express)

```bash
npm start
# POST a request:
curl -s http://localhost:3000/quote -H "Content-Type: application/json" -d '{"source":"USD","target":"EUR","amount":1000}'
```

Configure via env vars:

```
API1_URL (default: https://api1.example.com/rate)
API1_KEY (default: api1-demo-key)
API2_URL (default: https://api2.example.com/rate)
API2_KEY (default: api2-demo-key)
API3_URL (default: https://api3.example.com/quotes)
API3_KEY (default: api3-demo-key)
REQUEST_TIMEOUT_MS (default: 1200)
OVERALL_TIMEOUT_MS  (default: 2500)
LOG_LEVEL (default: info)
PORT (default: 3000)
```

## CLI (optional)

```bash
node src/cli.js USD EUR 1000
```

## Docker

```bash
docker build -t exchange-offers-express .
docker run --rm -p 3000:3000 exchange-offers-express
```

## Architecture

- `src/domain` — models and errors
- `src/providers` — API adapters (API1 JSON, API2 XML, API3 JSON,DemoProvider wich simulates the 3 APIs)
- `src/services` — `quoteService` orchestrates concurrent calls, selects max
- `src/server.js` — Express endpoint POST /quote
- `src/cli.js` — small CLI wrapper
- `tests/` — Jest + nock (no real HTTP)
