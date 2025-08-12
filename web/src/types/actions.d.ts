export type ActionSuccess<TData> = {
  ok: true;
  data: TData;
};

export type ActionError = {
  ok: false;
  error: string;
};

export type Action<TData> = Promise<ActionSuccess<TData> | ActionError>;
