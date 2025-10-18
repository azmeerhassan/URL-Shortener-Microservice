const express = require('express');
const dns = require('dns')
const urlParser = require('url');
const { error } = require('console');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('URL Shortener Microservice is running 🚀');
});

const urls = []

app.post('/api/shorturl', (req, res)=>{
  const originalUrl = req.body.url
  console.log('Received URL: ',originalUrl);
  
  try {
    const parsedUrl = urlParser.parse(originalUrl)

    if(!parsedUrl.hostname){
      return res.json({error: "Invalid URL"})
    }
    dns.lookup(parsedUrl.hostname, (err, address)=>{
      if (err) {
        console.log('❌ DNS Lookup failed:', err);
        return res.json({ error: 'Invalid URL' });
      }
      const urlPattern = /^https?:\/\/.+/i;

    if(!urlPattern.test(originalUrl)){
    return res.json({error: "Invalid URL"})
  }
  const shortUrl = urls.length + 1
  urls.push({original_url: originalUrl, short_url: shortUrl})

  return res.json({
    original_url: originalUrl, short_url: shortUrl
  })
    })
  } catch (error) {
    console.error('⚠️ URL parse error:', error);
    return res.json({ error: 'Invalid URL' });
  }

  

  
})


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
