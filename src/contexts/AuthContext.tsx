import React, { createContext, useContext, useState } from "react";
import { hasGrantedAllScopesGoogle } from '@react-oauth/google';

import { setCookie } from 'nookies';

import { api } from '../lib/api';
import { useRouter } from 'next/router';
import removeCookies from '../services/removeCookies';

type AuthContextType = {
    token: string | null;
    signIn: (code: string, registerData?: RegisterProps | undefined) => Promise<string>;
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
            console.log(registerData)
            const response = await api.post('/auth/google', { registerData, code });

            if (response.status === 200) {
                const { userId, appToken, tokens } = response.data;
                const { access_token: google_access_token, refresh_token: google_refresh_token } = tokens;

                const hasAccess = hasGrantedAllScopesGoogle(
                    tokens,
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/drive.appdata'
                );
                console.log("Garantiu todo os escopos? ", hasAccess)

                if (hasAccess) {
                    console.log('Atualizando cookies com os tokens de autenticação.', appToken)

                    setCookie(undefined, 'auth.token', appToken as string, {
                        maxAge: 60 * 60 * 24 * 30 * 12, // 1 year (60 seconds * 60 minutes * 24 hours * 30 days * 12 months)/
                        path: "/"
                    })

                    setCookie(undefined, 'app.userId', userId, {
                        path: "/"
                    })

                    setCookie(undefined, 'auth.googleAccessToken', google_access_token, {
                        maxAge: 60 * 60 * 24 * 30,  // 30 days (60 seconds * 60 minutes * 24 hours * 30 days)
                        path: "/"
                    })

                    setCookie(undefined, 'auth.googleRefreshToken', google_refresh_token, {
                        path: "/"
                    })

                    //googleApi.defaults.headers.common['Authorization'] = `Bearer ${google_access_token}`;
                    api.defaults.headers.common['Authorization'] = `Bearer ${appToken}`;

                    setToken(appToken)

                    return 'success';
                } else {
                    return 'scopeMissing'
                }
            } else if (response.status === 201) {
                console.log("O usuário tentou logar, mas não possui conta.")
                return 'noAccount'
            } else {
                return 'serverError'
            }
        } catch (error) {
            console.log(error)
            return 'serverError'
        }
    }

    async function signOut() {
        console.log("Retornando usuário para a tela inicial após des-logar.")
        await removeCookies();
        setToken(null)
        router.push("/")
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