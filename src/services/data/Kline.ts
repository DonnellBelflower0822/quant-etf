import dayjs from "dayjs";
import { KLineData } from "klinecharts";
import Statistics from "./Statistics";
import Trader from "../trader";
import { FormatKData } from "../../type";

class Kline {
  static columns = [
    "timestamp",
    "open",
    "close",
    "high",
    "low",
    "volume",
    "amount",
    "zf",
    "turnover",
    "chg",
  ];

  klineData: KLineData[] = [];
  statistics: Statistics;
  trader: Trader;

  /**
   * @param originData
   * [
   *  '20212222,0.3,xx'
   * ]
   */
  constructor(originData: string[]) {
    this.klineData = originData.map((item) => {
      const arr = item.split(",");
      return Kline.columns.reduce(
        (prev, column, index) =>
          index === 0
            ? { ...prev, [column]: dayjs(arr[index]).valueOf() }
            : { ...prev, [column]: parseFloat(arr[index]) },
        {} as KLineData
      );
    });
    this.statistics = new Statistics(this.klineData);
    this.trader = new Trader();
  }

  get klineGroupByField() {
    return this.klineData.reduce(
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
  }
}

export default Kline;
