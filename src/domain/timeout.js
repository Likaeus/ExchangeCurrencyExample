export function withTimeout(promise, ms, onTimeoutMsg='Timeout') {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(onTimeoutMsg)), ms);
  });
  return Promise.race([promise.finally(() => clearTimeout(t)), timeout]);
}