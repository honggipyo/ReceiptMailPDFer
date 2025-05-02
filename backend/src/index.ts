import express from 'express';
import { sequelize } from './models';

const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('DB connection failed. Retrying in 3s...');
    setTimeout(connectWithRetry, 3000);
    return;
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

connectWithRetry();
