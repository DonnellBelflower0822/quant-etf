import { KLineData } from "klinecharts";
import { ActionType } from "../../constant/enum";
import { formatNumber } from "../../utils/format";
import dayjs from "dayjs";

export interface Log extends KLineData {
  input: number;
  cost_price: number;
  number_of_shares: number;
  profit_and_loss: number;
  profit_and_loss_ratio: number;
  type: ActionType;
  reason?: string;
}

let _profit_and_loss = 0;

const formatInput = (x: number) => (x < 0 ? 0 : x);

class Trader {
  log: Log[] = [];

  // 投入
  input = 0;

  // 成本价
  cost_price = 0;

  // 持股数
  number_of_shares = 0;

  // 盈亏
  get profit_and_loss() {
    return _profit_and_loss;
  }

  set profit_and_loss(value: number) {
    _profit_and_loss = formatNumber(value, 2);
  }

  get trader_record() {
    return this.log.map((item) => ({
      timestamp: dayjs(item.timestamp).format("YYYY-MM-DD"),
      收益: item.profit_and_loss,
      投入: item.input,
    }));
  }

  get trader_logs() {
    return this.log.filter((log) =>
      [ActionType.Buy, ActionType.Sell].includes(log.type)
    );
  }

  // 盈亏率
  profit_and_loss_ratio = 0;

  /**
   *
   * @param price 购买价格
   * @param count 购买数量
   * @param free 手续费
   * @param close 收盘价
   */
  buy(price: number, count: number, free: number, kline: KLineData) {
    // 投入
    this.input = formatNumber(this.input + price * count + free, 2);

    // 持股数
    this.number_of_shares += count;

    // 成本价
    this.cost_price = this.input / this.number_of_shares;

    // 盈亏
    this.profit_and_loss =
      (kline.close - this.cost_price) * this.number_of_shares;

    // 盈亏率
    this.profit_and_loss_ratio = this.profit_and_loss / this.cost_price;

    this.log.push({
      ...kline,
      input: formatInput(this.input),
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.profit_and_loss,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: ActionType.Buy,
    });
  }

  empty(kline: KLineData) {
    this.number_of_shares = 0;
    this.cost_price = 0;
    this.profit_and_loss = 0;
    this.profit_and_loss_ratio = 0;
    this.log.push({
      ...kline,
      input: 0,
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: -this.input,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: ActionType.Empty,
    });
  }

  hold(kline: KLineData, reason?: string) {
    // 空仓
    if (this.number_of_shares === 0) {
      this.empty(kline);
      return;
    }

    const { close } = kline;
    this.profit_and_loss = (close - this.cost_price) * this.number_of_shares;
    this.profit_and_loss_ratio = this.profit_and_loss / this.cost_price;
    this.log.push({
      ...kline,
      input: formatInput(this.input),
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.profit_and_loss,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: ActionType.Hold,
      reason,
    });
  }

  sell(price: number, count: number, free: number, kline: KLineData) {
    if (count > this.number_of_shares) {
      // 超出持仓
      this.hold(kline, "超出持仓数量");
      return;
    }

    // 投入
    this.input = formatNumber(this.input - count * price, 2);
    // 数量
    this.number_of_shares -= count;

    if (this.number_of_shares === 0) {
      this.empty(kline);
      return;
    }

    // 成本
    this.cost_price =
      this.number_of_shares === 0 ? 0 : this.input / this.number_of_shares;

    // 盈亏
    this.profit_and_loss = (price - this.cost_price) * this.number_of_shares;

    // 盈亏率
    this.profit_and_loss_ratio =
      this.number_of_shares === 0 ? 0 : this.profit_and_loss / this.cost_price;

    this.log.push({
      ...kline,
      input: formatInput(this.input),
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.profit_and_loss,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: ActionType.Sell,
    });
  }
}

export default Trader;
