/* eslint-disable @typescript-eslint/no-explicit-any */
import { KLineChartPro } from "klinecharts-pro-xxz";
// 引入样式
import "klinecharts-pro-xxz/dist/klinecharts-pro.css";
import React from "react";
import DefaultDatafeed from "./DefaultDatafeed";
import { periods } from "./constant";
import { Log } from "../../services/trader";
import { ActionType } from "../../constant/enum";
import Tooltip, { ITooltip } from "./Tooltip";

const Chart: React.FC<{ code: string; actions: Log[] }> = ({
  code,
  actions,
}) => {
  const ref = React.useRef<KLineChartPro>();
  const overlayRef = React.useRef<string[]>([]);
  const [tooltip, setTooltip] = React.useState<ITooltip | undefined>();

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
      styles: {},
    });
    ref.current.getChartApi()?.setPriceVolumePrecision(3, 3);

    ref.current
      .getChartApi()
      ?.subscribeAction("onCrosshairChange" as any, (data: any) => {
        console.log(11111);
        if (!ref.current) {
          return;
        }

        const chartApi = ref.current.getChartApi();

        const { from, to } = chartApi.getVisibleRange()!;
        const { dataIndex, kLineData } = data;
        const center = (to - from) / 2 + from;
        if (dataIndex > center) {
          setTooltip({ direction: "left", klineData: kLineData });
        } else {
          setTooltip({ direction: "right", klineData: kLineData });
        }
      });
  }, [code, id]);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const chartApi = ref.current.getChartApi();

    if (overlayRef.current) {
      overlayRef.current.forEach((id) => {
        chartApi.removeOverlay(id);
      });
    }

    overlayRef.current = [];

    actions.forEach((action) => {
      if (action.type === ActionType.Buy) {
        const overlayId = chartApi.createOverlay({
          name: "simpleAnnotation",
          extendData: "买",
          points: [
            {
              timestamp: action.timestamp,
              value: action.high,
            },
          ],
        }) as string;
        overlayRef.current.push(overlayId);
      } else if (action.type === ActionType.Sell) {
        const overlayId = chartApi.createOverlay({
          name: "simpleAnnotation",
          extendData: "卖",
          points: [
            {
              timestamp: action.timestamp,
              value: action.high,
            },
          ],
          styles: {
            polygon: {
              color: "red",
            },
            text: {
              color: "white",
              backgroundColor: "red",
            },
          },
        }) as string;
        overlayRef.current.push(overlayId);
      }
    });
  }, [actions]);
  return (
    <div className="relative">
      <Tooltip tooltip={tooltip} />
      <div id={id}></div>
    </div>
  );
};

export default Chart;
