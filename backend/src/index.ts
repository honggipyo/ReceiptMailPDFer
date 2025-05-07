import express from "express";
import { sequelize } from "./models";
import multer from "multer";
import { badRequest, Boom } from "@hapi/boom";
import { sendReceiptMailByCsv } from "./controller/email";
import { Context } from "./types/context";
import { env } from "./env";
import cors from "cors";
import { ProductUsecase } from "./usecase/productUsecase";
import { ProductUsecaseInterface } from "./usecase/inputport/productUsecaseInterface";

const app = express();
const PORT = env.PORT;
const upload = multer({ storage: multer.memoryStorage() });

const productUsecase: ProductUsecaseInterface = new ProductUsecase();

app.use(express.json());
app.use(cors());

/**
 * CSVファイルを使用して領収書メールを送信するエンドポイント
 * このエンドポイントは以下の処理を行います：
 * 1. CSVファイルのアップロードを受け付け
 * 2. トランザクションを開始してデータベース操作の整合性を保証
 * 3. エラーハンドリングとレスポンスの返却
 *
 * CSVファイルには、ユーザーのメールアドレス情報が含まれている必要があります。
 * このエンドポイントは、CSVファイルを解析し、各ユーザーに対して領収書を生成して送信します。
 */
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

      // トランザクションを開始し、CSVファイルの処理を実行
      const result = await sendReceiptMailByCsv(
        { tx: await sequelize.transaction() } as Context,
        file,
      );
      if (!result.success) {
        return next(new Boom(result.error));
      }

      // 処理が成功した場合は204（No Content）を返却
      res.status(204).end();
    } catch (err) {
      console.error("Error in handler:", err);
      return next(new Boom("Server Error", { statusCode: 500 }));
    }
  },
);

/**
 * 全商品情報を取得するエンドポイント
 * このエンドポイントはデータベースから全ての商品情報を取得し、JSON形式で返します
 * クリーンアーキテクチャパターンに基づき、ユースケースを使用して実装
 */
app.get(
  "/products",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      // ユースケースを使用して商品リストを取得
      const result = await productUsecase.getAllProducts({
        tx: await sequelize.transaction(),
      } as Context);
      if (!result.success) {
        return next(new Boom(result.error, { statusCode: 500 }));
      }

      // 商品リストをJSONで返す
      res.status(200).json(result.data);
    } catch (err) {
      console.error("Error in getAllProducts:", err);
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
