import { KLineData } from "klinecharts";
import Kline from "./Kline";
import Statistics from "./Statistics";
import Trader from "./Trader";

class Rich {
  kline: Kline;
  statistics: Statistics;
  trader: Trader;
  klineData: KLineData[];
  constructor(originData: string[]) {
    this.kline = new Kline(originData);
    this.klineData = this.kline.klineData;
    this.statistics = new Statistics(this.klineData);

    this.trader = new Trader();
  }
}

export default Rich;
