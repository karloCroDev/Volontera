type BaseResponse<T> = {
  status: number;
  message: string;
  additionalData?: T;
};

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
      ...additionalData,
    },
  };
}

export function toastResponseOutput<T extends object>({
  title,
  message,
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
      ...additionalData,
    },
  };
}

export function formResponseOutput<T extends object>({
  message,
  status,
  additionalData,
}: BaseResponse<T>) {
  return {
    status,
    body: {
      message,
      ...additionalData,
    },
  };
}
