const express = require('express');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('URL Shortener Microservice is running 🚀');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
