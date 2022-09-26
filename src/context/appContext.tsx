import React, { createContext, useContext, useEffect, useState } from 'react';

import updateVisual from '../utils/updateVisual';

type ContextTypes = {
    switchTheme: () => void;
    theme: string;
    changeLanguage: () => void /* (language: string) => void */;
    language: string;
    viewMode: string;
    changeViewMode: (newViewMode: "card" | "list") => void;
}

type ContextProviderProps = {
    children: React.ReactNode;
}

const Context = createContext({} as ContextTypes);

export function ContextProvider({ children }: ContextProviderProps) {
    const [theme, setTheme] = useState('light');

    function switchTheme() {
        const newTheme = theme === "dark" ? "light" : "dark"

        window.localStorage.setItem('currentTheme', newTheme)
        setTheme(newTheme)
    }

    useEffect(() => {
        updateVisual(theme)
    }, [theme])

    const [language, setLanguage] = useState('pt')

    function changeLanguage() {
        const newLanguage = language === "pt" ? "en" : "pt"
        window.localStorage.setItem('language', newLanguage)
        setLanguage(newLanguage)
        console.log("Linguagem alterada para: ", newLanguage)
    }

    const [viewMode, setViewMode] = useState('list')

    function changeViewMode(newViewMode: "card" | "list") {
        /* const newViewMode = viewMode === "list" ? "card" : "list" */
        window.localStorage.setItem('viewMode', newViewMode)
        setViewMode(newViewMode)
        console.log("Modo de exibição alterado para: ", newViewMode)
    }

    useEffect(() => {
        const localStorageTheme = window.localStorage.getItem('currentTheme') as string;
        localStorageTheme && setTheme(localStorageTheme)

        const localStorageLanguage = window.localStorage.getItem('language') as string;
        localStorageLanguage && setLanguage(localStorageLanguage)

        const localStorageViewMode = window.localStorage.getItem('viewMode') as string;
        localStorageViewMode && setViewMode(localStorageViewMode)
    }, [])

    const sharedState = {
        switchTheme,
        theme,
        changeLanguage,
        language,
        changeViewMode,
        viewMode
    };

    return (
        <Context.Provider value={sharedState}>
            {children}
        </Context.Provider>
    );
}

export function useAppContext() {
    return useContext(Context);
}