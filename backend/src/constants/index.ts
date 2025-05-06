// メール送信に必要な定数を定義

// 送信元のメールアドレス情報
export const MAIL_SENDER_NAME = "領収書発行サービス";
export const MAIL_SENDER_ADDRESS = "noreply@example.com";

// 領収書メールの件名（タイトル）
export const RECEIPT_SUBJECT =
  "【ご購入ありがとうございます】領収書のお送付について";

// 領収書メールの本文
// ユーザーフレンドリーな内容で、購入者への感謝と領収書の確認を促すメッセージ
export const RECEIPT_TEXT = `
ご購入いただき、誠にありがとうございます。

この度のご購入の領収書をPDFファイルにて添付させていただきました。
ご確認のほど、よろしくお願いいたします。

ご不明な点がございましたら、お気軽にお問い合わせください。

※このメールへの返信は受け付けておりません。
`;

// 添付ファイルの名前
export const RECEIPT_FILE_NAME = "receipt.pdf";
