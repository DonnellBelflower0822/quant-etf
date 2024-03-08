import { useParams } from "react-router-dom";
import Chart from "../../components/stock-chart";
import StatisticChart from "../../components/statistic-chart";

const Etf = () => {
  const { code } = useParams() as { code: string };
  return (
    <div>
      <div>
        <Chart code={code} />
      </div>
      <div>
        <h2>交易汇总</h2>
        <StatisticChart />
      </div>
      <div>详细交易记录</div>
    </div>
  );
};

export default Etf;
