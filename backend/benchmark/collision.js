/**
 * benchmark/collision.js
 * Tests two things:
 *   1. Dedup correctness — same URL always returns the same shortUrl
 *   2. Hash collision rate — across N unique URLs, how often do two get the same hash?
 *
 * No k6 needed. Run: node benchmark/collision.js
 * Requires the server to be running on localhost:3000
 */

const BASE    = process.env.BASE || "http://localhost:3000";
const N       = 1000; // number of unique URLs to shorten — raise to 10000 for a bigger run
const DEDUP_N = 20;   // number of times to re-shorten the same URL

async function post(url) {
  const res = await fetch(`${BASE}/shortify/`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ url }),
  });
  return res.json();
}

async function main() {
  console.log(`\n── Dedup correctness (${DEDUP_N} calls to same URL) ──`);
  const testUrl = "https://dedup-test.example.com/fixed";
  const results = [];
  for (let i = 0; i < DEDUP_N; i++) {
    const { shortUrl } = await post(testUrl);
    results.push(shortUrl);
  }
  const unique = new Set(results);
  if (unique.size === 1) {
    console.log(`✓ All ${DEDUP_N} calls returned the same shortUrl: ${[...unique][0]}`);
  } else {
    console.log(`✗ Got ${unique.size} different shortUrls for the same input:`);
    console.log([...unique]);
  }

  console.log(`\n── Hash collision rate across ${N} unique URLs ──`);
  const shortUrls = [];
  const start = Date.now();

  for (let i = 0; i < N; i++) {
    const { shortUrl } = await post(`https://example.com/bench/${i}-${Date.now()}`);
    shortUrls.push(shortUrl);
    if ((i + 1) % 100 === 0) process.stdout.write(`  ${i + 1}/${N}\r`);
  }

  const elapsed    = ((Date.now() - start) / 1000).toFixed(1);
  const uniqueUrls = new Set(shortUrls);
  const collisions = N - uniqueUrls.size;
  const rate       = ((collisions / N) * 100).toFixed(2);

  console.log(`\nResults:`);
  console.log(`  Total URLs shortened : ${N}`);
  console.log(`  Unique short codes   : ${uniqueUrls.size}`);
  console.log(`  Collisions           : ${collisions}`);
  console.log(`  Collision rate       : ${rate}%`);
  console.log(`  Time elapsed         : ${elapsed}s`);
  console.log(`  Throughput           : ${(N / elapsed).toFixed(0)} shortens/sec (sequential)`);

  if (collisions === 0) {
    console.log(`\n✓ Zero collisions across ${N} unique URLs`);
  } else {
    console.log(`\n⚠ ${collisions} collision(s) detected`);
  }
}

main().catch(console.error);
