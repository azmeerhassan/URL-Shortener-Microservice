const express = require('express');
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


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
