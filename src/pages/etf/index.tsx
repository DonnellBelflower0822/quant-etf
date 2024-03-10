import { Select } from "antd";
import { useParams } from "react-router-dom";
import Chart from "../../components/stock-chart";
import StatisticChart from "../../components/statistic-chart";
import React from "react";
import task from "../../services/strategy";
import dayjs from "dayjs";
import Trader from "../../services/trader";
import { ActionType } from "../../constant/enum";

const { Option } = Select;

const useTrader = () => {
  const { code } = useParams() as { code: string };

  const [trader, setTrader] = React.useState<Trader>();

  React.useEffect(() => {
    task(code).then((res) => {
      return setTrader(res);
    });
  }, [code]);

  const statistic = React.useMemo(() => {
    if (!trader?.log) {
      return [];
    }

    return trader.log.map((item) => ({
      timestamp: dayjs(item.timestamp).format("YYYY-MM-DD"),
      收益: item.profit_and_loss,
      投入: item.input,
    }));
  }, [trader?.log]);

  const actions = React.useMemo(() => {
    if (!trader?.log) {
      return [];
    }

    return trader.log.filter((log) =>
      [ActionType.Buy, ActionType.Sell].includes(log.type)
    );
  }, [trader?.log]);

  return { statistic, actions };
};

const Etf = () => {
  const { code } = useParams() as { code: string };
  const { statistic, actions } = useTrader();

  return (
    <div>
      <div>
        <Chart code={code} actions={actions} />
      </div>
      <div>
        <h2>
          交易汇总
          <Select placeholder="交易策略">
            <Option value="boll">Boll</Option>
          </Select>
        </h2>
        <StatisticChart data={statistic} />
      </div>
      <div>详细交易记录</div>
    </div>
  );
};

export default Etf;
