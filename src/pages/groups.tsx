import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/Groups.module.css'

// Components
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';

const Groups: NextPage = () => {
    return (
        <main>
            <Head>
                <title>Grupos</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile />
            </div>
        </main>
    )
}

export default Groups;
