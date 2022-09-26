import Link from 'next/link';
import { useState } from 'react';
import type { NextPage } from 'next'

import Head from 'next/head';
import Image from 'next/image'

// Icons
import FilterIcon from "/public/icons/filter.svg";
import ListIcon from "/public/icons/listView.svg";
import CardIcon from "/public/icons/cardView.svg";
import TimerIcon from "/public/icons/timer.svg";
import CalendarIcon from "/public/icons/calendar.svg";
import LeftChevron from "/public/icons/left_chevron.svg";

import CloseIcon from "/public/icons/close.svg";

// Componentes
import Profile from '../components/Profile'
import Button from '../components/Button'
import Menu from '../components/Menu';
import SectionSelector from '../components/SectionSelector';
import Calendar from '../components/Calendar';
import TopicsGroup from '../components/Topic/TopicsGroup';
import TaskView from '../components/Task';
import Sidebar from '../components/Sidebar';
import TextInput from '../components/Input';
import { Separator } from '../components/Separator';

// Stylesheets
import styles from '../styles/Home.module.css'

// App Context
import { useAppContext } from '../context/appContext';

const Home: NextPage = () => {
    const [menuOpened, setMenuOpened] = useState(false);

    function toggleMenu() {
        setMenuOpened(!menuOpened)
    }

    function moveScroll(amount: number) {
        const scroll = document.getElementById('topicsScroll') as HTMLDivElement;
        /* scroll.scrollLeft -= 20; */
        scroll.scrollTo({
            top: 0,
            left: scroll.scrollLeft + amount,
            behavior: 'smooth'
        });
    }

    const [focusMinutes, setFocusMinutes] = useState(60);
    const focusPauses = focusMinutes ? Math.max(1, Math.floor(focusMinutes / 25)) : 0;

    const { changeViewMode, viewMode } = useAppContext();

    return (
        <main>
            <Head>
                <title>estudaí</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile onClick={toggleMenu} />
                <div className={"header"}>
                    <h3 className={"title"}>Tarefas pendentes</h3>
                    <div className={styles.actionButtons}>
                        <div className={styles.viewType}>
                            <ListIcon className={`${styles.listIcon} ${viewMode === "list" && styles.active}`} onClick={() => changeViewMode("list")} style={{ cursor: "pointer" }} />
                            <CardIcon className={`${styles.cardIcon} ${viewMode === "card" && styles.active}`} onClick={() => changeViewMode('card')} style={{ cursor: "pointer" }} />
                        </div>
                        <Link href={`/create`}>
                            <Button
                                classes={styles.addButton}
                                style={{ backgroundColor: "var(--primary-02)", padding: "1rem 2.5rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)" }}
                                icon={<Image src="/icons/add.svg" height={18} width={18} />}
                                title='Adicionar tarefa'
                            />
                        </Link>
                    </div>
                </div>
                <div className={styles.subheader}>
                    <SectionSelector sections={["Bimestre atual", "Completado"]} />
                    <Button style={{ fontSize: "1.4rem", paddingInline: "2rem", paddingBlock: "0.5rem" }} icon={<FilterIcon width={22} height={22} />} title='Filtrar' />
                </div>
                <div className={`${styles.tasks} ${viewMode === "card" ? styles.cardView : ""}`}>
                    <TaskView />
                    <TaskView />
                    <TaskView />
                    <TaskView />
                </div>
            </div>
            <Menu isOpened={menuOpened}>
                <div className={styles.menuHeader}>
                    <div className='row'>
                        <h3>Agenda</h3>
                        <Button classes={styles.closeButton} icon={<CloseIcon />} onClick={toggleMenu} style={{ padding: "0.25rem" }} />
                    </div>
                    <Calendar />
                    <div className={styles.eventHolder} >
                        <h6>Próximo evento importante</h6>
                        <div className={styles.card}>
                            <div className={styles.cardColumn}>
                                <p style={{ textTransform: "uppercase" }}>AV1 | 3º BIMESTRE</p>
                                <h5>Matemática e Natureza</h5>
                            </div>
                            <div className={styles.cardColumn} style={{ alignItems: "flex-end" }}>
                                <div className='row' style={{ gap: "0.25rem", width: "fit-content" }}>
                                    <CalendarIcon />
                                    <p>29/02</p>
                                </div>
                                <p style={{ textAlign: "end" }}>90 questões</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.focus}>
                    <div className={`row`}>
                        <h3>Foco</h3>
                    </div>
                    <TextInput label='Nome da tarefa' placeholder='Insira o nome da tarefa aqui' />
                    <div className={'row'} style={{ gap: "1.5rem" }}>
                        <LeftChevron className="click" onClick={() => moveScroll(-25)} />
                        <TopicsGroup topics={[
                            {
                                icon: '📒',
                                title: 'Resumo'
                            },
                            {
                                icon: '📚',
                                title: 'Leitura do Livro'
                            },
                            {
                                icon: '📖',
                                title: 'Leitura'
                            },
                            {
                                icon: '📝',
                                title: 'Atividade'
                            },
                            {
                                icon: '📌',
                                title: 'Revisão'
                            }
                        ]} />
                        <LeftChevron onClick={() => moveScroll(25)} className="click" style={{ transform: "rotate(180deg)" }} />
                    </div>
                    <TextInput
                        onChange={(event) => setFocusMinutes(parseInt(event.target.value))}
                        label='Tempo de atividade'
                        placeholder='60'
                        fixedUnit='minutos'
                    />
                    <div /* style={{ gap: "2.5rem" }} */ className="row">
                        <Button icon={<TimerIcon />} title={'Iniciar Foco'} buttontype="sendForm" />
                        <Separator decorative orientation="vertical" />
                        <p className={styles.intervalCount}>Você terá <br />
                            <span>{focusPauses} intervalo{focusPauses !== 1 && "s"}</span></p>
                    </div>
                </div>
            </Menu>
        </main>
    )
}

export default Home
