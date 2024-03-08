export type Params = Record<string, string | number | undefined>;

export interface FormatKData {
  highs: number[];
  lows: number[];
  closings: number[];
  opens: number[];

  timestamps: number[];
  volumes: number[];
  turnovers: number[];
}
