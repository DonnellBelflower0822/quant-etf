import { KLineData } from "@/lib/klinecharts-pro";

const data = [
  {
    date: "11",
    price: 10,
    type: "buy",
    quantity: 100,
    fee: 5,
    clear: false,
  },
  { date: "2024-03-02", price: 11, type: "hold" },
  {
    date: "2024-03-03",
    price: 12,
    type: "sell",
    quantity: 50,
    fee: 5,
    clear: false,
  },
  { date: "2024-03-04", price: 13, type: "hold" },
  {
    date: "2024-03-05",
    price: 15,
    type: "sell",
    quantity: 50,
    fee: 5,
    clear: true,
  },
  {
    date: "2024-03-06",
    price: 16,
    type: "buy",
    quantity: 200,
    fee: 1,
    clear: false,
  },
  { date: "2024-03-07", price: 17, type: "hold" },
  {
    date: "2024-03-08",
    price: 18,
    type: "sell",
    quantity: 150,
    fee: 10,
    clear: false,
  },
  { date: "2024-03-09", price: 20, type: "hold" },
  {
    date: "2024-03-10",
    price: 22,
    type: "sell",
    quantity: 20,
    fee: 2,
    clear: false,
  },
];

enum Type {
  Sell = "卖出",
  Buy = "买入",
  Empty = "空仓",
  Hold = "持仓",
}

interface Log extends KLineData {
  input: number;
  cost_price: number;
  number_of_shares: number;
  profit_and_loss: number;
  profit_and_loss_ratio: number;
  type: Type;
  reason?: string;
}

class Trader {
  log: Log[] = [];

  // 投入
  input = 0;

  // 成本价
  cost_price = 0;

  // 持股数
  number_of_shares = 0;

  // 盈亏
  profit_and_loss = 0;

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
    this.input += price * count + free;

    // 持股数
    this.number_of_shares += count;

    // 成本价
    this.cost_price = this.input / this.number_of_shares;

    // 盈亏
    this.profit_and_loss =
      (kline.price - this.cost_price) * this.number_of_shares;

    // 盈亏率
    this.profit_and_loss_ratio = this.profit_and_loss / this.cost_price;

    this.log.push({
      ...kline,
      input: this.input,
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.profit_and_loss,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: Type.Buy,
    });
  }

  empty(kline: KLineData) {
    this.number_of_shares = 0;
    this.cost_price = 0;
    this.profit_and_loss = 0;
    this.profit_and_loss_ratio = 0;
    this.log.push({
      ...kline,
      input: this.input,
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.input,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: Type.Empty,
    });
  }

  hold(kline: KLineData, reason?: string) {
    // 空仓
    if (this.number_of_shares === 0) {
      this.empty(kline);
      return;
    }

    const { price } = kline;
    this.profit_and_loss = (price - this.cost_price) * this.number_of_shares;
    this.profit_and_loss_ratio = this.profit_and_loss / this.cost_price;
    this.log.push({
      ...kline,
      input: this.input,
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.profit_and_loss,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: Type.Hold,
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
    this.input -= count * price;
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
      input: this.input,
      number_of_shares: this.number_of_shares,
      cost_price: this.cost_price,
      profit_and_loss: this.profit_and_loss,
      profit_and_loss_ratio: this.profit_and_loss_ratio,
      type: Type.Sell,
    });
  }

  run() {
    data.forEach((item) => {
      if (item.type === "sell") {
        this.sell(
          item.price,
          item.quantity!,
          item.fee!,
          item as unknown as KLineData
        );
        return;
      }

      if (item.type === "hold") {
        this.hold(item as unknown as KLineData);
        return;
      }

      if (item.type === "buy") {
        this.buy(
          item.price,
          item.quantity!,
          item.fee!,
          item as unknown as KLineData
        );
      }
    });
  }
}

export default Trader;
