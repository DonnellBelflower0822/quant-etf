import classnames from "classnames";
import dayjs from "dayjs";
import { KLineData } from "klinecharts";

export interface ITooltip {
  direction: "left" | "right";
  klineData: KLineData;
}

const getClassName = (value: number) => {
  return value > 0 ? "text-red-500" : "text-green-500";
};

const format = (value: number) => Math.round(value * 100) / 100;

const fields = [
  {
    label: "时  间",
    value: "timestamp",
    format(value: number) {
      return dayjs(value).format("YYYY-MM-DD");
    },
  },
  { label: "开盘价", value: "open" },
  { label: "最高价", value: "high" },
  { label: "最低价", value: "low" },
  { label: "收盘价", value: "close" },
  { label: "涨跌额", value: "chg", getClassName },
  {
    label: "涨跌幅",
    value: "turnover",
    getClassName,
    format: (value: number) => value + "%",
  },
  {
    label: "成交量",
    value: "volume",
    format: (value: number) => {
      if (value > 10000) {
        return format(value / 10000) + "万";
      }
      return value;
    },
  },
  {
    label: "成交额",
    value: "amount",
    format: (value: number) => {
      if (value > 100000000) {
        return format(value / 100000000) + "亿";
      }
      if (value > 10000) {
        return format(value / 10000) + "万";
      }
      return value;
    },
  },
];

const Tooltip: React.FC<{ tooltip?: ITooltip }> = ({ tooltip }) => {
  if (!tooltip) {
    return null;
  }

  const { direction, klineData } = tooltip;
  return (
    <div
      className={classnames(
        "absolute z-50 top-16 w-32 shadow-md bg-slate-50 p-2 box-border text-xs",
        {
          "left-2": direction !== "right",
          "right-[70px]": direction === "right",
        }
      )}
    >
      {fields.map((field) => {
        const value = klineData[field.value] as number;
        const className = field.getClassName ? field.getClassName(value) : "";
        return (
          <div key={field.label} className="flex">
            <div className="flex-1">{field.label}: </div>
            <div className={className}>
              {field.format ? field.format(value) : value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tooltip;
