import { KLineData } from "klinecharts";
import { formatKlineData, formatNumber } from "../../utils/format";
import { bollingerBands } from "indicatorts";

const runTask = (klineData: KLineData[]) => {
  const kData = formatKlineData(klineData);

  const boll = bollingerBands(kData.closings);

  klineData.forEach((kline, index) => {
    const lower = formatNumber(boll.lowerBand[index]);
    const upper = formatNumber(boll.upperBand[index]);
    const middle = formatNumber(boll.middleBand[index]);

    console.log(kline.close, lower, upper, middle);

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
};

export default runTask;
