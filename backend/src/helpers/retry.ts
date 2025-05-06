/**
 * リトライ処理の共通ユーティリティ関数
 * 対象の関数がタイムアウトエラーを発生した場合、指定された最大回数までリトライする。
 * これにより、一時的なネットワーク障害やサービス遅延などの問題に対応できる。
 */
export const executeAndRetry = async <T>({
  targetFn,
  maxCalls,
  delayMs,
}: {
  targetFn: () => Promise<T>; // 実行対象の非同期関数
  maxCalls: number; // 最大実行回数
  delayMs: number; // リトライ間の遅延時間（ミリ秒）
}): Promise<T> => {
  const TIMEOUT = "ETIMEDOUT";

  // 最大実行回数までリトライ
  for (let tries = 0; tries < maxCalls; tries++) {
    if (tries !== 0) {
      // リトライ間の遅延時間を設定（指数バックオフの原理を適用）
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    try {
      // 実行対象の非同期関数を実行
      const result = await targetFn();
      return result;
    } catch (err) {
      const error = err as Error;
      if (!error.message.includes(TIMEOUT)) {
        // タイムアウトエラーでない場合はエラーを再スロー
        // 本質的な問題がある場合は、リトライせずにすぐに失敗させる
        throw err;
      }

      console.error(
        `Retry attempt ${tries + 1} for function ${
          targetFn.name
        } after ${delayMs}ms. Error: ${error.message}`,
      );
    }
  }

  // 最大実行回数を超えた場合はエラーをスロー
  // すべてのリトライが失敗した場合は、最終的にエラーを発生させる
  console.error(
    `Retry attempts exceeded in executeAndRetry. fn: ${targetFn.name}`,
  );
  throw new Error("Retry attempts exceeded");
};
