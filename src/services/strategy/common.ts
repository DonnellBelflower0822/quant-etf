import { KLineData } from "klinecharts";
import Kline from "../data/Kline";

class Common {
  klineInstance: Kline;

  constructor(klineInstance: Kline) {
    this.klineInstance = klineInstance;
  }

  prepare() {}
  run(kline: KLineData, index: number) {
    console.log(kline, index);
  }
}

export default Common;

export const runTask = (Ctor: typeof Common, klineInstance: Kline) => {
  const instance = new Ctor(klineInstance);
  instance.prepare();

  klineInstance.klineData.forEach((kline, index) => {
    instance.run(kline, index);
  });

  return klineInstance;
};
