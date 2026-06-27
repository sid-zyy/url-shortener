# Shortify — URL Shortener

A URL shortening service built with **Node.js, Express, and MySQL** that generates deterministic short links, avoids duplicate entries for the same URL, and performs HTTP redirects.

## Features

* Generate short URLs for long links
* Deterministic URL deduplication (same URL always returns the same short URL)
* Base62 short-code generation
* HTTP redirects for shortened URLs
* MySQL persistence
* Load tested with **k6**

## Architecture

1. Client sends a `POST /shortify` request containing a long URL.
2. The server checks MySQL to determine whether the URL has already been shortened.
3. If the URL is new, a UUID is generated and converted into a Base62 short code.
4. The `longUrl ↔ shortUrl` mapping is stored in MySQL.
5. A `GET /shortify/:hashId` request performs an HTTP redirect to the original URL.

## Tech Stack

* Node.js
* Express
* MySQL (`mysql2`)
* React (Vite)
* Tailwind CSS
* k6 (performance benchmarking)

## Performance

Benchmark performed locally using **k6**:

* **3,000+ HTTP redirects/sec**
* **100 concurrent virtual users**
* **32.8 ms average latency**
* **43.9 ms p95 latency**
* **0% request failures**

## API

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| POST   | `/shortify/`        | Create or retrieve a shortened URL |
| GET    | `/shortify/:hashId` | Redirects to the original URL      |

## Running Locally

### Prerequisites

* Node.js 18+
* MySQL 8+

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```text
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
```

Start the server:

```bash
node src/server.js
```

## Benchmark

```bash
k6 run benchmarks/redirect.js
```
