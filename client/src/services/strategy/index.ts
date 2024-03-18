import { getKlineData } from "../api/getKlineData";
import Big from "./big";
import { runTask } from "../core/StrategyCtor";

const task = async (code: string) => {
  const richInstance = await getKlineData(code);
  return runTask(Big, richInstance!);
};

export default task;
