import { createContext, useState, useEffect, useCallback } from "react";
export const ThemeContext = createContext();

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
