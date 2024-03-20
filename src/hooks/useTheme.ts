import React from "react";

export enum Theme {
  dark = "dark",
  light = "light",
}

const getTheme = () => {
  if (window.matchMedia) {
    // 监听操作系统的主题模式变化
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 初始化时获取当前主题
    return darkModeQuery.matches ? Theme.dark : Theme.light;
  }
  return Theme.light;
};

export const useTheme = () => {
  const [theme, setTheme] = React.useState<Theme>(getTheme());

  React.useEffect(() => {
    if (window.matchMedia) {
      // 监听操作系统的主题模式变化
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // 监听主题模式变化
      darkModeQuery.addListener((e) => {
        const newTheme = e.matches ? Theme.dark : Theme.light;
        setTheme(newTheme);
      });
    }
    setTheme(getTheme());
  }, []);

  return theme;
};
