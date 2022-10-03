import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Karla:ital,wght@0,300;0,400;0,700;0,800;1,300;1,400;1,700;1,800&family=Raleway:wght@500;700;800;900&family=Trirong:wght@700;900&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}