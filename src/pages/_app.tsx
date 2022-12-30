import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { CSSProperties, useEffect } from 'react'

// Contexts
import { AppContextProvider } from '../contexts/AppContext'
import { ThemeProvider } from 'next-themes'

import { AuthProvider } from '../contexts/AuthContext'

// Drag 'n Drop
import { DndProvider, Preview } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline

const ComponentPreview = (): JSX.Element => {
    return (
        <Preview generator={({ itemType, item, style, ref }: { itemType: any, item: TagProps, style: CSSProperties, ref: any }): JSX.Element => {
            return <Tag tagId={item.tagId} index={item.index} style={style} />
        }} />
    )
}

// Stylesheets
import '../styles/globals.css'

import Progressbar from '../components/Progressbar';

// Props
import { Tag, TagProps } from '../components/AttachmentLoader/Tag';
import { AppProps } from 'next/dist/shared/lib/router/router';

import "@fontsource/material-icons-rounded";
import "@fontsource/material-icons-outlined";

type CustomAppProps = AppProps & { Component: { theme: string; }; pageProps: any; }

function MyApp({ Component, pageProps }: CustomAppProps) {
    useEffect(() => {
        document.fonts.ready.then(function () {
            document.body.classList.add('loaded')
        });
    }, [])

    return <React.Fragment>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
            <AuthProvider>
                <AppContextProvider>
                    <ThemeProvider forcedTheme={Component.theme || undefined} themes={['default', 'red', 'green', 'blue', 'yellow']}>
                        <DndProvider options={HTML5toTouch}>
                            <Progressbar />
                            <Component {...pageProps} />
                            <ComponentPreview />
                        </DndProvider>
                    </ThemeProvider>
                </AppContextProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.Fragment >
}

export default MyApp
