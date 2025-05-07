export const MAIL_TEMPLATES = {
  receipt: {
    label: '領収書メール送信',
    name: 'receipt',
  },
};
export const MAIL_TEMPLATES_OPTIONS = Object.values(MAIL_TEMPLATES);

export const EmailColumns = ['email'];
export const EmailData = [
  { email: 'dev@honggipyo.co.jp' },
  { email: 'noreply@honggipyo.app' },
  { email: 'hgoeshard@gmail.com' },
];

export const MESSAGES = {
  MAIL_TEMPLATE: 'メールテンプレート',
  MAIL_TEMPLATE_SELECT: 'メールテンプレートを選択',
  FILE_NOT_SELECTED: 'ファイルが選択されていません。',
  AGREE_REQUIRED: '領収書発行メール送信に同意してください。',
  CSV_FORMAT_REQUIRED: 'csv形式のファイルをアップロードしてください。',
  UPLOAD_SUCCESS: '領収書発行メール送信に成功しました！',
  UPLOAD_FAILURE: '領収書発行メール送信に失敗しました。',
  SELECT_CSV_FILE: 'CSVファイルを選択',
  SEND_RECEIPT_MAIL: '領収書発行メールを一括で送信',
  NOTICE_BEFORE_SEND:
    '※ 送信ボタンを押すと、CSVファイルのユーザー全員に領収書発行メールが送信されます。',
  CHECK_CSV_FILE: '必ずCSVファイルをご確認の上、送信してください。',
  CONSENT_QUESTION: '領収書発行メール送信に同意しますか？',
  CSV_FORMAT_GUIDE: '以下のフォーマットのcsvをアップロードしてください',
  PRODUCT_LIST_TITLE: '現在販売中の商品リスト',
  PRODUCT_LIST_EMPTY: '商品データを読み込み中...',
  PRODUCT_LIST_PRICE: '円',
};
