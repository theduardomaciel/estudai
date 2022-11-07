import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { CSSProperties } from 'react'

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
/* import localFont from '@next/font/local' */
import { Inter, Karla, Raleway, Trirong } from '@next/font/google';

const inter = Inter({ variable: '--inter-font', subsets: ['latin'] });
const karla = Karla({ variable: '--karla-font', subsets: ['latin'] });
const raleway = Raleway({ variable: '--raleway-font', subsets: ['latin'] });
const trirong700 = Trirong({ weight: "700", variable: '--trirong-700-font', subsets: ['latin'] });
const trirong900 = Trirong({ weight: '900', variable: '--trirong-900-font', subsets: ['latin'] })

/* const materialSymbols = localFont({ src: "../styles/fonts/material-symbols.ttf", display: "block" }) */

// , ${materialSymbols.style.fontFamily}

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
            <AuthProvider>
                <AppContextProvider>
                    <DndProvider options={HTML5toTouch}>
                        <Progressbar />
                        <style jsx global>{`
                            html {
                                font-family: ${inter.style.fontFamily}, ${karla.style.fontFamily}, ${raleway.style.fontFamily}, ${trirong700.style.fontFamily}, ${trirong900.style.fontFamily}, ${inter.style.fontFamily};
                            }
                        `}</style>
                        <Component {...pageProps} />
                        <ComponentPreview />
                    </DndProvider>
                </AppContextProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.Fragment >
}

export default MyApp
