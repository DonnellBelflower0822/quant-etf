import { KLineData } from "klinecharts";
import { FormatKData } from "../type";

export const formatKlineData = (klineData: KLineData[]) => {
  return klineData.reduce(
    (obj, item) => {
      obj.closings.push(item.close);
      obj.highs.push(item.high);
      obj.opens.push(item.open);
      obj.lows.push(item.low);
      obj.timestamps.push(item.timestamp);
      obj.volumes.push(item.volume!);
      obj.turnovers.push(item.turnover!);
      return obj;
    },
    {
      closings: [],
      highs: [],
      lows: [],
      opens: [],
      timestamps: [],
      volumes: [],
      turnovers: [],
    } as unknown as FormatKData
  );
};

export const formatNumber = (x: number, digest = 3) =>
  parseInt(Math.round(x * Math.pow(10, digest)) + "") / Math.pow(10, digest);
