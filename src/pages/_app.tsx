import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { CSSProperties, useEffect } from 'react'

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

import Progressbar from '../components/Progressbar';

// Props
import { Tag, TagProps } from '../components/AttachmentLoader/Tag';
import { AppProps } from 'next/dist/shared/lib/router/router';

// Fonts
import localFont from '@next/font/local'
import { Inter, Karla, Raleway, Trirong } from '@next/font/google';

/* const inter = Inter({ subsets: ['latin'] });
const karla = Karla({ subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });
const trirong = Trirong({ weight: '900', subsets: ['latin'] })

const materialSymbols = localFont({ src: "../styles/fonts/material-symbols.ttf", display: "block" }) */

import '@material-design-icons/font/round.css';

function MyApp({ Component, pageProps }: AppProps) {

    useEffect(() => {
        document.fonts.ready.then(function () {
            document.body.classList.add('loaded')
        });
    }, [])

    return <React.Fragment>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
            <AuthProvider>
                <AppContextProvider>
                    <DndProvider options={HTML5toTouch}>
                        <Progressbar />
                        {/* <main className={`${inter.className} ${karla.className} ${raleway.className} ${trirong.className} ${materialSymbols.className}`}> */}
                        <Component {...pageProps} />
                        {/* </main> */}
                        <ComponentPreview />
                    </DndProvider>
                </AppContextProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.Fragment >
}

export default MyApp
