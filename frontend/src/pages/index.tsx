import styled from 'styled-components';
import { useRouter } from 'next/router';
import { DragEvent, useState, useCallback } from 'react';
import { CheckBox } from '@/components/CheckBox';
import StyledTableComponent from '@/components/StyledTableComponent';
import { MAIL_TEMPLATES, MAIL_TEMPLATES_OPTIONS, MESSAGES } from '@/constants';
import { Loading } from '@/components/Loading';
import { getEmailExampleData } from '@/util';

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

/**
 * メインページコンポーネント
 * 以下の機能を提供します：
 * 1. メールテンプレートの選択
 * 2. CSVファイルのアップロード（ドラッグ＆ドロップ対応）
 * 3. 領収書メール送信のための確認チェック
 * 4. サーバーへのCSVファイル送信
 */
export default function Home() {
  // ルーターとステート管理
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isAgreeReceiptMail, setIsAgreeReceiptMail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * エラーメッセージ表示関数
   * alert() の代わりにステート管理して表示
   */
  const showError = useCallback((message: string) => {
    setError(message);
    alert(message);
  }, []);

  /**
   * メールテンプレート選択時の処理
   * テンプレートが変更されると、関連する状態をリセットします
   */
  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTemplate(value);
    setIsAgreeReceiptMail(false);
    setFileName(null);
    setCsvFile(null);
    setError(null);
  }, []);

  /**
   * ファイルがCSV形式かどうかを確認する関数
   */
  const isCsvFile = useCallback((file: File): boolean => {
    return file.type === 'text/csv' || file.name.endsWith('.csv');
  }, []);

  /**
   * ファイル選択時の処理
   * 選択されたファイルの名前を表示し、状態を更新します
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (isCsvFile(file)) {
          setFileName(file.name);
          setCsvFile(file);
        } else {
          showError(MESSAGES.CSV_FORMAT_REQUIRED);
          setFileName(null);
          setCsvFile(null);
        }
      }
    },
    [isCsvFile, showError]
  );

  /**
   * ドラッグ＆ドロップでファイルを受け取る処理
   * CSVファイルのみを受け付け、それ以外の形式はエラーメッセージを表示します
   */
  const handleFileDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setError(null);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (isCsvFile(file)) {
          setFileName(file.name);
          setCsvFile(file);
        } else {
          showError(MESSAGES.CSV_FORMAT_REQUIRED);
        }
      }
    },
    [isCsvFile, showError]
  );

  /**
   * ドラッグオーバー時のイベント処理
   * デフォルトの動作を防止します
   */
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  /**
   * 領収書メール送信の同意チェックボックスの状態変更処理
   */
  const handleCheckIsAgreeReceiptMail = useCallback((isChecked: boolean) => {
    setIsAgreeReceiptMail(isChecked);
  }, []);

  /**
   * メール送信前のバリデーション処理
   * ファイルの選択状態と同意チェックを確認します
   */
  const validateSendMail = useCallback(() => {
    if (!csvFile) {
      showError(MESSAGES.FILE_NOT_SELECTED);
      return false;
    }
    if (!isAgreeReceiptMail) {
      showError(MESSAGES.AGREE_REQUIRED);
      return false;
    }
    return true;
  }, [csvFile, isAgreeReceiptMail, showError]);

  /**
   * CSVファイル送信処理
   * フォーム送信時に実行され、APIを呼び出してCSVファイルを送信します
   * 成功時は成功メッセージを表示し、ページをリロードします
   * 失敗時はエラーメッセージを表示します
   */
  const handleCsvSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validateSendMail()) return;

      console.log('Upload file:', csvFile);

      // タイプガード
      if (!csvFile) return;

      const formData = new FormData();
      formData.append('file', csvFile);

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/sendEmailByCsv`, {
          method: 'POST',
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
            authorization: process.env.NEXT_PUBLIC_API_KEY_V2 ?? '',
          } as HeadersInit,
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }

        alert(MESSAGES.UPLOAD_SUCCESS);
        router.reload();
      } catch (error) {
        console.error('Error during upload:', error);
        showError(error instanceof Error ? error.message : MESSAGES.UPLOAD_FAILURE);
      } finally {
        setLoading(false);
      }
    },
    [csvFile, validateSendMail, router, showError]
  );

  // メールテンプレートに基づいたサンプルデータの取得
  const emailExample = getEmailExampleData(selectedTemplate);

  return (
    <Container>
      <ContentArea>
        <ScrollableTableContainer>
          {/* メールテンプレート選択エリア */}
          <ItemArea>
            <LabelArea>メールテンプレート</LabelArea>
            <SelectArea value={selectedTemplate} onChange={handleSelectChange}>
              <option value="" disabled>
                テンプレートを選択
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
              <Form onSubmit={handleCsvSubmit}>
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
                {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}

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
