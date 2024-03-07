"use client";

import React from "react";
import DefaultDatafeed from "./DefaultDatafeed";

import "@/lib/klinecharts-pro/klinecharts-pro.css";
import { Etf } from "@prisma/client";
import {
  ActionType,
  KLineChartPro,
  SymbolInfo,
  TooltipShowRule,
} from "@/lib/klinecharts-pro";
import Tooltip, { ITooltip } from "./Tooltip";
import { periods } from "./constant";

const KLine: React.FC<{ etf: Omit<Etf, "id"> }> = ({ etf }) => {
  const id = React.useMemo(() => `id_${Math.random()}`, []);
  const chartRef = React.useRef<KLineChartPro>();
  const [tooltip, setTooltip] = React.useState<ITooltip | undefined>();

  React.useEffect(() => {
    if (chartRef.current || !etf) {
      return;
    }

    // 创建实例
    chartRef.current = new KLineChartPro({
      styles: {
        overlay: {
          point: {
            color: "#1677FF",
            borderColor: "rgba(22, 119, 255, 0.35)",
            borderSize: 1,
            radius: 5,
            activeColor: "#1677FF",
            activeBorderColor: "rgba(22, 119, 255, 0.35)",
            activeBorderSize: 3,
            activeRadius: 5,
          },
        },
        candle: {
          tooltip: {
            showRule: TooltipShowRule.None,
          },
          bar: {
            upColor: "#F92855",
            upBorderColor: "#F92855",
            upWickColor: "#F92855",
            downColor: "#2DC08E",
            downBorderColor: "#2DC08E",
            downWickColor: "#2DC08E",
          },
        },
        indicator: {
          tooltip: {
            showRule: TooltipShowRule.None,
          },
        },
      },
      container: document.getElementById(id) ?? id,
      // 初始化标的信息
      symbol: {
        exchange: "XNYS",
        market: "stocks",
        code: etf.code,
        name: etf.name,
        shortName: etf.name,
        ticker: etf.name,
        priceCurrency: "usd",
        type: "ADRC",
      } as SymbolInfo,
      // 初始化周期
      periods,
      period: periods[0],
      datafeed: new DefaultDatafeed(),
      drawingBarVisible: false,
      watermark: "",
      mainIndicators: ["BOLL"],
    });
    // chartRef.current?.setPeriod()

    chartRef.current?.subscribeAction(
      "onCrosshairChange" as ActionType,
      (data: any) => {
        if (!chartRef.current) {
          return;
        }

        const { from, to } = chartRef.current.getVisibleRange()!;
        const { dataIndex, kLineData } = data;
        const center = (to - from) / 2 + from;
        if (dataIndex > center) {
          setTooltip({ direction: "left", klineData: kLineData });
        } else {
          setTooltip({ direction: "right", klineData: kLineData });
        }
      }
    );
  }, [id, etf]);

  React.useEffect(() => {}, []);

  return (
    <div className="relative">
      <Tooltip tooltip={tooltip} />
      <div
        id={id}
        className="kline-chart relative w-full !h-[80vh]"
        onMouseLeave={() => {
          setTooltip(undefined);
        }}
        // onClick={() => {
        //   const dataList = chartRef.current?.getDataList() ?? [];
        //   const data = dataList[dataList.length - 2] as KLineData;
        //   chartRef.current?.createOverlay({
        //     name: "simpleAnnotation",
        //     extendData: "买",
        //     points: [
        //       {
        //         timestamp: data.timestamp,
        //         value: data.high,
        //         dataIndex: dataList.length - 2,
        //       },
        //     ],
        //   });
        // }}
      />
    </div>
  );
};

export default KLine;
