import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isAccessible: boolean;
  toggleAccessibility: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccessible, setIsAccessible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("civiceye_is_accessible");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleAccessibility = () => {
    setIsAccessible((prev) => {
      const newVal = !prev;
      try {
        localStorage.setItem("civiceye_is_accessible", JSON.stringify(newVal));
      } catch (e) {
        console.error("Failed to save accessibility state to localStorage", e);
      }
      return newVal;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isAccessible) {
      root.classList.add("is-accessible");
      // Read out announcement for accessibility screen readers
      const utterance = new SpeechSynthesisUtterance("Accessibility mode activated. Uniform high contrast theme loaded.");
      utterance.lang = "en-US";
      window.speechSynthesis?.speak(utterance);
    } else {
      root.classList.remove("is-accessible");
      const utterance = new SpeechSynthesisUtterance("Accessibility mode deactivated.");
      utterance.lang = "en-US";
      window.speechSynthesis?.speak(utterance);
    }
  }, [isAccessible]);

  return (
    <ThemeContext.Provider value={{ isAccessible, toggleAccessibility }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
