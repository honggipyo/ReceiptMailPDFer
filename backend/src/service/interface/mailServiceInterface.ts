import { ReceiptMail } from "../../entity/mailEntity";
import { Context } from "../../types/context";

export interface MailServiceInterface {
  prepareReceiptMail(
    ctx: Context,
    email: string,
    receiptMail: ReceiptMail
  ): Promise<void>;
}
