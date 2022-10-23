import type { GetServerSideProps, GetServerSidePropsContext, InferGetStaticPropsType, NextPage } from 'next'

import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

import Head from 'next/head';
import Link from 'next/link';

// Components
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

// Intro Modal Images
import Modal1Image from "/public/landing/introModal/modal_1.png";
import Modal2Image from "/public/landing/introModal/modal_2.png";
import Modal3Image from "/public/landing/introModal/modal_3.png";
import Modal4Image from "/public/landing/introModal/modal_4.png";
import Modal5Image from "/public/landing/introModal/modal_5.png";


// Stylesheets
import styles from '../styles/Home.module.css'

// App Context
import { useAppContext } from '../contexts/AppContext';

// Server Props
import getUser from '../services/getUser';
import getUserIdByToken from '../services/getUserIdByToken';
import removeCookies from '../services/removeCookies';
import { User } from '../types/User';
import LandingIntroModal from '../components/Landing/IntroModal';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token } = parseCookies(context)

    console.log(token)
    const userId = await getUserIdByToken(token);

    if (userId === null) {
        await removeCookies(context);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    let user = await getUser(userId as number, 'basic') as unknown as User;

    user.tasks.map((task, index) => {
        const date = new Date(task.date);
        task.date = Math.floor(date.getTime());
        return task;
    })

    user.groups.map((group, index) => {
        const date = new Date(group.createdAt);
        group.createdAt = Math.floor(date.getTime());
        return group;
    })

    return {
        props: {
            user
        }
    }
}

interface EmptyTasks {
    description?: string;
}

export const EmptyTasksMessage = ({ description }: EmptyTasks) => <div className={styles.emptyTasks}>
    <span className={`material-symbols-rounded static`} style={{ fontSize: "5.6rem" }}>blur_on</span>
    <p><strong>Um pouco vazio aqui, né?</strong> </p>
    <p>{description ? description : "Adicione uma nova tarefa com o botão acima para que ela apareça aqui!"}</p>
</div>

export const AddTaskButton = ({ query, width }: { query?: {}, width?: string }) => <Link
    href={{
        pathname: '/task/new',
        query: query,
    }}
    replace
    as={`/task/new`}
>
    <a href="" style={{ width: "100%" }}>
        <Button
            classes={styles.addButton}
            style={width ? { backgroundColor: "var(--primary-02)", padding: "1rem 2.5rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)", width: width } :
                { backgroundColor: "var(--primary-02)", padding: "1rem 2.5rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)" }
            }
            icon={"add"}
            title='Adicionar tarefa'
        />
    </a>
</Link>

