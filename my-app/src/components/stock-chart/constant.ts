export enum Period {
  day = "day",
  week = "week",
  month = "month",
}

export const periods = [
  { multiplier: 1, timespan: Period["day"], text: "日k" },
  { multiplier: 1, timespan: Period["week"], text: "周k" },
  { multiplier: 1, timespan: Period["month"], text: "月k" },
];

export const PeriodMap = {
  [Period.day]: "daily",
  [Period.week]: "weekly",
  [Period.month]: "monthly",
};
