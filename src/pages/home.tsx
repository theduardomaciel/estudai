import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { useState, useMemo, useEffect } from 'react';
import { parseCookies, setCookie } from 'nookies';

import Head from 'next/head';
import Link from 'next/link';

// Components
import Profile from '../components/Profile'
import Button from '../components/Button'
import Menu from '../components/Menu';
import SectionSelector from '../components/SectionSelector';
import TaskView from '../components/Task';
import Sidebar from '../components/Sidebar';
import LandingIntroModal from '../components/Landing/IntroModal';

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
import getUser from '../services/getUserByToken';
import removeCookies from '../services/removeCookies';
import { User } from '../types/User';
import { useRouter } from 'next/router';
import useTranslate, { TranslateText } from '../components/Translate';
import Translate from '../components/Translate';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['estudai.token']: token } = parseCookies(context)

    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=59'
    )

    let user = await getUser(token, 'full', "full") as unknown as User;

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


    return {
        props: {
            user
        }
    }
}

interface EmptyTasks {
    description?: string;
    removeMargin?: boolean;
}

export const EmptyTasksMessage = ({ description, removeMargin }: EmptyTasks) => <div style={{ marginTop: removeMargin ? "0px" : "10rem" }} className={styles.emptyTasks}>
    <span className={`material-icons-rounded static`} style={{ fontSize: "5.6rem" }}>blur_on</span>
    <p><strong><Translate>A little empty here, huh?</Translate></strong> </p>
    <p>{description ? description : TranslateText("Add a new task with the button above to make it appear here!")}</p>
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
            title={TranslateText('Add task')}
        />
    </a>
</Link>

