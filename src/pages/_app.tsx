import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'

import type { AppProps } from 'next/app'

// Contexts
import { AppContextProvider } from '../contexts/AppContext'

import { AuthProvider } from '../contexts/AuthContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ThemeProvider } from '../contexts/ThemeContext'

// Stylesheets
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
            <AuthProvider>
                <LanguageProvider>
                    <ThemeProvider>
                        <AppContextProvider>
                            <Component {...pageProps} />
                        </AppContextProvider>
                    </ThemeProvider>
                </LanguageProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.Fragment >
}

export default MyApp
