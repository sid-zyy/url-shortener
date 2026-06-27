import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/shortify/2qfx', {
    redirects: 0, // don't follow the redirect
  });

  check(res, {
    'redirect': (r) => r.status === 301 || r.status === 302,
  });
}
