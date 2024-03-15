import { getKlineData } from "../api/getKlineData";
import Big from "./big";
import { runTask } from "./common";

const task = async (code: string) => {
  const klineInstance = await getKlineData(code);
  return runTask(Big, klineInstance!);
};

export default task;
