import { z } from "zod";
import { Email } from "../types/validate";

export type DynamicTemplate<T> = {
  email: EmailEntity;
  subject: string;
  text: string;
  pdf?: Pdf;
  dynamicData?: T;
};

export type MailDetails = Record<string, string>;

export type MailRecord = {
  email: string;
};

export type ReceiptMail = {
  receiptPdfBuffer: Buffer;
};

export type Pdf = {
  fileName: string;
  buffer: Buffer;
};

export type EmailEntity = z.infer<typeof Email>;
