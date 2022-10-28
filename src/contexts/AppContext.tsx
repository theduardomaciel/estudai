import React, { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Focus } from '../components/Focus';
import useCountdown from '../hooks/useCountdown';

type ContextTypes = {
    viewMode: string;
    changeViewMode: (newViewMode: "card" | "list") => void;

    hasGoogleAuthentication: boolean;
    setGoogleAuthentication: Dispatch<SetStateAction<boolean>>;

    isUploading: boolean;
    setUploading: Dispatch<SetStateAction<boolean>>;

    currentFocus: Focus | null;
    startNewFocus: (name: string, topicId: number, totalTime: number) => void;
    removeFocus: () => void;

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

    const [hasGoogleAuthentication, setGoogleAuthentication] = useState(true)

    const [isUploading, setUploading] = useState(false)

    const [currentFocus, setCurrentFocus] = useState<Focus | null>(null);

    async function startNewFocus(name: string, topicId: number, totalTime: number) {
        const newFocus = {
            name: name,
            topicId: topicId,
            totalTime: totalTime,
        }
        setCurrentFocus(newFocus);
    }

    async function removeFocus() {
        if (currentFocus) {
            setTimeout(() => {
                setCurrentFocus(null)
            }, 500);
        }
    }

    const sharedState = {
        changeViewMode,
        viewMode,
        hasGoogleAuthentication,
        setGoogleAuthentication,
        isUploading,
        setUploading,
        currentFocus,
        startNewFocus,
        removeFocus
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