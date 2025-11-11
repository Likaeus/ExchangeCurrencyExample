export const config = {
  api1Url: process.env.API1_URL || 'https://api1.example.com/rate',
  api1Key: process.env.API1_KEY || 'api1-demo-key',
  api2Url: process.env.API2_URL || 'https://api2.example.com/rate',
  api2Key: process.env.API2_KEY || 'api2-demo-key',
  api3Url: process.env.API3_URL || 'https://api3.example.com/quotes',
  api3Key: process.env.API3_KEY || 'api3-demo-key',
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 1200),
  overallTimeoutMs: Number(process.env.OVERALL_TIMEOUT_MS || 2500),
  port: Number(process.env.PORT || 3000),
  logLevel: process.env.LOG_LEVEL || 'info',
};