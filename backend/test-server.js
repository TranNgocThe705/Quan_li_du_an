import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

console.log('Server setup complete, waiting for connections...');
