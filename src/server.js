const express = require('express');
const db = require('./db');
const path = require('path');
const geoip = require('geoip-lite');
const app = express();
const port = process.env.PORT || 30783;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Simple Base62 characters
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateShortCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

// 1. Create a short link
app.post('/api/shorten', (req, res) => {
  const { long_url, expires_in_hours } = req.body;
  
  // URL Validation
  try {
    const validUrl = new URL(long_url);
    if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch (e) {
    return res.status(400).json({ error: "Invalid or unsupported URL format" });
  }

  const short_code = generateShortCode();
  const expires_at = expires_in_hours ? new Date(Date.now() + expires_in_hours * 3600000).toISOString() : null;
  const protocol = req.protocol;
  const host = req.get('host');
  const base_url = `${protocol}://${host}`;

  const stmt = db.prepare("INSERT INTO links (short_code, long_url, expires_at) VALUES (?, ?, ?)");
  stmt.run(short_code, long_url, expires_at, function(err) {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ short_url: `${base_url}/${short_code}`, short_code });
  });
});

// 2. Redirection and Analytics
app.get('/:short_code', (req, res) => {
  const { short_code } = req.params;
  const now = new Date().toISOString();

  db.get("SELECT * FROM links WHERE short_code = ?", [short_code], (err, link) => {
    if (err || !link) return res.status(404).send("Link not found");
    if (link.expires_at && now > link.expires_at) return res.status(410).send("Link expired");

    // Async log analytics with GeoIP
    const referer = req.get('Referer') || 'Direct';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const geo_location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

    db.run("INSERT INTO analytics (short_code, referer, ip, geo_location) VALUES (?, ?, ?, ?)", [short_code, referer, ip, geo_location]);
    db.run("UPDATE links SET click_count = click_count + 1 WHERE id = ?", [link.id]);

    res.redirect(link.long_url);
  });
});

// 3. Simple Stats API
app.get('/api/stats/:short_code', (req, res) => {
  const { short_code } = req.params;
  db.all("SELECT * FROM analytics WHERE short_code = ? ORDER BY visited_at DESC", [short_code], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.listen(port, () => console.log(`NanoLink active on http://localhost:${port}`));
