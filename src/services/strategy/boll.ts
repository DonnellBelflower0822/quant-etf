import { KLineData } from "klinecharts";
import { formatKlineData, formatNumber } from "../../utils/format";
import { bollingerBands } from "indicatorts";
import Trader from "../trader";

enum StatusType {
  // 初始状态
  start,
  // 在上轨上面
  over_upper,
  // 站在上轨
  stand_upper,
  // 在上轨和中轨之间
  in_top,
  // 站在中轨
  stand_middle,
  // 在中轨和下轨之间
  in_bottom,
  // 站在下轨
  stand_lower,
  // 在下轨下面
  over_lower,
}

const calcStatusType = (
  close: number,
  lower: number,
  middle: number,
  top: number
) => {
  if (close > top) {
    return StatusType.over_upper;
  }
  if (close === top) {
    return StatusType.stand_upper;
  }

  if (close > middle) {
    return StatusType.in_top;
  }

  if (close === middle) {
    return StatusType.stand_middle;
  }

  if (close > lower) {
    return StatusType.in_bottom;
  }

  if (close === lower) {
    return StatusType.stand_lower;
  }

  return StatusType.over_lower;
};

const runTask = (klineData: KLineData[]) => {
  const kData = formatKlineData(klineData);

  const trader = new Trader();

  const boll = bollingerBands(kData.closings);

  let lastStatus: StatusType = StatusType.start;

  klineData.forEach((kline, index) => {
    if (index < 19) {
      lastStatus = StatusType.start;
      trader.hold(kline);

      return;
    }

    const { close } = kline;
    const lower = formatNumber(boll.lowerBand[index]);
    const upper = formatNumber(boll.upperBand[index]);
    const middle = formatNumber(boll.middleBand[index]);

    const status = calcStatusType(close, lower, middle, upper);

    if ([StatusType.over_upper, StatusType.stand_upper].includes(status)) {
      trader.sell(close, 2000, 0.2, kline);
    } else if (
      [StatusType.over_lower, StatusType.stand_lower].includes(status)
    ) {
      trader.buy(close, 2000, 0.2, kline);
    } else if (
      [
        StatusType.in_top,
        StatusType.over_lower,
        StatusType.stand_lower,
      ].includes(lastStatus) &&
      [StatusType.stand_middle, StatusType.in_bottom].includes(status)
    ) {
      trader.buy(close, 2000, 0.2, kline);
    } else if (
      [StatusType.in_bottom, StatusType.over_lower].includes(lastStatus) &&
      [StatusType.stand_middle, StatusType.in_top].includes(status)
    ) {
      trader.sell(close, 2000, 0.2, kline);
    } else {
      trader.hold(kline);
    }

    lastStatus = status;

    /**
     * 打标签：
      挤紧态（Squeeze）：当上下带宽之间的距离缩小到一个相对较小的范围内时，形成挤紧态。这表示市场处于低波动性的状态，往往是价格即将迎来大幅波动的前兆。
      开口向上（Expansion Up）：当价格趋势向上，并且上下带宽之间的距离扩大时，形成开口向上的形态。这表明市场的上涨趋势可能会继续，并且波动可能会加大。
      开口向下（Expansion Down）：当价格趋势向下，并且上下带宽之间的距离扩大时，形成开口向下的形态。这表明市场的下跌趋势可能会继续，并且波动可能会加大。
      收口态（Contraction）：当上下带宽之间的距离逐渐缩小，但价格并未出现明显的趋势时，形成收口态。这表明市场处于相对平稳的状态，波动性较低，可能是价格即将迎来大幅波动的前兆。
      跳空（Gap）：当价格直接穿越布林带的上下轨，而不是沿着带宽边缘移动时，形成跳空。跳空可能表明市场情绪剧烈波动，可能预示着重大事件或重大变化的发生。
      脱轨（Breach）：当价格突破布林带的上下轨时，形成脱轨。脱轨可能表明市场出现了强劲的趋势，可能会引发价格进一步向上或向下运动。
     */

    /**
     * 策略
     */
  });

  return trader;
};

export default runTask;
