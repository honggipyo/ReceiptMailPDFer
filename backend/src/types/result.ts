export type Result<E, T> =
  | Readonly<{ success: false; error: E }>
  | Readonly<{ success: true; data: T }>;

export type PromiseResult<E, T> = Promise<Result<E, T>>;
