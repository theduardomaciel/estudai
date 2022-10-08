import axios from 'axios';
import { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { api } from '../lib/api';
import { useRouter } from 'next/router';
import removeCookies from '../services/removeCookies';

type AuthContextType = {
    token: string | null;
    signIn: (code: string, registerData?: RegisterProps | undefined) => Promise<boolean>;
    signOut: () => void;
}

type ContextProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export interface RegisterProps {
    course: number;
}

export function AuthProvider({ children }: ContextProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    async function signIn(code: string, registerData?: RegisterProps) {
        try {
            const response = await api.post('/auth/google', { registerData, code });

            if (response.status === 200) {
                const { appToken, google_access_token, google_refresh_token } = response.data;

                setCookie(undefined, 'auth.token', appToken as string, {
                    maxAge: 60 * 60 * 24 // 1 day (60 seconds * 60 minutes * 24 hours)
                })

                setCookie(undefined, 'auth.googleAccessToken', google_access_token, {
                    maxAge: 60 * 60 * 24 // 1 day (60 seconds * 60 minutes * 24 hours)
                })

                setCookie(undefined, 'auth.googleRefreshToken', google_refresh_token, {
                    maxAge: 60 * 60 * 24 * 30, // 1 month (60 seconds * 60 minutes * 24 hours * 30 days)
                })

                //googleApi.defaults.headers.common['Authorization'] = `Bearer ${google_access_token}`;
                api.defaults.headers.common['Authorization'] = `Bearer ${appToken}`;

                setToken(appToken)

                return true;
            } else if (response.status === 201) {
                console.log("O usuário tentou logar, mas não possui conta.")
                return false;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async function signOut() {
        await removeCookies();

        setToken(null)

        console.log("Retornando usuário para a tela inicial após des-logar.")
        router.push(`/`)
    }

    return (
        <AuthContext.Provider value={{ token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}