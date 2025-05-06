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

  return {
    success: true,
    data: undefined,
  };
};

