const BASE_URL = "http://localhost:5000";

export async function shortifyUrl(longUrl) {
  const res = await fetch(`${BASE_URL}/shortify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: longUrl }),
  });

  return res.json();
}

export async function lookupUrl(hash) {
  const res = await fetch(`${BASE_URL}/shortify/${hash}`);
  return res.json();
}
