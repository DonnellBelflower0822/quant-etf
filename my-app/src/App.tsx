import React from "react";
import { getKlineData } from "./services/kline";

function App() {
  React.useEffect(() => {
    getKlineData("515790");
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
