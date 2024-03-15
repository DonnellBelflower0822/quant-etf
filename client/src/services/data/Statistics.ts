import { KLineData } from "klinecharts";

class Statistics {
  private klineData: KLineData[];

  constructor(klineData: KLineData[]) {
    this.klineData = klineData;
  }

  getTurnoverStatistics(max = 5) {
    const range = [...new Array(max * 2)].map((_, i) => {
      const value = max - i;
      return {
        title: `大于等于${value}`,
        condition: (val: number) => val >= value,
        count: 0,
      };
    });

    this.klineData.forEach((kline) => {
      const current = range.find((item) => item.condition(kline.turnover!));
      if (current) {
        current.count += 1;
      }
    });

    return range.map(({ title, count }) => ({ title, count }));
  }
}

export default Statistics;
