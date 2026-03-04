const express = require('express');
const db = require('./db');
const path = require('path');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const QRCode = require('qrcode');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateShortCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

// 1. Create a short link (Enhanced with Custom Slugs)
app.post('/api/shorten', (req, res) => {
  const { long_url, expires_in_hours, custom_slug } = req.body;
  
  try {
    const validUrl = new URL(long_url);
    if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') throw new Error();
  } catch (e) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const short_code = custom_slug || generateShortCode();
  const expires_at = expires_in_hours ? new Date(Date.now() + expires_in_hours * 3600000).toISOString() : null;
  const base_url = `${req.protocol}://${req.get('host')}`;

  const stmt = db.prepare("INSERT INTO links (short_code, long_url, expires_at) VALUES (?, ?, ?)");
  stmt.run(short_code, long_url, expires_at, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(409).json({ error: "Custom slug already taken" });
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ 
      short_url: `${base_url}/${short_code}`, 
      short_code,
      qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(base_url + '/' + short_code)}`
    });
  });
});

// 2. Redirection and Multidimensional Analytics
app.get('/:short_code', (req, res) => {
  const { short_code } = req.params;
  const now = new Date().toISOString();

  db.get("SELECT * FROM links WHERE short_code = ?", [short_code], (err, link) => {
    if (err || !link) return res.status(404).send("Link not found");
    if (link.expires_at && now > link.expires_at) return res.status(410).send("Link expired");

    const ua = new UAParser(req.get('User-Agent')).getResult();
    const referer = req.get('Referer') || 'Direct';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    
    const browser = `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`;
    const os = `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`;
    const device = `${ua.device.vendor || ''} ${ua.device.model || ''} (${ua.device.type || 'desktop'})`;
    const geo_location = geo ? `${geo.city || ''}, ${geo.country || ''}` : 'Unknown';

    db.run("INSERT INTO analytics (short_code, referer, ip, geo_location, browser, os, device_info) VALUES (?, ?, ?, ?, ?, ?, ?)", 
           [short_code, referer, ip, geo_location, browser, os, device]);
    db.run("UPDATE links SET click_count = click_count + 1 WHERE id = ?", [link.id]);

    res.redirect(link.long_url);
  });
});

// 3. Detailed Stats API
app.get('/api/stats/:short_code', (req, res) => {
  const { short_code } = req.params;
  db.all("SELECT * FROM analytics WHERE short_code = ? ORDER BY visited_at DESC", [short_code], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.listen(port, () => console.log(`NanoLink Evolved on http://localhost:${port}`));
