import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>("light");

    useEffect(() => {
        const storedTheme = (localStorage.getItem("theme") as Theme) || "light";
        applyTheme(storedTheme);
    }, []);

    const applyTheme = (t: Theme) => {
        document.body.classList.remove("light-theme", "dark-theme");
        document.body.classList.add(`${t}-theme`);
        setThemeState(t);
        localStorage.setItem("theme", t);
    };

    const setTheme = (t: Theme) => applyTheme(t);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
