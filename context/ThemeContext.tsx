import Storage from '@/hooks/Storage';
import { Theme, ThemeContextType } from '@/interface/type';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { colors } from '../constants/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [currentColors, setCurrentColors] = useState(colors.light);

  useEffect(() => {
    let theme = Storage.getItem('theme');

    if(theme && theme === 'dark') {
      setTheme(theme);
      setCurrentColors(colors.dark);
    } else {
      Storage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 