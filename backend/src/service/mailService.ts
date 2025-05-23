import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { env } from "../env";
import { MailServiceInterface } from "./interface/mailServiceInterface";
import { Context } from "../types/context";
import {
  DynamicTemplate,
  MailDetails,
  Pdf,
  ReceiptMail,
} from "../entity/mailEntity";
import {
  MAIL_SENDER_ADDRESS,
  MAIL_SENDER_NAME,
  RECEIPT_FILE_NAME,
  RECEIPT_SUBJECT,
  RECEIPT_TEXT,
} from "../constants";
import { executeAndRetry } from "../helpers/retry";

const apiKey = env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

export class MailService implements MailServiceInterface {
  /**
   * メールを送信する共通関数
   * 以下の処理を行います：
   * 1. メールの基本情報設定
   * 2. PDF添付ファイルの設定
   * 3. メール送信（最大3回までリトライ）
   *
   * 一時的なネットワークエラーが発生した場合は、自動的にリトライします。
   * 送信結果はログに記録され、エラーが発生した場合でも適切に処理されます。
   */
  private async sendMail<T extends MailDetails>(
    ctx: Context,
    dynamicTemplate: DynamicTemplate<T>,
  ): Promise<void> {
    const { email, subject, text, pdf, dynamicData } = dynamicTemplate;

    // メールの基本情報を設定
    const msg: MailDataRequired = {
      to: email,
      from: {
        email: MAIL_SENDER_ADDRESS,
        name: MAIL_SENDER_NAME,
      },
      subject: subject,
      text: text,
      // 動的テンプレートデータが存在する場合は動的テンプレートデータを設定
      ...(dynamicData ? { dynamicTemplateData: dynamicData } : {}),
    };

    // PDF添付ファイルを設定
    if (pdf) {
      msg.attachments = [
        {
          content: pdf.buffer.toString("base64"),
          filename: pdf.fileName,
          type: "application/pdf",
          disposition: "attachment",
          contentId: "pdfAttachment",
        },
      ];
    }

    // メール送信を実行（最大3回までリトライ）
    await executeAndRetry({
      targetFn: async () => await sgMail.send(msg),
      maxCalls: 3, // 最大3回まで実行
      delayMs: 3000, // 3秒
    })
      .then(() => {
        console.info(`SendGrid Successfully Sent Email to [${email}], `);
      })
      .catch((error) => {
        console.error(
          `SendGrid Failed to Send Email to [${email}], ` + `Error: ${error}`,
        );
      });
  }

  /**
   * 領収書メールを送信する関数
   * 以下の処理を行います：
   * 1. 領収書PDFの設定
   * 2. メール送信
   *
   * 購入者に対して、添付ファイルとして領収書PDFを含む確認メールを送信します。
   * メールの件名と本文は定数ファイルで定義されています。
   */
  public async prepareReceiptMail(
    ctx: Context,
    email: string,
    receiptMail: ReceiptMail,
  ): Promise<void> {
    const { receiptPdfBuffer }: ReceiptMail = receiptMail;

    // メール送信
    await this.sendMail(ctx, {
      email: email,
      subject: RECEIPT_SUBJECT,
      text: RECEIPT_TEXT,
      pdf: {
        fileName: RECEIPT_FILE_NAME,
        buffer: receiptPdfBuffer,
      } as Pdf,
    });
  }
}
