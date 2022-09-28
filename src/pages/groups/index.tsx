import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/Groups.module.css'

// Components
import Sidebar from '../../components/Sidebar';
import Profile from '../../components/Profile';
import Link from 'next/link';
import Button from '../../components/Button';

const Groups: NextPage = () => {
    return (
        <main>
            <Head>
                <title>Grupos</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile />
                <div className={"header"}>
                    <h3 className={"title"}>Tarefas pendentes</h3>
                    <Link href={`/create`}>
                        <Button
                            classes={styles.addButton}
                            style={{ backgroundColor: "var(--primary-02)", padding: "0.75rem 1.5rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)" }}
                            icon={"group_add"}
                            title='Entrar em um grupo'
                        />
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default Groups;
