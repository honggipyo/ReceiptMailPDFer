import { z } from "zod";

export const Email = z.string().email();

// メールアドレスの重複をチェックするためのZodスキーマ
// 以下の処理を行います：
// 1. メールアドレスの重複をチェック
// 2. 重複がある場合はエラーメッセージを返す
export const EmailValidationSchema = z
  .array(
    z.object({
      email: Email,
    }),
  )
  .refine(
    (data) => {
      const emails = data.map((item) => item.email);
      return new Set(emails).size === emails.length;
    },
    {
      message: "There are duplicate emails in the CSV file",
      path: ["email"],
    },
  );
