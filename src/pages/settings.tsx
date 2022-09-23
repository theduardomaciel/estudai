import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/Home.module.css'

// Components
import Sidebar from '../components/Sidebar';

const Settings: NextPage = () => {
    return (
        <main>
            <Head>
                <title>Configurações</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>

            </div>
        </main>
    )
}

export default Settings
