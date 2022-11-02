import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { useState, useMemo } from 'react';
import { parseCookies, setCookie } from 'nookies';

import Head from 'next/head';
import Link from 'next/link';

// Components
import Profile from '../components/Profile'
import Button from '../components/Button'
import Menu from '../components/Menu';
import SectionSelector from '../components/SectionSelector';
import Calendar from '../components/Calendar';
import TaskView from '../components/Task';
import Sidebar from '../components/Sidebar';
import LandingIntroModal from '../components/Landing/IntroModal';
import Focus from '../components/Focus';

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
import { Task } from '../types/Task';


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token, ['app.shownModal']: shownModal } = parseCookies(context)

    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=59'
    )

    console.warn(token, context.req.cookies)
    const userId = await getUserIdByToken(token as string);

    if (!userId) {
        await removeCookies(context);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    let user = await getUser(userId as number, 'full') as unknown as User;

    user.tasks.map((task, index) => {
        const date = new Date(task.date);
        task.date = Math.floor(date.getTime());
        if (task.group) {
            const groupCreatedAtDate = new Date(task.group.createdAt);
            task.group.createdAt = Math.floor(groupCreatedAtDate.getTime());
        }
        return task;
    })

    user.groups.map((group, index) => {
        const date = new Date(group.createdAt);
        group.createdAt = Math.floor(date.getTime());
        group.tasks.map((task, i) => {
            const taskDate = new Date(task.date);
            task.date = Math.floor(taskDate.getTime());
            return task;
        })
        return group;
    })

    setCookie(context, 'app.shownModal', 'true', {
        path: "/"
    })

    const alreadyShownIntroModal = shownModal === 'true' ? true : false;
    console.log(alreadyShownIntroModal)

    return {
        props: {
            user,
            alreadyShownIntroModal
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
    legacyBehavior
    href={{
        pathname: '/task/new',
        query: query,
    }}
    as={`/task/new`}
>
    <a style={{ width: "100%" }} href="">
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

const Home = ({ user, alreadyShownIntroModal }: { user: User, alreadyShownIntroModal: boolean }) => {
    const [menuOpened, setMenuOpened] = useState(false);

    function toggleMenu() {
        setMenuOpened(!menuOpened)
    }

    const { changeViewMode, viewMode } = useAppContext();

    const [actualSection, setActualSection] = useState('Pendente');

    const actualDate = new Date();
    const now = actualDate.getTime();

    const monthTasks = user.tasks
        .filter((task, i) => {
            const taskDate = new Date(task.date);
            const notInteracted = task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true;
            if (task.date > now && taskDate.getMonth() === actualDate.getMonth() && notInteracted) {
                return true
            } else {
                return false
            }
        })
        .map((task, index) => <TaskView key={index} task={task} status={"pending"} />)

    const otherMonthsTasks = user.tasks
        .filter((task, i) => {
            const taskDate = new Date(task.date);
            const notInteracted = task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true;
            if (task.date > now &&
                taskDate.getFullYear() === actualDate.getFullYear() &&
                taskDate.getMonth() !== actualDate.getMonth() && notInteracted) {
                return true
            } else {
                return false
            }
        })
        .map((task, index) => <TaskView key={index} task={task} status={"pending"} />)

    const concludedTasks = user.tasks
        .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id))
        .map((task, index) => <TaskView key={index} task={task} status={"concluded"} />)

    const expiredTasks = user.tasks
        .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true && task.date <= now && task.type !== "av1" && task.type !== "av2")
        .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)

    const archivedTasks = user.tasks
        .filter((task, i) => task.date <= now && task.type === "av1" || task.date <= now && task.type === "av2")
        .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)


    const focus = useMemo(() => <Focus />, [])

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
                    {/* <Button
                        style={{ fontSize: "1.4rem", paddingInline: "2rem", paddingBlock: "0.5rem", backgroundColor: "var(--font-light)", cursor: "not-allowed" }}
                        icon={'filter_alt'}
                        disableHoverEffect={true}
                        iconProps={{ size: "2.2rem" }}
                        title='Filtrar'
                    /> */}
                </div>
                <div className={`${styles.tasks} ${viewMode === "card" ? styles.cardView : ""}`}>
                    {
                        actualSection === 'Pendente' ?
                            monthTasks.length > 0 || otherMonthsTasks.length > 0 ?
                                <>
                                    {
                                        monthTasks.length > 0 &&
                                        <>
                                            {viewMode === 'list' && <h5>Este mês</h5>}
                                            {monthTasks}
                                        </>
                                    }
                                    {
                                        otherMonthsTasks.length > 0 &&
                                        <>
                                            {viewMode === 'list' && <h5>Próximos meses</h5>}
                                            {otherMonthsTasks}
                                        </>
                                    }
                                </>
                                :
                                <EmptyTasksMessage description={`Parece que não há nenhuma tarefa pendente para você :)`} />
                            :
                            concludedTasks.length > 0 || expiredTasks.length > 0 || expiredTasks.length > 0 ?
                                <>
                                    {concludedTasks.length > 0 && viewMode === 'list' && <h5>Concluído</h5>}
                                    {concludedTasks}
                                    {expiredTasks.length > 0 && viewMode === 'list' && <h5>Expirado</h5>}
                                    {expiredTasks}
                                    {expiredTasks.length > 0 && viewMode === 'list' && <h5>Arquivado</h5>}
                                    {archivedTasks}
                                </>
                                :
                                <EmptyTasksMessage description={`Parece que não há nenhuma tarefa arquivada por aqui :)`} />
                    }
                </div>
            </div>
            <Menu isOpened={menuOpened}>
                <div className={styles.menuHeader}>
                    <div className='row'>
                        <h3>Agenda</h3>
                        <Button classes={styles.closeButton} icon={'close'} onClick={toggleMenu} style={{ height: "3rem", width: "3rem", padding: 0 }} />
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

                {focus}
            </Menu>
            {
                alreadyShownIntroModal === false &&
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
                        marginTop: "3.5rem",
                        imageSize: { height: 350, width: 400 }
                    }
                ]} />
            }
        </main>
    )
}

export default Home;
