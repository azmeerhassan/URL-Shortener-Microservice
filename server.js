const express = require('express');
const dns = require('dns');
const urlParser = require('url');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('URL Shortener Microservice is running 🚀');
});

const urls = [];

// POST endpoint
app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;
  console.log('Received URL:', original_url);

  // Validate general URL structure
  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  // Parse the URL
  const parsedUrl = urlParser.parse(original_url);
  if (!parsedUrl.hostname) {
    return res.json({ error: 'invalid url' });
  }

  // DNS lookup to ensure domain exists
  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      console.log('❌ DNS lookup failed:', err);
      return res.json({ error: 'invalid url' });
    }

    // Store and return mapping
    const short_url = urls.length + 1;
    urls.push({ original_url, short_url });

    return res.json({ original_url, short_url });
  });
});

// GET endpoint
app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = parseInt(req.params.short_url);
  const found = urls.find((entry) => entry.short_url === short_url);

  if (!found) {
    return res.json({ error: 'invalid url' });
  }

  return res.redirect(found.original_url);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
