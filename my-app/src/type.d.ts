export type Params = Record<string, string | number | undefined>;
export type FetchKLineResult = {
  columns: string[];
  klines: Array<string | number>[];
};
