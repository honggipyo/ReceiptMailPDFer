import { useState, useCallback } from 'react';

/**
 * APIリクエストのオプションを定義するインターフェース
 */
interface ApiRequestOptions {
  url: string; // リクエスト先のURL
  method: string; // HTTPメソッド (GET, POST, PUT, DELETE等)
  body?: BodyInit | null; // リクエストボディ (FormData, JSON等)
  headers?: HeadersInit; // リクエストヘッダー
}

/**
 * APIリクエストを処理するカスタムフック
 *
 * このフックは以下の機能を提供します：
 * - リクエスト中のローディング状態管理
 * - エラーメッセージの保持と処理
 * - HTTP要求の送信と応答の処理
 * - FormDataオブジェクトの適切な処理
 *
 * @returns {object} ローディング状態、エラー、リクエスト送信関数、エラークリア関数を含むオブジェクト
 */
export const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * APIリクエストを送信する関数
   *
   * @param options APIリクエストに必要なオプション（URL、メソッド、ボディ、ヘッダー）
   * @returns 成功した場合はtrue、失敗した場合はfalseを返す
   */
  const sendRequest = useCallback(async (options: ApiRequestOptions): Promise<boolean> => {
    const { url, method, body, headers = {} } = options;

    try {
      // リクエスト開始時の状態設定
      setIsLoading(true);
      setError(null);

      // FormDataオブジェクトの場合、Content-Typeヘッダーを設定しない
      // ブラウザが自動的にmultipart/form-dataとboundaryを設定する
      const isFormData = body instanceof FormData;

      // 基本ヘッダー設定
      const defaultHeaders: HeadersInit = {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
        authorization: process.env.NEXT_PUBLIC_API_KEY_V2 ?? '',
        ...headers,
      };

      // デバッグ用のログ出力（開発環境でのみ必要）
      console.log('Sending API request to:', url);
      console.log('Request method:', method);
      console.log('Is FormData:', isFormData);
      console.log('Request headers:', defaultHeaders);

      // fetchを使用してAPIリクエストを送信
      const response = await fetch(url, {
        method,
        headers: defaultHeaders,
        body,
      });

      console.log('Response status:', response.status);

      // レスポンスステータスが正常でない場合のエラー処理
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(errorText || response.statusText);
      }

      console.log('API request successful');
      return true;
    } catch (error) {
      // エラー発生時の処理
      console.error('API request error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'リクエスト中にエラーが発生しました。';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      // 最終的にローディング状態を解除
      console.log('Setting loading state to false');
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading, // ローディング状態
    error, // エラーメッセージ（存在する場合）
    sendRequest, // リクエスト送信関数
    clearError: () => setError(null), // エラーメッセージをクリアする関数
  };
};
