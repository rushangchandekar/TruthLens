import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Language = "english" | "spanish" | "french" | "german";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "dark";
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "english";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
