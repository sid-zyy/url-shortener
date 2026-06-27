# Benchmarks

## Redirect Benchmark

Measures redirect throughput and latency using k6.

### Requirements

- Backend server running
- A valid short code stored in the database
- k6 installed

### Run

```bash
SHORT_CODE=<your-short-code> k6 run benchmarks/redirect.js
