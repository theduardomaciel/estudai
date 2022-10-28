import { useRef, useState } from 'react';

import Head from 'next/head';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

// Stylesheets
import styles from '../../styles/Group.module.css'
import homeStyles from '../../styles/Home.module.css'
import inputStyles from "../../components/Input/label.module.css";

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
import { AddTaskButton, EmptyTasksMessage } from '../home';
import TaskView from '../../components/Task';
import { Separator } from '../../components/Separator';
import Modal from '../../components/Modal';
import { api } from '../../lib/api';
import { useRouter } from 'next/router';
import getUser from '../../services/getUser';
import { User } from '../../types/User';
import Input, { InputLabel } from '../../components/Input';
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token } = parseCookies(context)

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

    let group = await getGroup(groupId) as unknown as Group | null;

    if (group) {
        const date = group.createdAt as Date;
        group.createdAt = Math.floor(date.getTime()) as number;
        group.tasks.map((task, index) => {
            const date = new Date(task.date);
            task.date = Math.floor(date.getTime());
            return task;
        })
    } else {
        group = null
    }

    let user = await getUser(userId as number, 'full') as unknown as User;

    user.tasks.map((task, index) => {
        const date = new Date(task.date);
        task.date = Math.floor(date.getTime());
        if (task.group) {
            task.group.createdAt = Math.floor(date.getTime());
        }
        return task;
    })

    user.groups.map((group, index) => {
        const date = new Date(group.createdAt);
        group.createdAt = Math.floor(date.getTime());
        group.tasks.map((task, index) => {
            const date = new Date(task.date);
            task.date = Math.floor(date.getTime());
            return task;
        })
        return group;
    })

    return {
        props: {
            group,
            user
        }
    }
}

