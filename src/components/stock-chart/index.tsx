import { KLineChartPro } from "@klinecharts/pro";
// 引入样式
import "@klinecharts/pro/dist/klinecharts-pro.css";
import React from "react";
import DefaultDatafeed from "./DefaultDatafeed";
import { periods } from "./constant";

const Chart: React.FC<{ code: string }> = ({ code }) => {
  const ref = React.useRef<KLineChartPro>();
  const id = React.useMemo(
    () => "id" + parseInt(Math.random() * 10000000 + ""),
    []
  );
  React.useEffect(() => {
    if (!code || ref.current) {
      return;
    }
    // 创建实例
    ref.current = new KLineChartPro({
      container: document.getElementById(id)!,
      // 初始化标的信息
      symbol: {
        exchange: "XNYS",
        market: "stocks",
        name: "1",
        shortName: code,
        ticker: "BABA",
        priceCurrency: "usd",
        type: "ADRC",
      },
      // 初始化周期
      periods,
      period: periods[0],
      datafeed: new DefaultDatafeed(),
      mainIndicators: ["BOLL"],
    });
  }, [code, id]);
  return <div id={id}></div>;
};

export default Chart;
