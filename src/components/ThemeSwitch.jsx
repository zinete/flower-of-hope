
import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Switch from 'react-switch';
export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === "light"));
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = isChecked => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  // Avoid theme change flicker
  if (status === "loading") {
    return null;
  }

  return (
    <div style={{ position: "fixed", right: 8, top: 8 }}>
      <Switch
        uncheckedIcon={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 20,
              paddingRight: 2,
            }}
          >
            🌞
          </div>
        }
        checkedIcon={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 20,
              paddingRight: 2,
            }}
          >
            🌑
          </div>
        }
        onColor="#4d4d4d"
        onChange={toggleTheme}
        checked={isDarkMode}
      />
    </div>
  );
}
