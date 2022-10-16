import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

type ContextTypes = {
    viewMode: string;
    changeViewMode: (newViewMode: "card" | "list") => void;
    hasGoogleAuthentication: boolean;
    setGoogleAuthentication: Dispatch<SetStateAction<boolean>>;
    isUploading: boolean;
    setUploading: Dispatch<SetStateAction<boolean>>;
}

type ContextProviderProps = {
    children: React.ReactNode;
}

const Context = createContext({} as ContextTypes);

export function AppContextProvider({ children }: ContextProviderProps) {
    const [viewMode, setViewMode] = useState('list')

    function changeViewMode(newViewMode: "card" | "list") {
        /* const newViewMode = viewMode === "list" ? "card" : "list" */
        window.localStorage.setItem('viewMode', newViewMode)
        setViewMode(newViewMode)
        console.log("Modo de exibição alterado para: ", newViewMode)
    }

    useEffect(() => {
        const localStorageViewMode = window.localStorage.getItem('viewMode') as string;
        localStorageViewMode && setViewMode(localStorageViewMode)
    }, [])

    const [hasGoogleAuthentication, setGoogleAuthentication] = useState(true)

    const [isUploading, setUploading] = useState(false)

    const sharedState = {
        changeViewMode,
        viewMode,
        hasGoogleAuthentication,
        setGoogleAuthentication,
        isUploading,
        setUploading
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