const Home = ({ user }: { user: User }) => {
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

    useEffect(() => {
        const scroll = document.getElementById('topicsScroll') as HTMLDivElement;
        scroll.addEventListener("wheel", function (event) {
            if (event.deltaY > 0) {
                scroll.scrollTo({
                    top: 0,
                    left: scroll.scrollLeft + 100,
                    behavior: 'smooth'
                });
                event.preventDefault();
                // preventDefault() will help avoid worrisome 
                // inclusion of vertical scroll 
            } else {
                scroll.scrollTo({
                    top: 0,
                    left: scroll.scrollLeft - 100,
                    behavior: "smooth"
                });
                event.preventDefault();
            }
        });
    }, [])

    const [focusMinutes, setFocusMinutes] = useState(60);
    const focusPauses = focusMinutes ? Math.max(1, Math.floor(focusMinutes / 25)) : 0;

    const { changeViewMode, viewMode } = useAppContext();

    const [actualSection, setActualSection] = useState('Pendente');
    const now = new Date().getTime();

    return (
        <main>
            <Head>
                <title>estudaí</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile onClick={toggleMenu} user={user} showMenu />
                <div className={"header"}>
                    <h3 className={"title"}>Minhas tarefas</h3>
                    <div className={styles.actionButtons}>
                        <div className={styles.viewType}>
                            <span onClick={() => changeViewMode("list")} className={`material-symbols-rounded click static ${styles.icon} ${viewMode === "list" && styles.active}`}>format_list_bulleted</span>
                            <span onClick={() => changeViewMode('card')} className={`material-symbols-rounded click static ${styles.icon} ${viewMode === "card" && styles.active}`}>event_note</span>
                        </div>
                        <AddTaskButton query={{ userId: user.id, groups: JSON.stringify(user.groups) }} />
                    </div>
                </div>
                <div className={styles.subheader}>
                    <SectionSelector sections={["Pendente", "Arquivado"]} actualSection={actualSection} setSection={setActualSection} />
                    <Button
                        style={{ fontSize: "1.4rem", paddingInline: "2rem", paddingBlock: "0.5rem" }}
                        icon={'filter_alt'}
                        iconProps={{ size: "2.2rem" }}
                        title='Filtrar'
                    />
                </div>
                <div className={`${styles.tasks} ${viewMode === "card" ? styles.cardView : ""}`}>
                    {
                        user.tasks.length > 0 ?
                            actualSection === 'Pendente' ? user.tasks
                                .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id == user.id) ? false : true && task.date > now)
                                .map((task, index) => <TaskView key={index} task={task} status={"pending"} />) :
                                user.tasks
                                    .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id) || task.date <= now)
                                    .map((task, index) => <TaskView key={index} task={task} />)
                            :
                            <EmptyTasksMessage description='Adicione uma nova tarefa a este grupo para que ela apareça aqui!' />
                    }
                </div>
            </div>
            <Menu isOpened={menuOpened}>
                <div className={styles.menuHeader}>
                    <div className='row'>
                        <h3>Agenda</h3>
                        <Button classes={styles.closeButton} icon={'close'} onClick={toggleMenu} style={{ padding: "0.25rem" }} />
                    </div>
                    <Calendar userId={user.id} linkToCreate />
                    {/* <div className={styles.eventHolder} >
                        <h6>Próximo evento importante</h6>
                        <div className={styles.card}>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardColumn}>
                                <p style={{ textTransform: "uppercase" }}>AV1 | 3º BIMESTRE</p>
                                <h5>Matemática e Natureza</h5>
                            </div>
                            <div className={styles.cardColumn} style={{ alignItems: "flex-end" }}>
                                <div className='row' style={{ gap: "0.25rem", width: "fit-content" }}>
                                    <span style={{ fontSize: "1.2rem" }} className={`material-symbols-rounded`}>calendar_today</span>
                                    <p>29/02</p>
                                </div>
                                <p style={{ textAlign: "end" }}>90 questões</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className={styles.focus}>
                    <div className={`row`}>
                        <h3>Foco</h3>
                    </div>
                    <TextInput label='Nome da tarefa' placeholder='Insira o nome da tarefa aqui' height={'3.85rem'} />
                    <div className={'row'} style={{ gap: "1.5rem" }}>
                        <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(-25)}>chevron_left</span>
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
                        <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(25)}>chevron_right</span>
                    </div>
                    <TextInput
                        onChange={(event) => {
                            if (event.currentTarget.value.length < 5) {
                                setFocusMinutes(parseInt(event.target.value))
                            }
                        }}
                        value={focusMinutes}
                        label='Tempo de atividade'
                        placeholder='60'
                        type={'number'}
                        height={'3.85rem'}
                        fixedUnit='minutos'
                    />
                    <div /* style={{ gap: "2.5rem" }} */ className="row">
                        <Button icon={'av_timer'} title={'Iniciar Foco'} preset="sendForm" />
                        <Separator decorative orientation="vertical" />
                        <p className={styles.intervalCount}>Você terá <br />
                            <span>{focusPauses} intervalo{focusPauses !== 1 && "s"}</span></p>
                    </div>
                </div>
            </Menu>
            <LandingIntroModal sections={[
                {
                    title: 'Bem-vindo ao estudaí',
                    description: "Estamos felizes em ter você por aqui.\n Acompanhe algumas dicas rápidas pra te fazer aproveitar todas as funcionalidades.",
                    image_path: Modal1Image,
                    imageSize: { height: 225, width: 400 }
                },
                {
                    title: 'Organize seus estudos',
                    description: "Salve atividades, avaliações e eventos na plataforma para evitar aquela correria momentos antes da data de entrega.",
                    image_path: Modal2Image,
                    imageSize: { height: 100, width: 400 }
                },
                {
                    title: 'Mantenha-se em dia com seus compromissos',
                    description: "Participe e crie grupos comunitários para unir aquela galera que tem os mesmos objetivos que você.",
                    image_path: Modal3Image,
                    imageSize: { height: 180, width: 400 }
                },
                {
                    title: 'Acompanhe o progresso de suas tarefas',
                    description: "Marque anexos e links enviados por outros usuários em tarefas e tenha o controle de quais materiais você já utilizou.",
                    image_path: Modal4Image,
                    imageSize: { height: 180, width: 400 }
                },
                {
                    title: 'Desbrave e aproveite',
                    description: "O estudaí é todo seu.\nAproveite todas as funcionalidades preparadas com carinho para você e bom aprendizado!\nfeito com ❤️ por @theduardomaciel",
                    image_path: Modal5Image,
                    imageSize: { height: 350, width: 400 }
                }
            ]} />
        </main>
    )
}

export default Home;
