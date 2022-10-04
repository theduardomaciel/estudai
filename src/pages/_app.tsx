import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { CSSProperties } from 'react'

import type { AppProps } from 'next/app'

// Contexts
import { AppContextProvider } from '../contexts/AppContext'

import { AuthProvider } from '../contexts/AuthContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ThemeProvider } from '../contexts/ThemeContext'

// Drag 'n Drop
import { DndProvider, Preview, PreviewState } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline

const Block = ({ row, text, item, style }: { row: number, text: string, item: { color: string }, style: CSSProperties }): JSX.Element => {
    return <div style={{
        ...style,
        top: `${row * 60}px`,
        backgroundColor: item.color,
        width: '50px',
        height: '50px',
        whiteSpace: 'nowrap',
    }}>Generated {text}</div>
}

const ComponentPreview = ({ text }: { text: string }): JSX.Element => {
    return (
        <Preview generator={({ item, style }: PreviewState<{ color: string }>): JSX.Element => {
            return <Block row={2} text={`${text} with Component`} item={item} style={style} />
        }} />
    )
}

// Stylesheets
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
            <AuthProvider>
                <LanguageProvider>
                    <ThemeProvider>
                        <AppContextProvider>
                            <DndProvider options={HTML5toTouch}>
                                <Component {...pageProps} />
                                <ComponentPreview text={'teste'} />
                            </DndProvider>
                        </AppContextProvider>
                    </ThemeProvider>
                </LanguageProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.Fragment >
}

export default MyApp
