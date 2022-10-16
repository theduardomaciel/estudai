import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/Groups.module.css'

// Components
import Sidebar from '../../components/Sidebar';

const Group: NextPage = () => {
    return (
        <main>
            <Head>
                <title>Grupo</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>

            </div>
        </main>
    )
}

export default Group;