import Storage from "@/hooks/Storage";
import { Theme, ThemeContextType } from "@/interface/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import { colors } from "../constants/theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = Storage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []); // Run only once on mount

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      Storage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  const currentColors = theme === "light" ? colors.light : colors.dark;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
