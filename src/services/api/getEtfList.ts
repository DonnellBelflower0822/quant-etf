import { commonFetch } from "../../utils/fetch";

interface Diff {
  f12: string;
  f14: string;

  f17: number;
  f15: number;
  f16: number;
}

const fieldMap = {
  f12: "code",
  f14: "name",
  // "f2": "最新价",
  // "f4": "涨跌额",
  // "f3": "涨跌幅",
  // "f5": "成交量",
  // "f6": "成交额",
  f17: "open",
  f15: "high",
  f16: "low",
  // "f18": "昨收",
  // "f8": "换手率",
  // "f21": "流通市值",
  // "f20": "总市值",
};

interface OriginData {
  data: {
    diff: Diff[];
  };
}

export interface ReturnType {
  code: string;
  name: string;

  open: number;
  high: number;
  low: number;
}

export const getEtfList = async (): Promise<ReturnType[]> => {
  const url = "https://88.push2.eastmoney.com/api/qt/clist/get";
  const params = {
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
    fields:
      "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152",
    _: "1672806290972",
  };

  const data = await commonFetch<OriginData>(url, params);

  return data.data.diff.map((item) => {
    return Object.entries(fieldMap).reduce((prev, [key, value]) => {
      return {
        ...prev,
        [value]: item[key as keyof Diff],
      };
    }, {} as ReturnType);
  });
};