const Group = ({ group, user }: { group: Group, user: User }) => {
    const router = useRouter();
    const [actualSection, setActualSection] = useState('Pendente');

    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const linkTextRef = useRef<HTMLParagraphElement>(null);

    const url = `https://estudai.vercel.app/groups/invite/${group.shareLink}`
    function onLinkClick() {
        navigator.clipboard.writeText(url)
        if (linkTextRef.current) {
            linkTextRef.current.textContent = "Copiado para a área de transferência!"
            setTimeout(() => {
                if (linkTextRef.current) {
                    linkTextRef.current.textContent = url
                }
            }, 1000);
        }
    }

    const [isLoading, setLoading] = useState(false);
    const [isExitModalVisible, setExitModalVisible] = useState('');

    async function exitGroup() {
        setLoading(true)

        try {
            const response = await api.patch(`/groups/${group.id}`, { userId: user.id })
            console.log(response.data)
            router.push(`/groups`)
        } catch (error) {
            setExitModalVisible('error')
            setLoading(false)
        }
    }

    const actualDate = new Date();
    const now = actualDate.getTime();

    const pendingTasks = group.tasks
        .filter((task, i) => {
            const notInteracted = task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true;
            if (task.date > now && notInteracted) {
                return true
            } else {
                return false
            }
        })
        .map((task, index) => <TaskView key={index} task={task} status={"pending"} />)

    const concludedTasks = user.tasks
        .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id))
        .map((task, index) => <TaskView key={index} task={task} status={"concluded"} />)

    const [isConfigModalVisible, setConfigModalVisible] = useState(false);

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
                            <span className={'material-symbols-rounded static'}>group</span>
                            <p>{group.users.length} participante{group.users.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className={styles.info}>
                            <span className={'material-symbols-rounded static'}>schedule</span>
                            <p>desde {formatDate(group.createdAt as number)}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.tasks}>
                        <div className={homeStyles.subheader}>
                            <SectionSelector sections={["Pendente", "Arquivado"]} actualSection={actualSection} setSection={setActualSection} />
                            <Button
                                style={{ fontSize: "1.4rem", paddingInline: "2rem", paddingBlock: "0.5rem" }}
                                icon={'filter_alt'}
                                iconProps={{ size: "2.2rem" }}
                                title='Filtrar'
                            />
                        </div>
                        <div className={`${homeStyles.tasks}`}>
                            {
                                actualSection === 'Pendente' ?
                                    pendingTasks.length > 0 ?
                                        pendingTasks
                                        :
                                        <EmptyTasksMessage description={`Parece que não há nenhuma tarefa pendente neste grupo pra você :)`} />
                                    :
                                    <>
                                        <h5>Concluído</h5>
                                        {concludedTasks}
                                        <h5>Expirado</h5>
                                        {
                                            group.tasks
                                                .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true && task.date <= now && task.type !== "av1" && task.type !== "av2")
                                                .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)
                                        }
                                        <h5>Arquivado</h5>
                                        {
                                            group.tasks
                                                .filter((task, i) => task.date <= now && task.type === "av1" || task.date <= now && task.type === "av2")
                                                .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)
                                        }
                                    </>
                            }
                        </div>
                    </div>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarContent}>
                            <AddTaskButton width='100%' query={{ userId: user.id, groups: JSON.stringify(user.groups) }} />
                            <div className={`${styles.pinnedMessageContainer} ${styles.sidebarContainer}`}>
                                <header>
                                    <span className={'material-symbols-rounded'}>push_pin</span>
                                    Mensagem Fixada
                                </header>
                                <p>{group.pinnedMessage && group.pinnedMessage.length > 0 ? group.pinnedMessage : "[nenhuma]"}</p>
                            </div>
                            <div className={`${styles.tasksInfoContainer} ${styles.sidebarContainer}`}>
                                <div>
                                    <p>Atividades pendentes</p>
                                    <h6>{pendingTasks.length}</h6>
                                </div>
                                <Separator orientation='horizontal' />
                                <div>
                                    <p>Atividades concluídas</p>
                                    <h6>{concludedTasks.length}</h6>
                                </div>
                            </div>
                            <div className={`${styles.sidebarContainer}`}>
                                <Button
                                    title='CONVIDAR USUÁRIOS'
                                    onClick={() => setShareModalVisible(true)}
                                    icon={'share'}
                                    iconProps={{ size: "1.8rem" }}
                                    style={{ width: "100%", padding: "1rem 1.5rem", backgroundColor: "var(--primary-02)" }}
                                />
                                <Button
                                    title='CONFIGURAÇÕES'
                                    onClick={() => setConfigModalVisible(true)}
                                    icon={'tune'}
                                    iconProps={{ size: "1.8rem", color: "var(--font-light)" }}
                                    preset={"fillHover"}
                                    style={{ width: "100%", padding: "1rem 1.5rem" }}
                                />
                                <Button
                                    title='SAIR DO GRUPO'
                                    onClick={() => setExitModalVisible('default')}
                                    icon={'exit_to_app'}
                                    iconProps={{ color: "var(--red-01)" }}
                                    preset={"fillHover"}
                                    style={{ width: "100%", padding: "0.5rem 1.5rem" }}
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <Modal
                isVisible={isShareModalVisible}
                toggleVisibility={() => setShareModalVisible(!isShareModalVisible)}
                icon={'share'}
                iconProps={{ position: "flex-start", builtWithTitle: true, size: "3.8rem" }}
                color={`var(--primary-02)`}
                title={'Olha aqui o link ó:'}
            >
                <p>Compartilhe-o com outros usuários da plataforma para que eles possam entrar no grupo e participar de sua comunidade!
                    <br />Tarefas enviadas em um grupo serão visíveis para todos que estiverem nele!
                </p>
                <div className={`${inputStyles.input} hoverLink`} style={{ overflowX: "hidden" }} onClick={onLinkClick}>
                    <p ref={linkTextRef}>{url}</p>
                    <span className='material-symbols-rounded'>content_copy</span>
                </div>
            </Modal>
            <Modal
                isVisible={isExitModalVisible === 'default'}
                toggleVisibility={() => setExitModalVisible('')}
                icon={'exit_to_app'}
                color={`var(--primary-02)`}
                title={isExitModalVisible === 'default' ? 'Tem certeza que deseja sair do grupo?' : "Epa. Algo deu ruim."}
                actionProps={{
                    buttonText: "SAIR DO GRUPO",
                    disabled: isExitModalVisible !== 'default',
                    function: exitGroup
                }}
                suppressReturnButton={isExitModalVisible !== 'default'}
                isLoading={isLoading}
                description={isExitModalVisible === 'default' ? "Para voltar a participar do grupo será necessário ser convidado por um integrante ou administrador novamente." : "Por favor, tente novamente mais tarde. Caso o problema persista, nos avise :)"}
            >
            </Modal>
            <Modal
                isVisible={isConfigModalVisible}
                toggleVisibility={() => setConfigModalVisible(!isConfigModalVisible)}
                icon={'tune'}
                iconProps={{ position: "flex-start", builtWithTitle: true, size: "2.8rem" }}
                color={`var(--primary-02)`}
                actionProps={{
                    buttonText: "SALVAR",
                    buttonIcon: 'save',
                    function: () => setConfigModalVisible(false)
                }}
            >
                <Input label='Nome do Grupo' placeholder={group.name} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                    <InputLabel label='Mensagem Fixada' />
                    <textarea className={inputStyles.input} style={{ height: "7.5rem" }} placeholder={group.pinnedMessage} />
                </div>
                <InputLabel label='Participantes' />
                <div className={styles.membersContainer}>
                    {
                        group.users.map((user, index) => <li key={index} className={styles.groupMember}>
                            <div className={'iconHolder'} style={{ gap: "1rem" }}>
                                <Image src={user.image_url} alt={'User avatar'} width={22} height={22} style={{ borderRadius: "50%" }} />
                                <p style={{ width: "fit-content" }}>{`${user.firstName} ${user.lastName}`}</p>
                            </div>

                            <Button
                                title='REMOVER PARTICIPANTE'
                                iconProps={{ filled: true, size: '1.8rem' }}
                                icon={'person_remove'}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: "0.5rem 1.25rem",
                                    gap: "1.5rem",
                                    backgroundColor: "var(--red-01)",
                                    border: "none",
                                    outline: "none"
                                }}
                                preset={"fillHover"}
                            />
                        </li>)
                    }
                </div>
            </Modal>
        </main>
    )
}

export default Group;