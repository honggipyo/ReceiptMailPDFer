import { MailService } from "../service/mailService";
import { Context } from "../types/context";
import sgMail from "@sendgrid/mail";
import { RECEIPT_FILE_NAME, RECEIPT_SUBJECT, RECEIPT_TEXT } from "../constants";

// モックの設定
jest.mock("@sendgrid/mail");

describe("MailService Tests", () => {
  let mailService: MailService;
  let mockContext: Context;

  beforeEach(() => {
    mockContext = {
      tx: {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any,
    };

    mailService = new MailService();

    // モックのリセット
    jest.clearAllMocks();
  });

  describe("prepareReceiptMail", () => {
    it("正常系: 領収書メールを送信できること", async () => {
      const mockSend = jest.fn().mockResolvedValue({});
      (sgMail.send as jest.Mock) = mockSend;

      const email = "test@example.com";
      const receiptPdfBuffer = Buffer.from("test pdf content");

      await mailService.prepareReceiptMail(mockContext, email, {
        receiptPdfBuffer,
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: RECEIPT_SUBJECT,
          text: RECEIPT_TEXT,
          attachments: expect.arrayContaining([
            expect.objectContaining({
              filename: RECEIPT_FILE_NAME,
              type: "application/pdf",
              disposition: "attachment",
            }),
          ]),
        }),
      );
    });

    it("異常系: メール送信に失敗した場合", async () => {
      const mockSend = jest.fn().mockRejectedValue(new Error("Send failed"));
      (sgMail.send as jest.Mock) = mockSend;

      const email = "test@example.com";
      const receiptPdfBuffer = Buffer.from("test pdf content");

      try {
        await mailService.prepareReceiptMail(mockContext, email, {
          receiptPdfBuffer,
        });
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(mockSend).toHaveBeenCalled();
    });

    it("正常系: リトライ後に成功する場合", async () => {
      const mockSend = jest
        .fn()
        .mockRejectedValueOnce(new Error("First attempt failed"))
        .mockRejectedValueOnce(new Error("Second attempt failed"))
        .mockResolvedValueOnce({});
      (sgMail.send as jest.Mock) = mockSend;

      const email = "test@example.com";
      const receiptPdfBuffer = Buffer.from("test pdf content");

      await mailService.prepareReceiptMail(mockContext, email, {
        receiptPdfBuffer,
      });

      expect(mockSend).toHaveBeenCalled();
    });
  });
});
