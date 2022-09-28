import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/Task.module.css';

// Components
import Sidebar from '../../components/Sidebar';
import Navigator from '../../components/Navigator';

import Button from '../../components/Button';
import UsersPortraits from '../../components/UsersPortraits';
import { Separator } from '../../components/Separator';
import SectionSelector from '../../components/SectionSelector';

const Task: NextPage = () => {
    return (
        <main className={styles.holder}>
            <Head>
                <title>Atividade de Biologia</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <div className='header'>
                    <Navigator directory='Atividade de Biologia' parentDirectory='Terceirão' />
                    <div className={styles.usersInfo}>
                        <UsersPortraits imagesUrls={["https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png"]} />
                        <p>+de <span>10 membros</span> já concluíram a atividade</p>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.column}>
                        <p>A Biologia é uma área complexa que se destina ao estudo dos seres vivos. A Biologia é uma ciência que estuda a vida em seus mais variados aspectos, importando-se em compreender, por exemplo, o funcionamento dos organismos vivos, a relação desses seres com o meio e seu processo de evolução.</p>
                        <div className={styles.userInfo}>
                            <img src="https://github.com/theduardomaciel.png" alt="" />
                            <p>texto enviado por <span>meninocoiso</span></p>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <Button title='MARCAR COMO CONCLUÍDO' icon={'check'} iconSize={"1.8rem"} style={{
                            fontSize: "1.2rem",
                            width: "100%",
                            padding: "0.5rem 1rem",
                            gap: "1.5rem",
                            color: "var(--primary-02)",
                            backgroundColor: "var(--light)",
                            border: "1px solid var(--primary-02)",
                            borderRadius: "0.5rem",
                        }} />
                        <div className={styles.taskInfo}>
                            <p>Obrigatório</p>
                            <Separator orientation='vertical' />
                            <p>Manuscrito</p>
                            <Separator orientation='vertical' />
                            <p>6,0 pontos</p>
                        </div>
                    </div>
                </div>
                <div className={styles.deadline}>
                    <p><span className='bold'>ATENÇÃO!</span> Você tem até o dia </p>
                    <div>
                        <span className={`material-symbols-rounded`}>calendar_today</span>
                        <span>24/02/2022</span>
                    </div>
                    <p>para entregar essa atividade.</p>
                </div>
                <div className='header'>
                    <SectionSelector sections={["Anexos", "Links"]} />
                    <div className={`row ${styles.headerButtons}`}>
                        <Button icon={'filter_alt'} />
                        <Button icon={'attach_file'} title='Adicionar anexo' />
                    </div>
                </div>
                <div className={styles.attachments}>
                    <div className={styles.attachmentHeader}>
                        <span className={`material-symbols-rounded`}>print</span>
                        <p>Listas de Questões</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Task;