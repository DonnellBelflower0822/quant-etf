import { Select } from "antd";
import { useParams } from "react-router-dom";
import Chart from "../../components/stock-chart";
import StatisticChart from "../../components/statistic-chart";
import React from "react";
import task from "../../services/strategy";
import Rich from "../../services/core/Rich";

const { Option } = Select;

const Etf = () => {
  const { code } = useParams() as { code: string };

  const [rich, setRich] = React.useState<Rich>();

  React.useEffect(() => {
    task(code).then((res) => {
      return setRich(res);
    });
  }, [code]);

  return (
    <div>
      <div>
        <Chart code={code} actions={[]} />
      </div>
      <div>
        <h2>
          交易汇总
          <Select placeholder="交易策略">
            <Option value="boll">Boll</Option>
          </Select>
        </h2>
        <StatisticChart data={rich?.trader?.trader_record ?? []} />
      </div>
      <div>详细交易记录</div>
    </div>
  );
};

export default Etf;
