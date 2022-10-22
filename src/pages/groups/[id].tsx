import { useState } from 'react';

import Head from 'next/head';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

// Stylesheets
import styles from '../../styles/Group.module.css'
import homeStyles from '../../styles/Home.module.css'

// Components
import Sidebar from '../../components/Sidebar';
import Navigator from '../../components/Navigator';
import { parseCookies } from 'nookies';
import getUserIdByToken from '../../services/getUserIdByToken';
import removeCookies from '../../services/removeCookies';
import getGroup from '../../services/getGroup';
import { Group } from '../../types/Group';
import formatDate from '../../utils/formatDate';
import SectionSelector from '../../components/SectionSelector';
import Button from '../../components/Button';
import { EmptyTasksMessage } from '../home';
import TaskView from '../../components/Task';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token } = parseCookies(context)

    console.log(context.req.cookies);

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

    const groupId = parseInt(context.query.id as string);
    console.log(groupId);

    let group = await getGroup(groupId) as unknown as Group;

    if (group) {
        const date = group.createdAt as Date;
        group.createdAt = Math.floor(date.getTime()) as number;
    }

    return {
        props: {
            group
        }
    }
}

const Group = ({ group }: { group: Group }) => {
    const [actualSection, setActualSection] = useState('Pendente');

    return (
        <main className={styles.holder}>
            <Head>
                <title>{group.name}</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Navigator directory={'Grupos'} />
                <div className={styles.header}>
                    <h1>{group.name} </h1>
                    <div className={styles.details}>
                        <h4>Detalhes</h4>
                        <div className={styles.info}>
                            <span className={'material-symbols-rounded'}>group</span>
                            <p>{group.users.length} participante{group.users.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className={styles.info}>
                            <span className={'material-symbols-rounded'}>schedule</span>
                            <p>desde {formatDate(group.createdAt as number)}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.tasks}>
                        <div className={homeStyles.subheader}>
                            <SectionSelector sections={["Pendente", "Completado"]} actualSection={actualSection} setSection={setActualSection} />
                            <Button
                                style={{ fontSize: "1.4rem", paddingInline: "2rem", paddingBlock: "0.5rem" }}
                                icon={'filter_alt'}
                                iconProps={{ size: "2.2rem" }}
                                title='Filtrar'
                            />
                        </div>
                        <div className={`${homeStyles.tasks}`}>
                            {
                                group.tasks?.length > 0 ?
                                    group.tasks.map((task, index) => <TaskView key={index} task={task} />)
                                    :
                                    <EmptyTasksMessage description='Adicione uma nova tarefa a este grupo para que ela apareça aqui!' />
                            }
                        </div>
                    </div>
                    <aside className={styles.sidebar}>
                        <div className={styles.pinnedMessageContainer}>
                            <header>
                                <span className={'material-symbols-rounded'}>push_pin</span>
                                Mensagem Fixada
                            </header>
                            <p>{group.pinnedMessage && group.pinnedMessage.length > 0 ? group.pinnedMessage : "[nenhuma]"}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default Group;