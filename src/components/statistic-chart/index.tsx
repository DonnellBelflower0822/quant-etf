/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DualAxes } from "@ant-design/charts";

export interface Data {
  timestamp: string;
  // 盈亏
  收益: number;
  投入: number;
}

const StatisticChart: React.FC<{ data: Data[] }> = ({ data }) => {
  const config = {
    data,
    xField: "timestamp",
    padding: 70,
    legend: true,
    slider: { x: true },
    scale: { y: { nice: false } },
    children: [
      {
        type: "interval",
        yField: "投入",
        style: { stroke: "#5B8FF9" },
      },
      {
        type: "line",
        yField: "收益",
        style: { stroke: "#5AD8A6", lineWidth: 2 },
        axis: { y: { position: "right" } },
      },
    ],
  };
  return <DualAxes {...(config as any)} />;
};

export default StatisticChart;
