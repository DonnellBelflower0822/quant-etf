import { FetchKLineResult } from "../../type";
import { commonFetch } from "../../utils/fetch";

interface Clist {
  data: {
    diff: Array<{ f12: string; f13: number }>;
  };
}

const _fund_etf_code_id_map_em = async () => {
  const result = await commonFetch<Clist>(
    "https://88.push2.eastmoney.com/api/qt/clist/get",
    {
      pn: "1",
      pz: "5000",
      po: "1",
      np: "1",
      ut: "bd1d9ddb04089700cf9c27f6f7426281",
      fltt: "2",
      invt: "2",
      wbp2u: "|0|0|0|web",
      fid: "f3",
      fs: "b:MK0021,b:MK0022,b:MK0023,b:MK0024",
      fields: "f12,f13",
      _: "1672806290972",
    }
  );
  return result.data.diff.reduce(
    (obj, item) => ({ ...obj, [item.f12]: item.f13 }),
    {} as Record<string, number>
  );
};

interface OriginKlineData {
  data: {
    klines: string[];
  };
}

const periodDict = { daily: "101", weekly: "102", monthly: "103" };
const adjustDict = { qfq: "1", hfq: "2", "": "0" };

export const getKlineData = async (
  symbol: string,
  start_date: string = "",
  end_date: string = "20500000",
  period: "daily" | "weekly" | "monthly" = "daily",
  adjust: "qfq" | "hfq" | "" = ""
): Promise<FetchKLineResult> => {
  const code_id_dict = await _fund_etf_code_id_map_em();
  const result = await commonFetch<OriginKlineData>(
    "https://push2his.eastmoney.com/api/qt/stock/kline/get",
    {
      fields1: "f1,f2,f3,f4,f5,f6",
      fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f116",
      ut: "f057cbcbce2a86e2866ab8877db1d059",
      klt: periodDict[period],
      fqt: adjustDict[adjust],
      _: "1623766962675",
      secid: `${code_id_dict[symbol]}.${symbol}`,
      beg: start_date,
      end: end_date,

      ...(start_date === ""
        ? {
            lmt: 1000000,
            forcect: 1,
            iscca: 1,
          }
        : {}),
    }
  );
  const columns = [
    "timestamp",
    "open",
    "close",
    "high",
    "low",
    "volume",
    "amount",
    "zf",
    "turnover",
    "chg",
  ];
  if (!result.data) {
    console.log("result", result);
    return { klines: [], columns: [] };
  }
  const klines = result.data.klines.map((item) =>
    item
      .split(",")
      .map((item, index) => (index === 0 ? item : parseFloat(item)))
  ) as Array<string | number>[];
  return {
    klines,
    columns,
  };
};
