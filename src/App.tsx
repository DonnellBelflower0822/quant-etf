import { ConfigProvider, theme as antdTheme } from "antd";
import { Theme, useTheme } from "./hooks/useTheme";
import Router from "./routes";

function App() {
  const theme = useTheme();
  return (
    <div className={theme}>
      <ConfigProvider
        theme={{
          algorithm:
            theme === Theme.light
              ? antdTheme.defaultAlgorithm
              : antdTheme.darkAlgorithm,
        }}
      >
        <Router />
      </ConfigProvider>
    </div>
  );
}

export default App;
