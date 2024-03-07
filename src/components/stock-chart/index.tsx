"use client";

import { Etf } from "@prisma/client";
import KLine from "./Kline";
import { Period, periods } from "./constant";
import React from "react";

const StockChart: React.FC<{ etf: Omit<Etf, "id"> }> = ({ etf }) => {
  const [period, setPeriod] = React.useState(Period.day);

  return (
    <div>
      <div className="flex gap-x-2 border border-slate-200 text-slate-600 p-1 box-border text-base">
        {periods.map((option) => (
          <span key={option.timespan}>{option.text}</span>
        ))}
      </div>
      <KLine etf={etf} />
    </div>
  );
};

export default StockChart;
