const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());

// Serve HTML, CSS, and worker.js from current directory
app.use(express.static(__dirname));

app.get('/ping', (req, res) => res.sendStatus(204));

const chunk = crypto.randomBytes(1024 * 1024); // 1MB chunk
app.get('/download', (req, res) => {
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store, no-cache');
  for (let i = 0; i < 50; i++) {
    res.write(chunk);
  }
  res.end();
});

app.post('/upload', (req, res) => {
  req.on('data', () => {});
  req.on('end', () => res.sendStatus(200));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));