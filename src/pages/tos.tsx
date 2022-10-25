import type { NextPage } from 'next'

import Head from 'next/head';

// Sections
import LandingHeader from '../components/Landing/Header';
import LandingFooter from '../components/Landing/Footer';

// Stylesheets
import styles from '../styles/Landing.module.css'

// Components
import Note from '../components/Landing/Note';
import Button from '../components/Button';

const TermsOfService: NextPage = () => {
    return (
        <main className={styles.holder}>
            <Head>
                <title>estudaí</title>
            </Head>
            <LandingHeader />
            <div className={styles.container}>
                <Note showOnlyInMobile tag='ALPHA' />
                <div className={styles.title}>
                    <p>work in progress...</p>
                </div>
            </div>
        </main>
    )
}

export default TermsOfService;