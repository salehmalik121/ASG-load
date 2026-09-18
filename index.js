const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.get('/hashes', (req, res) => {
  const hashes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(32).toString('hex')
  );

  res.json({ hashes });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
