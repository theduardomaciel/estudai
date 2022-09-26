import type { AppProps } from 'next/app'
import React from 'react'
import { ContextProvider } from '../context/appContext'

// Stylesheets
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <ContextProvider>
            <Component {...pageProps} />
        </ContextProvider>
    </React.Fragment>
}

export default MyApp
