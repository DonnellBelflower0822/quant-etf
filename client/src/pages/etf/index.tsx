import { Select } from "antd";
import { useParams } from "react-router-dom";
import Chart from "../../components/stock-chart";
import StatisticChart from "../../components/statistic-chart";
import React from "react";
import task from "../../services/strategy";
import Trader from "../../services/trader";

const { Option } = Select;

const useTrader = () => {
  const { code } = useParams() as { code: string };

  const [trader, setTrader] = React.useState<Trader>();

  React.useEffect(() => {
    task(code).then((res) => {
      return setTrader(res);
    });
  }, [code]);

  return trader;
};

const Etf = () => {
  const { code } = useParams() as { code: string };
  const trader = useTrader();

  return (
    <div>
      <div>
        <Chart code={code} actions={trader?.trader_logs ?? []} />
      </div>
      <div>
        <h2>
          交易汇总
          <Select placeholder="交易策略">
            <Option value="boll">Boll</Option>
          </Select>
        </h2>
        <StatisticChart data={trader?.trader_record ?? []} />
      </div>
      <div>详细交易记录</div>
    </div>
  );
};

export default Etf;
