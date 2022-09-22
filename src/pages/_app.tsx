import type { AppProps } from 'next/app'
import React from 'react'

// Stylesheets
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <Component {...pageProps} />
    </React.Fragment>
}

export default MyApp
