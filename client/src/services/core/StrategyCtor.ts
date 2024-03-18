import { KLineData } from "klinecharts";
import Rich from "./Rich";

class Common {
  richInstance: Rich;

  constructor(klineInstance: Rich) {
    this.richInstance = klineInstance;
  }

  prepare() {}
  run(kline: KLineData, index: number) {
    console.log(kline, index);
  }
}

export default Common;

export const runTask = (Ctor: typeof Common, klineInstance: Rich) => {
  const instance = new Ctor(klineInstance);
  instance.prepare();

  klineInstance.klineData.forEach((kline, index) => {
    instance.run(kline, index);
  });

  return klineInstance;
};
