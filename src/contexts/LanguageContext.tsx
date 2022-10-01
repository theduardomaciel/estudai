import { createContext, useContext, useEffect, useState } from "react";

import updateVisual from "../utils/updateVisual";

type ContextTypes = {
    changeLanguage: () => void;
    language: string;
}

type ContextProviderProps = {
    children: React.ReactNode;
}

const Context = createContext({} as ContextTypes);

export function LanguageProvider({ children }: ContextProviderProps) {
    const [language, setLanguage] = useState('pt')

    function changeLanguage() {
        const newLanguage = language === "pt" ? "en" : "pt"
        window.localStorage.setItem('language', newLanguage)
        setLanguage(newLanguage)
        console.log("Linguagem alterada para: ", newLanguage)
    }

    const sharedState = {
        language,
        changeLanguage,
    };

    return (
        <Context.Provider value={sharedState}>
            {children}
        </Context.Provider>
    );
}

export function useLanguageContext() {
    return useContext(Context);
}