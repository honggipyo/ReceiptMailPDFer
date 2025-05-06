import { notFound } from "@hapi/boom";

export type Result<E, T> =
  | Readonly<{ success: false; error: E }>
  | Readonly<{ success: true; data: T }>;

export type PromiseResult<E, T> = Promise<Result<E, T>>;

// データ取得の成否をチェックし、成否に応じてエラーハンドリングを行う関数
// 以下の処理を行います：
// 1. データ取得の成否をチェック
// 2. 成否に応じてエラーハンドリングを行う
// 3. データ取得が成功した場合はデータを返す
export const handleGetDataResult = async <T extends Array<any> | object>(
  result: PromiseResult<Error, T | null>,
  notFoundMessage: string,
): Promise<Result<Error, T>> => {
  // データ取得の成否をチェック
  const resolved = await result;
  if (!resolved.success) {
    return {
      success: false,
      error: resolved.error,
    };
  }
  // データ取得が成功した場合はデータを返す
  if (
    !resolved.data ||
    (Array.isArray(resolved.data) && !resolved.data.length)
  ) {
    return {
      success: false,
      error: notFound(notFoundMessage),
    };
  }
  return {
    success: true,
    data: resolved.data,
  };
};

export const isSuccess = <E, T>(
  result: Result<E, T>,
): result is Readonly<{ success: true; data: T }> => {
  return result.success;
};

export const isError = <E, T>(
  result: Result<E, T>,
): result is Readonly<{ success: false; error: E }> => {
  return !result.success;
};
