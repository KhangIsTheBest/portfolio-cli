'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'cosmic' | 'matrix' | 'dracula' | 'cyberpunk' | 'amber' | 'snow';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('cosmic');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  // Update body class when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.body;
      
      // Remove all theme classes
      const themeClasses = ['theme-matrix', 'theme-dracula', 'theme-cyberpunk', 'theme-amber', 'theme-snow'];
      themeClasses.forEach(cls => body.classList.remove(cls));
      
      // Add new theme class if it's not the default cosmic
      if (theme !== 'cosmic') {
        body.classList.add(`theme-${theme}`);
      }
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
