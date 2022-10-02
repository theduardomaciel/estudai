import axios from 'axios';
import { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { googleApi } from '../lib/googleApi';

import { User } from "../types/User";
import { api } from '../lib/api';
import { useRouter } from 'next/router';

type AuthContextType = {
    user: User | null;
    token: string | null;
    signIn: (code: string, registerData?: {}) => Promise<void | boolean>;
    signOut: () => void;
}

type ContextProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: ContextProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const { 'nextauth.user': outdatedUserString } = parseCookies()

        async function getUser() {
            if (outdatedUserString === "null" || outdatedUserString === "undefined" || !outdatedUserString) return;
            console.log(outdatedUserString)
            const outdatedUser = JSON.parse(outdatedUserString)
            setUser(outdatedUser) // enquanto os novos dados carregam, exibimos os antigos

            const response = await api.get(`/users/${outdatedUser.id}`)
            setUser(response.data)

            setCookie(undefined, 'nextauth.user', JSON.stringify(response.data), {
                maxAge: 60 * 60 * 24 * 30, // 1 month (60 seconds * 60 minutes * 24 hours * 30 days)
            })
            console.log(user)
        }
        getUser()
    }, [])

    async function signIn(code: string, registerData: any) {
        const isRegisterProcess = !!registerData;

        const response = await api.post('/auth/google', { code, isRegisterProcess });
        console.log(response)

        if (response.status === 200) {
            const authenticationType = response.data.authenticationType;
            const responseUser = response.data.user;
            const responseToken = response.data.token;
            const googleAccessToken = response.data.accessToken;
            const googleRefreshToken = response.data.refreshToken;

            setCookie(undefined, 'nextauth.googleAccessToken', googleAccessToken, {
                maxAge: 60 * 60 * 24 // 1 day (60 seconds * 60 minutes * 24 hours)
            })

            setCookie(undefined, 'nextauth.googleRefreshToken', googleRefreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 1 month (60 seconds * 60 minutes * 24 hours * 30 days)
            })

            setCookie(undefined, 'nextauth.token', responseToken, {
                maxAge: 60 * 60 * 24 // 1 day (60 seconds * 60 minutes * 24 hours)
            })

            setCookie(undefined, 'nextauth.user', JSON.stringify(responseUser), {
                maxAge: 60 * 60 * 24 * 30, // 1 month (60 seconds * 60 minutes * 24 hours * 30 days)
            })

            setUser(responseUser)
            setToken(responseToken)

            googleApi.defaults.headers.common['Authorization'] = `Bearer ${googleAccessToken}`;

            if (authenticationType === "login") {
                router.push("/home")
            } else {
                return true;
            }
        } else if (response.status === 201) {
            console.log("O usuário tentou logar mas não possui conta.")
            router.push("/auth/register")
        } else {
            return false
        }
    }

    async function signOut() {
        destroyCookie(undefined, 'nextauth.googleAccessToken')
        destroyCookie(undefined, 'nextauth.googleRefreshToken')
        destroyCookie(undefined, 'nextauth.token')
        destroyCookie(undefined, 'nextauth.user')

        setUser(null)
        setToken(null)

        console.log("Retornando usuário para a tela inicial após des-logar.")
        router.push(`/`)
    }

    return (
        <AuthContext.Provider value={{ user, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}