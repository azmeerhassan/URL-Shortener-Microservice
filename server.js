const express = require('express');
const dns = require('dns');
const urlParser = require('url');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Memory database
const urls = [];

// Root route
app.get('/', (req, res) => {
  res.send('URL Shortener Microservice is running 🚀');
});

// POST: shorten URL
app.post('/api/shorturl', (req, res) => {
  let originalUrl = req.body.url;
  console.log('Received URL:', originalUrl);

  // ✅ Check if it starts with http:// or https://
  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // ✅ Parse the URL
  let parsedUrl;
  try {
    parsedUrl = new URL(originalUrl);
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }

  // ✅ DNS lookup to verify the hostname
  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      console.log('❌ DNS Lookup failed:', err);
      return res.json({ error: 'invalid url' });
    }

    // ✅ If valid, store and respond
    const shortUrl = urls.length + 1;
    urls.push({ original_url: originalUrl, short_url: shortUrl });

    return res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
  });
});


// GET: redirect
app.get('/api/shorturl/:short_url', (req, res) => {
  const id = parseInt(req.params.short_url);
  const found = urls.find((entry) => entry.short_url === id);

  if (!found) {
    return res.json({ error: 'invalid url' });
  }

  return res.redirect(found.original_url);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
