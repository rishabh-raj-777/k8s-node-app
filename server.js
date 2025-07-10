const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('🎉 Hello from Kubernetes! and Microsoft Azure!, Everything is working good...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
