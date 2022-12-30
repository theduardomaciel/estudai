import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { parseCookies } from 'nookies';

import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Sections
import LandingHeader from '../components/Landing/Header';
import LandingFooter from '../components/Landing/Footer';

// Stylesheets
import styles from '../styles/Landing.module.css'

// Components
import Note from '../components/Landing/Note';
import Button from '../components/Button';
import Device from '../components/Landing/Device';

// Icons
import StarIcon from "/public/landing/star.svg";
import PiIcon from "/public/landing/pi.svg";
import EnergyIcon from "/public/landing/energy.svg";
import PaperPlaneIcon from "/public/landing/paper_plane.svg";
import BaskharaIcon from "/public/landing/baskhara.svg";
import Translate, { TranslateText } from '../components/Translate';

export function LandingNote({ showOnlyInDesktop, showOnlyInMobile }: { showOnlyInDesktop?: boolean, showOnlyInMobile?: boolean }) {
    return (
        <Note
            showOnlyInDesktop={showOnlyInDesktop}
            showOnlyInMobile={showOnlyInMobile}
            tag='ALPHA'
            description={{
                landscape: TranslateText(`${TranslateText("This project is still in progress")}, ${TranslateText("so expect bugs and other issues")}.`),
                portrait: TranslateText(`${TranslateText("This project is still in progress")}.`)
            }}
        />
    )
}

export type NextPageWithTheme = NextPage & { theme: string };

const Landing: NextPageWithTheme = () => {
    return (
        <main className={styles.holder}>
            <Head>
                <meta name="google-site-verification" content="G9W38esL-KS54yNvXPERwXXO8mwCwXb1ko3_ls6rm_o" />
                <title>estudaí</title>
                <meta
                    name="description"
                    content="Uma plataforma de organização de estudos online que o ajudará a revisar e manter suas matérias em dia.
                    Chega de esquecimentos."
                />
            </Head>
            <LandingHeader />
            <StarIcon className={styles.star} />
            <PiIcon className={styles.pi} />
            <EnergyIcon className={styles.energy} />
            <PaperPlaneIcon className={styles.paperPlane} />
            <BaskharaIcon className={styles.baskhara} />
            <StarIcon className={styles.star2} />

            <div className={styles.container}>
                <LandingNote showOnlyInMobile />
                <div className={styles.title}>
                    <h1><Translate>Organize your study flow</Translate>.</h1>
                    <p><Translate>Put an end to desperate revisions 15 minutes before the test once and for all</Translate>.</p>
                    <Link href={"/auth/register"}>
                        <Button
                            icon={'arrow_right_alt'}
                            title={TranslateText("Create an account")}
                            style={{ padding: "1rem 1.5rem", backgroundColor: "var(--primary-02)", borderRadius: "0.5rem", flexDirection: "row-reverse", zIndex: 5 }}
                        />
                    </Link>
                </div>
                <Device />
            </div>
            <LandingFooter />
        </main>
    )
}

Landing.theme = "default";
export default Landing;