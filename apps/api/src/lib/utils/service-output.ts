type BaseResponse<T> = {
  status: number;
  message: string;
  data?: T;
};

// 1. For standard server fetches (includes success boolean)
export function serverFetchOutput<T extends object | undefined>({
  status,
  message,
  success,
  data,
}: BaseResponse<T> & { success: boolean }) {
  return {
    status,
    body: {
      success,
      message,
      ...(data ?? {}),
    } as { message: string; title: string; success: boolean } & T,
  };
}

export function toastResponseOutput<T extends object | undefined>({
  message,
  title,
  status,
  data,
}: BaseResponse<T> & {
  title: string;
}) {
  return {
    status,
    body: {
      message,
      title,
      ...(data ?? {}),
    } as { message: string; title: string } & T,
  };
}

export function formOutput<T extends object | undefined>({
  message,
  status,
  data,
}: BaseResponse<T>) {
  return {
    status,
    body: { message, ...(data ?? {}) } as { message: string } & T,
  };
}
