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
}
