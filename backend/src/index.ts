import express from 'express';
import { sequelize } from './models';

const app = express();
const PORT = env.PORT;
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cors());

app.post(
  "/send-receipt-mail-by-csv",
  upload.single("file"),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const file = req.file;
      if (!file) {
        console.log("No file found in request");
        return next(badRequest("Parameter invalid", { statusCode: 400 }));
      }
    } catch (err) {
      console.error("Error in handler:", err);
      return next(new Boom("Server Error", { statusCode: 500 }));
    }
  },
);

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
