import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { CSSProperties } from 'react'

import type { AppProps } from 'next/app'

// Contexts
import { AppContextProvider } from '../contexts/AppContext'

import { AuthProvider } from '../contexts/AuthContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ThemeProvider } from '../contexts/ThemeContext'

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
import { Tag, TagProps } from '../components/AttachmentLoader/Tag';
import { getTagInfo } from '../utils/getTagInfo';

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
            <AuthProvider>
                <LanguageProvider>
                    <ThemeProvider>
                        <AppContextProvider>
                            <DndProvider options={HTML5toTouch}>
                                <Component {...pageProps} />
                                <ComponentPreview />
                            </DndProvider>
                        </AppContextProvider>
                    </ThemeProvider>
                </LanguageProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.Fragment >
}

export default MyApp