export default function Home({ user }: { user: User }) {
    const { changeViewMode, viewMode, toggleMenu } = useAppContext();

    const [actualSection, setActualSection] = useState({ name: TranslateText("Pending"), id: 0 });

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
        .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true && task.date && task.date <= now && task.type !== "av1" && task.type !== "av2")
        .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)

    const archivedTasks = user.tasks
        .filter((task, i) => task.date <= now && task.type === "av1" || task.date <= now && task.type === "av2")
        .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)

    const noDateTasks = user.tasks
        .filter((task, i) => !task.date && task.interactedBy.find((taskUser, i) => taskUser.id !== user.id) || task.date === 0 && task.interactedBy.find((taskUser, i) => taskUser.id !== user.id))
        .map((task, index) => <TaskView key={index} task={task} status={"pending"} />)

    const emptyStyle = actualSection.id === 0 ? (monthTasks.length === 0 && otherMonthsTasks.length === 0 ? styles.empty : "") :
        (concludedTasks.length && expiredTasks.length & expiredTasks.length & noDateTasks.length) === 0 ? styles.empty : "";

    const router = useRouter()

    return (
        <main>
            <Head>
                <title>estudaí</title>
                <meta
                    name="description"
                    content="Uma plataforma de organização de estudos online que o ajudará a revisar e manter suas matérias em dia.
                    Chega de esquecimentos."
                />
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile onClick={toggleMenu} user={user} showMenu />
                <div className={"header"}>
                    <h3 className={"title"}><Translate>My tasks</Translate></h3>
                    <div className={styles.actionButtons}>
                        {
                            user.tasks.length > 0 &&
                            <div className={styles.viewType}>
                                <span onClick={() => changeViewMode("list")} className={`material-icons-rounded click static ${styles.icon} ${viewMode === "list" && styles.active}`}>format_list_bulleted</span>
                                <span onClick={() => changeViewMode('card')} className={`material-icons-rounded click static ${styles.icon} ${viewMode === "card" && styles.active}`}>event_note</span>
                            </div>
                        }
                        <AddTaskButton query={{ userId: user.id, groups: JSON.stringify(user.groups) }} />
                    </div>
                </div>
                <div className={styles.subheader}>
                    <SectionSelector sections={[{ name: TranslateText("Pending"), id: 0 }, { name: TranslateText("Archived"), id: 1 }]} actualSection={actualSection} setSection={setActualSection} />
                    {/* <Button
                        style={{ fontSize: "1.4rem", paddingInline: "2rem", paddingBlock: "0.5rem", backgroundColor: "var(--font-light)", cursor: "not-allowed" }}
                        icon={'filter_alt'}
                        disableHoverEffect={true}
                        iconProps={{ size: "2.2rem" }}
                        title='Filtrar'
                    /> */}
                </div>
                <div className={`${styles.tasks} ${emptyStyle} ${viewMode === "card" ? styles.cardView : ""}`} >
                    {
                        actualSection.id === 0 ?
                            monthTasks.length > 0 || otherMonthsTasks.length > 0 ?
                                <>
                                    {
                                        monthTasks.length > 0 &&
                                        <>
                                            {viewMode === 'list' && <h5><Translate>This month</Translate></h5>}
                                            {monthTasks}
                                        </>
                                    }
                                    {
                                        otherMonthsTasks.length > 0 &&
                                        <>
                                            {viewMode === 'list' && <h5><Translate>Next months</Translate></h5>}
                                            {otherMonthsTasks}
                                        </>
                                    }
                                </>
                                :
                                <EmptyTasksMessage description={TranslateText("Looks like there are no pending tasks for you :)")} />
                            :
                            concludedTasks.length > 0 || expiredTasks.length > 0 || expiredTasks.length > 0 || noDateTasks.length > 0 ?
                                <>
                                    {concludedTasks.length > 0 && viewMode === 'list' && <h5><Translate>Concluded</Translate></h5>}
                                    {concludedTasks}
                                    {noDateTasks.length > 0 && viewMode === 'list' && <h5><Translate>No date</Translate></h5>}
                                    {noDateTasks}
                                    {expiredTasks.length > 0 && viewMode === 'list' && <h5><Translate>Expired</Translate></h5>}
                                    {expiredTasks}
                                    {expiredTasks.length > 0 && viewMode === 'list' && <h5><Translate>Archived</Translate></h5>}
                                    {archivedTasks}
                                </>
                                :
                                <EmptyTasksMessage description={TranslateText("Looks like there aren't any tasks archived around here :)")} />
                    }
                </div>
            </div>
            <Menu />
            {
                router.query?.newAccount &&
                <LandingIntroModal sections={[
                    {
                        title: TranslateText("Welcome to estudaí"),
                        description: TranslateText("We're happy to have you here.\nHere are some quick tips to make you enjoy all the features."),
                        image_path: Modal1Image,
                        imageSize: { height: 225, width: 400 }
                    },
                    {
                        title: TranslateText("Organize your study flow"),
                        description: TranslateText("Save activities, tests and events on the platform to avoid any rush moments before the due date."),
                        image_path: Modal2Image,
                        imageSize: { height: 100, width: 400 }
                    },
                    {
                        title: TranslateText("Keep up with your appointments"),
                        description: TranslateText("Participate and create community groups to unite those people who have the same goals as you."),
                        image_path: Modal3Image,
                        imageSize: { height: 180, width: 400 }
                    },
                    {
                        title: TranslateText("Track the progress of your tasks"),
                        description: TranslateText("Tag attachments and links sent by other users in assignments and keep track of which materials you've already used."),
                        image_path: Modal4Image,
                        imageSize: { height: 180, width: 400 }
                    },
                    {
                        title: TranslateText("Explore and enjoy"),
                        description: TranslateText("estudaí is all yours.\nEnjoy all the features lovingly prepared for you and good learning!\nMade with ❤️ by @theduardomaciel"),
                        image_path: Modal5Image,
                        marginTop: "3.5rem",
                        imageSize: { height: 350, width: 400 }
                    }
                ]} />
            }
        </main>
    )
}