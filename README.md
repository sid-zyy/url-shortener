# Shortify — URL Shortener

URL shortening service built with Node.js, Express, and MySQL.

## How it works
1. On a POST request, checks MySQL if the URL was already shortened (dedup)
2. If new: generates a UUID, maps characters to a numeric ID, converts to Base62
3. Stores the `longUrl → shortUrl` mapping in MySQL
4. On GET, looks up the hash and returns the original URL

## Stack
- Node.js / Express
- MySQL (via mysql2)
- React frontend (Vite + Tailwind)

## Run locally
### Prerequisites
- Node.js 18+, MySQL 8+

### Setup
```bash
cd backend && npm install
# create a .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
node src/server.js
```

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shortify/` | `{ url: "..." }` → returns `shortUrl` |
| GET | `/shortify/:hashId` | Returns `origUrl` for the hash |
