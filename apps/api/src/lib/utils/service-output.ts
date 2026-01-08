type BaseResponse<T> = {
  status: number;
  message: string;
  additionalData?: T;
};

// 1. For standard server fetches (includes success boolean)
export function serverFetchOutput<T extends object>({
  status,
  message,
  success,
  additionalData,
}: BaseResponse<T> & { success: boolean }) {
  return {
    status,
    body: {
      success,
      message,
      ...(additionalData ?? {}),
    } as { message: string; title: string; success: boolean } & T,
  };
}

export function toastResponseOutput<T extends object>({
  message,
  title,
  status,
  additionalData,
}: BaseResponse<T> & {
  title: string;
}) {
  return {
    status,
    body: {
      message,
      title,
      ...(additionalData ?? {}),
    } as { message: string; title: string } & T,
  };
}

export function formOutput<T extends object | undefined>({
  message,
  status,
  additionalData,
}: BaseResponse<T>) {
  return {
    status,
    body: { message, ...(additionalData ?? {}) } as { message: string } & T,
  };
}
