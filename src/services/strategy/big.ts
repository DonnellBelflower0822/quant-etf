import Common from "./common";
import { KLineData } from "klinecharts";

class Big extends Common {
  prepare(): void {}

  run(kline: KLineData) {
    const { close, turnover = 0 } = kline;
    const { trader } = this.klineInstance;
    if (turnover > 3) {
      trader.sell(close, 4000, 0, kline);
    } else if (turnover > 2) {
      trader.sell(close, 2000, 0, kline);
    } else if (turnover > 1) {
      trader.sell(close, 1000, 0, kline);
    } else if (turnover <= -4.5) {
      trader.buy(close, 8000, 0, kline);
    } else if (turnover <= -3) {
      trader.buy(close, 4000, 0, kline);
    } else if (turnover <= -1.5) {
      trader.buy(close, 2000, 0, kline);
    } else {
      trader.hold(kline);
    }
  }
}

export default Big;
