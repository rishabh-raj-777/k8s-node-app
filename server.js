const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('🎉 Hello from Kubernetes! and Microsoft Azure!, This is our 1st deploy...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
