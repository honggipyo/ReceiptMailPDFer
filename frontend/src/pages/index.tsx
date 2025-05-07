import styled from 'styled-components';
import { useRouter } from 'next/router';
import { DragEvent, useState, useCallback } from 'react';
import { CheckBox } from '@/components/CheckBox';
import StyledTableComponent from '@/components/StyledTableComponent';
import { MAIL_TEMPLATES, MAIL_TEMPLATES_OPTIONS, MESSAGES } from '@/constants';
import { Loading } from '@/components/Loading';
import { getEmailExampleData } from '@/util';
import { useApiRequest } from '@/hooks';
import { GetServerSideProps } from 'next';
import { Product } from '@/types';

/**
 * スタイル付きコンポーネント定義
 * アプリケーションのUIレイアウトとスタイルを設定
 */
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: white;
`;
const ContentArea = styled.div`
  width: 80%;
  padding: 30px 20px 0 60px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ItemArea = styled.div`
  display: flex;
  width: 500px;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const CsvArea = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-between;
  align-items: left;
  margin-top: 50px;
  height: 200px;
  flex-direction: column;
`;

const LabelArea = styled.div`
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: left;
  color: #000000;
`;

const SelectArea = styled.select.attrs({ required: true })`
  box-shadow: 0px 0px 10px 0px #0000001a;
  border: none;
  width: 330px;
  height: 46px;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
`;

const ScrollableTableContainer = styled.div`
  overflow: auto;
  flex-grow: 1;
  margin-bottom: 40px;
`;

const Form = styled.form``;

const FileInputContainer = styled.div`
  border: 2px dashed #b2b2b2;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  width: 500px;
  height: 200px;
  justify-content: center;
  cursor: pointer;
  background-color: #e9ecef;
  &:hover {
    opacity: 0.5;
  }
`;

const FileInputLabel = styled.label`
  color: #b2b2b2;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const FileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  width: 500px;
  height: 60px;
  padding: 10px;
  margin: 20px 0;
  background: #ff9900;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0em;

  &:hover {
    opacity: 0.8;
  }
`;

const CheckBoxDescription = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 23.17px;
  text-align: left;
  color: #070002e5;
`;
const CheckBoxGroup = styled.div`
  flex-direction: column;
  gap: 16px;
  margin-top: 30px;
`;

const CsvFormatText = styled.p`
  font-size: 16px;
  margin: 10px 0;
