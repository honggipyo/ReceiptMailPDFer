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
    console.log("Database connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed. Retrying in 3s...");
    setTimeout(connectWithRetry, 3000);
  }
};

connectWithRetry();

export default app;
