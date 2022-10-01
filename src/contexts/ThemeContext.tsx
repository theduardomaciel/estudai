import { createContext, useContext, useEffect, useState } from "react";

import updateVisual from "../utils/updateVisual";

type ContextTypes = {
    switchTheme: () => void;
    theme: string;
}

type ContextProviderProps = {
    children: React.ReactNode;
}

const Context = createContext({} as ContextTypes);

export function ThemeProvider({ children }: ContextProviderProps) {
    const [theme, setTheme] = useState('light');

    function switchTheme() {
        const newTheme = theme === "dark" ? "light" : "dark"

        window.localStorage.setItem('currentTheme', newTheme)
        setTheme(newTheme)
    }

    useEffect(() => {
        updateVisual(theme)
    }, [theme])

    const sharedState = {
        switchTheme,
        theme,
    };

    return (
        <Context.Provider value={sharedState}>
            {children}
        </Context.Provider>
    );
}

export function useThemeContext() {
    return useContext(Context);
}