`;


// ページプロップスの型定義
interface HomeProps {
  products: Product[];
}

/**
 * メインページコンポーネント
 *
 * このコンポーネントは以下の機能を提供します：
 * 1. メールテンプレートの選択機能
 * 2. 商品リストの表示
 * 3. CSVファイルのアップロード機能（ドラッグ＆ドロップ対応）
 * 4. 領収書メール送信のための確認チェック
 * 5. サーバーへのCSVファイル送信機能
 *
 * プロセスフロー:
 * 1. ユーザーがメールテンプレートを選択
 * 2. 商品リストから必要な情報を確認
 * 3. CSVファイルをアップロード（ドラッグ＆ドロップまたはファイル選択）
 * 4. 同意チェックボックスにチェック
 * 5. 送信ボタンをクリックしてバックエンドAPIにリクエスト送信
 * 6. 結果に応じたメッセージを表示
 */
export default function Home({ products }: HomeProps) {
  // ステート管理の定義
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(''); // 選択されたメールテンプレート
  const [fileName, setFileName] = useState<string | null>(null); // 選択されたファイル名
  const [csvFile, setCsvFile] = useState<File | null>(null); // CSVファイルオブジェクト
  const [isAgreeReceiptMail, setIsAgreeReceiptMail] = useState(false); // 同意チェックボックスの状態
  const [localError, setLocalError] = useState<string | null>(null); // ローカルエラーメッセージ

  // APIリクエスト用カスタムフックの使用
  const { isLoading, error: apiError, sendRequest, clearError } = useApiRequest();

  /**
   * エラーメッセージ表示関数
   * ローカルステートにエラーメッセージを設定し、アラートも表示します
   *
   * @param message 表示するエラーメッセージ
   */
  const showError = useCallback((message: string) => {
    setLocalError(message);
    alert(message);
  }, []);

  /**
   * メールテンプレート選択時の処理
   * テンプレートが変更されると、すべての関連状態をリセットします
   *
   * @param event セレクトボックスの変更イベント
   */
  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setSelectedTemplate(value);
      setIsAgreeReceiptMail(false);
      setFileName(null);
      setCsvFile(null);
      setLocalError(null);
      clearError(); // APIエラーもクリア
    },
    [clearError]
  );

  /**
   * ファイルがCSV形式かどうかを確認する関数
   * MIME typeまたはファイル拡張子からCSVファイルかどうかを判断します
   *
   * @param file 検証するファイルオブジェクト
   * @returns CSVファイルの場合はtrue、それ以外はfalse
   */
  const isCsvFile = useCallback((file: File): boolean => {
    return file.type === 'text/csv' || file.name.endsWith('.csv');
  }, []);

  /**
   * ファイル選択ダイアログからのファイル選択時の処理
   * 有効なCSVファイルの場合はステートを更新し、そうでない場合はエラーを表示します
   *
   * @param e ファイル入力要素の変更イベント
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // エラーメッセージをリセット
      setLocalError(null);
      clearError();

      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (isCsvFile(file)) {
          // 有効なCSVファイルの場合
          setFileName(file.name);
          setCsvFile(file);
        } else {
          // 無効なファイル形式の場合
          showError(MESSAGES.CSV_FORMAT_REQUIRED);
          setFileName(null);
          setCsvFile(null);
        }
      }
    },
    [isCsvFile, showError, clearError]
  );

  /**
   * ドラッグ＆ドロップでファイルを受け取る処理
   * CSVファイルのみを受け付け、それ以外の形式はエラーメッセージを表示します
   *
   * @param e ドラッグ＆ドロップイベント
   */
  const handleFileDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault(); // デフォルトのブラウザ動作を防止

      // エラーメッセージをリセット
      setLocalError(null);
      clearError();

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0]; // 最初のファイルのみ処理
        if (isCsvFile(file)) {
          // 有効なCSVファイルの場合
          setFileName(file.name);
          setCsvFile(file);
        } else {
          // 無効なファイル形式の場合
          showError(MESSAGES.CSV_FORMAT_REQUIRED);
        }
      }
    },
    [isCsvFile, showError, clearError]
  );

  /**
   * ドラッグオーバー時のイベント処理
   * デフォルトのブラウザ動作を防止します
   *
   * @param e ドラッグオーバーイベント
   */
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  /**
   * 領収書メール送信の同意チェックボックスの状態変更処理
   *
   * @param isChecked チェックボックスの新しい状態
   */
  const handleCheckIsAgreeReceiptMail = useCallback((isChecked: boolean) => {
    setIsAgreeReceiptMail(isChecked);
  }, []);

  /**
   * メール送信前のバリデーション処理
   * ファイルの選択状態と同意チェックを確認し、問題がある場合はエラーメッセージを表示します
   *
   * @returns バリデーション成功の場合はtrue、失敗の場合はfalse
   */
  const validateSendMail = useCallback(() => {
    if (!csvFile) {
      // ファイルが選択されていない場合
      showError(MESSAGES.FILE_NOT_SELECTED);
      return false;
    }
    if (!isAgreeReceiptMail) {
      // 同意チェックボックスがチェックされていない場合
      showError(MESSAGES.AGREE_REQUIRED);
      return false;
    }
    return true; // すべての検証が成功
  }, [csvFile, isAgreeReceiptMail, showError]);

  /**
   * CSVファイル送信処理
   * フォーム送信時に実行され、バリデーション後にAPIを呼び出しCSVファイルを送信します
   * 成功時は成功メッセージを表示し、ページをリロードします
   * 失敗時はエラーメッセージを表示します
   *
   * @param event フォーム送信イベント
   */
  const handleCsvSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // フォームのデフォルト送信を防止

      // 送信前のバリデーション
      if (!validateSendMail()) return;

      console.log('Upload file:', csvFile);

      // タイプガード（冗長だがTypeScriptのために必要）
      if (!csvFile) return;

      // FormDataオブジェクトの作成とファイルの追加
      const formData = new FormData();
      formData.append('file', csvFile);

      // APIリクエストの送信
      const success = await sendRequest({
        url: '/api/sendEmailByCsv',
        method: 'POST',
        body: formData,
      });

      // APIリクエスト結果の処理
      if (success) {
        // 成功時の処理
        alert(MESSAGES.UPLOAD_SUCCESS);
        router.reload(); // ページをリロード
      } else {
        // 失敗時の処理：エラーメッセージを表示
        alert(apiError || MESSAGES.UPLOAD_FAILURE);
      }
    },
    [csvFile, validateSendMail, sendRequest, router, apiError]
  );

  // メールテンプレートに基づいたサンプルデータの取得
  const emailExample = getEmailExampleData(selectedTemplate);

  return (
    <Container>
      <ContentArea>
        <ScrollableTableContainer>
          {/* メールテンプレート選択エリア */}
          <ItemArea>
            <LabelArea>{MESSAGES.MAIL_TEMPLATE}</LabelArea>
            <SelectArea value={selectedTemplate} onChange={handleSelectChange}>
              <option value="" disabled>
                {MESSAGES.MAIL_TEMPLATE_SELECT}
              </option>
              {MAIL_TEMPLATES_OPTIONS.map(option => (
                <option key={option.name} value={option.name}>
                  {option.label}
                </option>
              ))}
            </SelectArea>
          </ItemArea>

          {/* 領収書テンプレート選択時のCSVアップロードエリア */}
          {selectedTemplate === MAIL_TEMPLATES.receipt.name && (
            <CsvArea>
              <Form onSubmit={handleCsvSubmit} encType="multipart/form-data">
                {/* ファイルアップロード領域（ドラッグ＆ドロップ対応） */}
                <FileInputContainer onDrop={handleFileDrop} onDragOver={handleDragOver}>
                  <FileInputLabel htmlFor="fileInput">
                    {fileName ? fileName : MESSAGES.SELECT_CSV_FILE}
                  </FileInputLabel>
                  <FileInput
                    name="file"
                    id="fileInput"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </FileInputContainer>

                {/* エラーメッセージ表示 */}
                {(localError || apiError) && (
                  <div style={{ color: 'red', marginTop: '8px' }}>{localError || apiError}</div>
                )}

                {/* 注意事項と同意チェックボックス */}
                <CheckBoxGroup>
                  <CheckBoxDescription>{MESSAGES.NOTICE_BEFORE_SEND}</CheckBoxDescription>
                  <CheckBoxDescription>{MESSAGES.CHECK_CSV_FILE}</CheckBoxDescription>
                  <CheckBox
                    label={MESSAGES.CONSENT_QUESTION}
                    isLoading={isLoading}
                    onChange={handleCheckIsAgreeReceiptMail}
                  />
                </CheckBoxGroup>

                {/* 送信ボタンまたはローディング表示 */}
                {isLoading ? (
                  <Loading />
                ) : (
                  <SubmitButton type="submit" disabled={!csvFile || !isAgreeReceiptMail}>
                    {MESSAGES.SEND_RECEIPT_MAIL}
                  </SubmitButton>
                )}
              </Form>

              {/* CSVファイルのフォーマット説明とサンプル表示 */}
              <CsvFormatText>{MESSAGES.CSV_FORMAT_GUIDE}</CsvFormatText>
              <StyledTableComponent columns={emailExample.columns} datas={emailExample.data} />
            </CsvArea>
          )}
        </ScrollableTableContainer>
      </ContentArea>
    </Container>
  );
}

/**
 * サーバーサイドでデータを取得する関数
 * データベースから商品リストを取得し、ページプロップスとして提供します
 */
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    // バックエンドAPIから商品データを取得
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/products`);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products: Product[] = await response.json();

    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    // エラー発生時でもアプリが動作するように空の配列を返す
    return {
      props: {
        products: [],
      },
    };
  }
};
