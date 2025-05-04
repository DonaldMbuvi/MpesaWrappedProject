import { createContext, useState, useEffect, useCallback } from "react";
export const ThemeContext = createContext();

const themes = {
    light: {
      background: "rgba(255, 255, 255, 0.6)",
      text: "#1F2937",
      border: "1px solid #E5E7EB",
      cardBg: "rgba(255, 255, 255, 0.8)",
    },
    dark: {
      background: "rgba(10, 15, 31, 0.9)",  // Deep Navy
      text: "#E4E4E7",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      cardBg: "rgba(20, 25, 40, 0.7)", 
      glow: "#00eaff", // Neon Cyan
    },
  };
  


export const ThemeProvider = ({ children }) => {
    const storedTheme = localStorage.getItem("theme") || "light";
    const [theme, setTheme] = useState(storedTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark-mode", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        console.log("loading theme");
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
