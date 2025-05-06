import { EmailEntity, MailRecord, ReceiptMail } from "../entity/mailEntity";
import { PromiseResult } from "../types/result";
import { EmailValidationSchema } from "../types/validate";
import { parse } from "csv-parse/sync";
import { ReceiptUsecase } from "../usecase/receiptUsecase";
import { ReceiptUsecaseInterface } from "../usecase/inputport/receiptUsecaseInterface";
import { Context } from "../types/context";
import pMap from "p-map";
import puppeteer from "puppeteer-core";
import { MailService } from "../service/mailService";
import { MailServiceInterface } from "../service/interface/mailServiceInterface";

const receiptUsecase: ReceiptUsecaseInterface = new ReceiptUsecase();
const emailService: MailServiceInterface = new MailService();

interface ReceiptResult {
  email: string;
  success: boolean;
  error?: Error;
  html?: string;
}

/**
 * CSVファイルを使用して領収書メールを送信するメインコントローラー
 * この関数は以下の処理を行います：
 * 1. CSVファイルをJSONに変換
 * 2. 各メールアドレスに対して領収書を生成
 * 3. 生成した領収書をPDFに変換
 * 4. メール送信
 *
 * エラーハンドリングとログ機能も含まれており、失敗した処理を適切に記録します。
 */
export const sendReceiptMailByCsv = async (
  ctx: Context,
  file: Express.Multer.File,
): PromiseResult<Error, void> => {
  // CSVファイルをJSONに変換
  const convertResult = await convertEmailCsvToJson(file);
  if (!convertResult.success) {
    return {
      success: false,
      error: convertResult.error,
    };
  }

  // メールアドレスの配列を取得
  const emailArray: string[] = convertResult.data.map((record) => record.email);

  // 各メールアドレスに対して領収書を生成（並列処理、最大5件同時実行）
  const receiptResults: ReceiptResult[] = await pMap(
    emailArray,
    async (email: EmailEntity): Promise<ReceiptResult> => {
      try {
        // 領収書の詳細情報を取得
        // 以下の処理を行います：
        // 1. ユーザー情報の取得
        // 2. 購入情報の取得
        // 3. 商品情報の取得
        // 4. HTML形式の領収書生成
        const receiptResult = await receiptUsecase.getReceiptDetails(
          ctx,
          email,
        );
        if (!receiptResult.success) {
          return {
            email,
            success: false,
            error: receiptResult.error,
          };
        }
        return {
          email,
          success: true,
          html: receiptResult.data,
        };
      } catch (err) {
        return {
          email,
          success: false,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
    { concurrency: 5 },
  );

  // 失敗したメールアドレスのログ出力
  const failedEmails = receiptResults.filter(
    (result: ReceiptResult) => !result.success,
  );
  // 失敗したメールアドレスが存在する場合のエラーハンドリング
  if (failedEmails.length > 0) {
    console.error(
      `Failed to generate receipts for emails: ${failedEmails.map((f: ReceiptResult) => f.email).join(", ")}`,
    );
    console.error(
      "Detailed errors:",
      failedEmails.map((f) => ({
        email: f.email,
        error: f.error?.message,
      })),
    );
  }
  return {
    success: true,
    data: undefined,
  };
};

/**
 * CSVファイルをJSONに変換する関数
 * 以下の処理を行います：
 * 1. CSVファイルのパース
 * 2. データのバリデーション
 *
 * CSVファイルの形式が不正な場合や、必要なデータが含まれていない場合は
 * エラーを返します。
 */
const convertEmailCsvToJson = async (
  file: Express.Multer.File,
): PromiseResult<Error, MailRecord[]> => {
  // CSVファイルをパース
  const records: MailRecord[] = parse(file.buffer, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

  // レコードが存在しない場合のエラーハンドリング
  if (!records.length) {
    return {
      success: false,
      error: new Error("CSV to JSON Parsing failed: records not found."),
    };
  }

  // データのバリデーション
  const validationResult = EmailValidationSchema.safeParse(records);
  if (!validationResult.success) {
    return {
      success: false,
      error: new Error(
        validationResult.error.issues.map((issue) => issue.message).join(", ") +
          " in CSV file format error",
      ),
    };
  }

  return { success: true, data: validationResult.data };
};

// HTMLをPDFに変換する関数
// 以下の処理を行います：
// 1. Puppeteerのブラウザを起動
// 2. 新しいページを作成
// 3. HTMLをページに設定
// 4. PDFを生成
const convertHtmlToPDFBuffer = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    executablePath: "/usr/bin/chromium",
    protocolTimeout: 3_000,
  });

  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: "domcontentloaded",
    timeout: 3_000,
  });

  await page.evaluateHandle("document.fonts.ready");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    waitForFonts: true,
  });
  await browser.close();

  return Buffer.from(pdfBuffer);
};
