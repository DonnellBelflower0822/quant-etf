import { getKlineData } from "../data/getKlineData";
import runTask from "./boll";

const task = async (code: string) => {
  const klineData = await getKlineData(code);
  return runTask(klineData);
};

export default task;
