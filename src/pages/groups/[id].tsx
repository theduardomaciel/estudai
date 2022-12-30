import { useRef, useState, useEffect } from 'react';

import Head from 'next/head';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

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
import getUser from '../../services/getUserByToken';
import { User } from '../../types/User';
import Input, { InputLabel } from '../../components/Input';
import Image from 'next/image';
import UsersPortraits from '../../components/UsersPortraits';
import UsersModalPreset from '../../components/Modal/Presets/UsersModal';
import Translate, { TranslateText } from '../../components/Translate';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['estudai.token']: token } = parseCookies(context)

    const groupId = parseInt(context.query.id as string);

    let group = await getGroup(groupId) as unknown as Group | null;

    if (group) {
        const date = group.createdAt as Date;
        group.createdAt = Math.floor(date.getTime()) as number;
        group.tasks.map((task, index) => {
            const date = new Date(task.date);
            task.group.createdAt = Math.floor(date.getTime())
            task.date = Math.floor(date.getTime());
            return task;
        })
    } else {
        group = null
    }

    let user = await getUser(token, "full", "full") as unknown as User;

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
    const [actualSection, setActualSection] = useState({ name: TranslateText("Pending"), id: 0 });

    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const linkTextRef = useRef<HTMLParagraphElement>(null);

    const url = `https://estudai.vercel.app/groups/invite/${group.shareLink}`
    function onLinkClick() {
        navigator.clipboard.writeText(url)
        if (linkTextRef.current) {
            linkTextRef.current.textContent = TranslateText("Copied to clipboard!")
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

    const concludedTasks = group.tasks
        .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id))
        .map((task, index) => <TaskView key={index} task={task} status={"concluded"} />)

    const expiredTasks = user.tasks
        .filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true && task.date && task.date <= now && task.type !== "av1" && task.type !== "av2")
        .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)

    const archivedTasks = group.tasks
        .filter((task, i) => task.date <= now && task.type === "av1" || task.date <= now && task.type === "av2")
        .map((task, index) => <TaskView key={index} task={task} status={"expired"} />)

    const noDateTasks = user.tasks
        .filter((task, i) => new Date(task.date).getFullYear() === 112 && (task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true) === true)
        .map((task, index) => <TaskView key={index} task={task} status={"pending"} />)

    const [isConfigModalVisible, setConfigModalVisible] = useState(false);
    const [newPinnedMessage, setNewPinnedMessage] = useState(group.pinnedMessage);
    const [newGroupName, setNewGroupName] = useState(group.name);

    const hasDeviantInfo = newPinnedMessage !== group.pinnedMessage || newGroupName !== group.name

    async function updateGroup() {
        setLoading(true)

        try {
            const response = await api.patch(`/groups/${group.id}`, { userId: user.id, name: newGroupName, pinnedMessage: newPinnedMessage })
            if (response) {
                router.push(`/groups/${group.id}`)
            } else {
                setConfigModalVisible(false)
            }
            setLoading(false)
        } catch (error) {
            setExitModalVisible('error')
            setLoading(false)
        }
    }

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    async function deleteGroup() {
        setLoading(true)

        try {
            const response = await api.delete(`/groups/${group.id}`)
            if (response) {
                router.push(`/home`)
            } else {
                setConfigModalVisible(false)
            }
            setLoading(false)
        } catch (error) {
            setExitModalVisible('error')
            setLoading(false)
        }
    }

    const [userInteracted, setUserInteracted] = useState(false);

    async function toggleUserInteraction() {
        setLoading(true)

        try {
            const response = await api.patch(`/groups/${group.id}`, { updateInteraction: true })
            console.log(response.data, response.data.interaction)
            setUserInteracted(response.data.interaction)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        setUserInteracted(group.usersThatInteracted.find((groupUser, i) => groupUser.id === user.id) ? true : false)
    }, [])

    const { setUsersModalVisible, UsersModal } = UsersModalPreset({ users: group.usersThatInteracted })

    return (
        <main className={styles.holder}>
            <Head>
                <title>{group.name}</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Navigator directory={TranslateText("Groups")} />
                <div className={styles.header}>
                    <h1>{group.name} </h1>
                    <div className={styles.details}>
                        <h4><Translate>Details</Translate></h4>
                        <div className={styles.info}>
                            <span className={'material-symbols-rounded static'}>group</span>
                            <p>{group.users.length} <Translate>participant</Translate>{group.users.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className={styles.info}>
                            <span className={'material-symbols-rounded static'}>schedule</span>
                            <p><Translate>since</Translate> {formatDate(group.createdAt as number)}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.tasks}>
                        <div className={homeStyles.subheader}>
                            <SectionSelector sections={[{ name: TranslateText("Pending"), id: 0 }, { name: TranslateText("Archived"), id: 1 }]} actualSection={actualSection} setSection={setActualSection} />
                            {/* <Button
                                style={{ fontSize: "1.4rem", paddingInline: "1.15rem", paddingBlock: "1.15rem", backgroundColor: "var(--font-light)", cursor: "not-allowed" }}
                                icon={'filter_alt'}
                                disableHoverEffect
                                iconProps={{ size: "2.2rem" }}
                            /> */}
                        </div>
                        <div className={`${homeStyles.tasks}`}>
                            {
                                actualSection.id === 0 ?
                                    pendingTasks.length > 0 ?
                                        pendingTasks
                                        :
                                        <EmptyTasksMessage description={TranslateText("It looks like there are no pending tasks in this group for you :)")} />
                                    :
                                    concludedTasks.length > 0 || expiredTasks.length > 0 || expiredTasks.length > 0 || noDateTasks.length > 0 ?
                                        <>
                                            {concludedTasks.length > 0 && <h5><Translate>Concluded</Translate></h5>}
                                            {concludedTasks}
                                            {noDateTasks.length > 0 && <h5><Translate>No date</Translate></h5>}
                                            {noDateTasks}
                                            {expiredTasks.length > 0 && <h5><Translate>Expired</Translate></h5>}
                                            {expiredTasks}
                                            {expiredTasks.length > 0 && <h5><Translate>Archived</Translate></h5>}
                                            {archivedTasks}
                                        </>
                                        :
                                        <EmptyTasksMessage description={TranslateText("Looks like there aren't any tasks archived in this group around here :)")} />
                            }
                        </div>
                    </div>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarContent}>
                            <AddTaskButton width='100%' query={{ userId: user.id, groups: JSON.stringify(user.groups), selectedGroupId: group.id }} />
                            <div className={`${styles.pinnedMessageContainer} ${styles.sidebarContainer}`}>
                                <header>
                                    <span className={'material-icons-rounded static'}>push_pin</span>
                                    <Translate>Pinned message</Translate>
                                </header>
                                <p>{group.pinnedMessage && group.pinnedMessage.length > 0 ? group.pinnedMessage : "[nenhuma]"}</p>
                                <Button
                                    title={TranslateText("I'M AWARE")}
                                    onClick={toggleUserInteraction}
                                    icon={'check'}
                                    isSelected={userInteracted}
                                    isLoading={isLoading}
                                    iconProps={{ size: "1.8rem", color: "var(--primary-02)" }}
                                    preset={"fillHover"}
                                    style={{ width: "100%", padding: "0.5rem" }}
                                />
                                <UsersPortraits onClick={() => setUsersModalVisible(true)} maxLength={8} size={24} imagesUrls={group.usersThatInteracted.map((user, i) => user.image_url)} />
                            </div>
                            <div className={`${styles.tasksInfoContainer} ${styles.sidebarContainer}`}>
                                <div>
                                    <p><Translate>Pending tasks</Translate></p>
                                    <h6>{pendingTasks.length}</h6>
                                </div>
                                <Separator orientation='horizontal' />
                                <div>
                                    <p><Translate>Concluded tasks</Translate></p>
                                    <h6>{concludedTasks.length}</h6>
                                </div>
                            </div>
                            <div className={`${styles.sidebarContainer}`}>
                                <Button
                                    title={TranslateText("INVITE USERS")}
                                    onClick={() => setShareModalVisible(true)}
                                    icon={'share'}
                                    iconProps={{ size: "1.8rem" }}
                                    style={{ width: "100%", padding: "1rem 1.5rem", backgroundColor: "var(--primary-02)" }}
                                />
                                {
                                    user.groups.find((group, i) => group.id === group.id) &&
                                    <Button
                                        title={TranslateText("SETTINGS")}
                                        onClick={() => setConfigModalVisible(true)}
                                        icon={'tune'}
                                        iconProps={{ size: "1.8rem", color: "var(--font-light)" }}
                                        preset={"fillHover"}
                                        style={{ width: "100%", padding: "1rem 1.5rem" }}
                                    />
                                }
                                {
                                    user.groups.find((userGroup, i) => userGroup.id === group.id) ? false : true && <Button
                                        title={TranslateText("LEAVE GROUP")}
                                        onClick={() => setExitModalVisible('default')}
                                        icon={'exit_to_app'}
                                        iconProps={{ color: "var(--red-01)" }}
                                        preset={"fillHover"}
                                        style={{ width: "100%", padding: "0.5rem 1.5rem" }}
                                    />
                                }
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
                title={`${TranslateText("Invite link")}:`}
            >
                <p style={{ color: "var(--primary-02)" }}>
                    <Translate>Share it with other platform users so they can join the group and participate in your community!</Translate> <br />
                    <Translate>Tasks sent in a group will be visible to everyone in it!</Translate>
                </p>
                <div className={`${inputStyles.input} hoverLink`} style={{ overflow: "hidden" }} onClick={onLinkClick}>
                    <p ref={linkTextRef}>{url}</p>
                    <span className='material-symbols-rounded'>content_copy</span>
                </div>
            </Modal>
            <Modal
                isVisible={isExitModalVisible === 'default'}
                toggleVisibility={() => setExitModalVisible('')}
                icon={'exit_to_app'}
                color={`var(--primary-02)`}
                title={isExitModalVisible === 'default' ? TranslateText("Are you sure you want to leave the group?") : TranslateText("Oh. Looks like something went bad.")}
                actionProps={{
                    buttonText: TranslateText("LEAVE GROUP"),
                    disabled: isExitModalVisible !== 'default',
                    function: exitGroup
                }}
                suppressReturnButton={isExitModalVisible !== 'default'}
                isLoading={isLoading}
                description={isExitModalVisible === 'default' ? TranslateText("You will no longer be able to see the group's tasks or interact with other group members. You'll only can rejoin the groupif a member or administrator invites you again.") : TranslateText("Please try again later. If the problem persists, let us know :)")}
            >
            </Modal>
            <Modal
                isVisible={isConfigModalVisible}
                toggleVisibility={() => setConfigModalVisible(!isConfigModalVisible)}
                icon={'tune'}
                isLoading={isLoading}
                suppressReturnButton
                iconProps={{ position: "flex-start", builtWithTitle: true, size: "2.8rem" }}
                color={`var(--primary-02)`}
                actionProps={{
                    buttonText: TranslateText("SAVE"),
                    buttonIcon: 'save',
                    disabled: !hasDeviantInfo,
                    function: updateGroup
                }}
            >
                <Input label={TranslateText("Group name")} placeholder={group.name}
                    onChange={(event) => {
                        if (event.currentTarget.value.length === 0) {
                            setNewGroupName(group.name)
                        } else {
                            setNewGroupName(event.currentTarget.value)
                        }
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                    <InputLabel label={TranslateText("Pinned message")} />
                    <textarea
                        className={inputStyles.input}
                        style={{ height: "7.5rem" }}
                        maxLength={250}
                        defaultValue={group.pinnedMessage}
                        onChange={(event) => {
                            if (event.currentTarget.value.length === 0) {
                                setNewPinnedMessage(group.pinnedMessage)
                            } else {
                                setNewPinnedMessage(event.currentTarget.value)
                            }
                        }}
                    />
                </div>
                <InputLabel label={TranslateText("Participants")} />
                <div className={styles.membersContainer}>
                    {
                        group.users.map((user, index) => <li key={index} className={styles.groupMember}>
                            <div className={'iconHolder'} style={{ gap: "1rem" }}>
                                <Image src={user.image_url} alt={'User avatar'} width={22} height={22} style={{ borderRadius: "50%" }} />
                                <p style={{ width: "fit-content" }}>{`${user.firstName} ${user.lastName}`}</p>
                            </div>

                            {
                                !group.admins.find((admin, i) => admin.id === user.id) &&
                                <Button
                                    title={`${TranslateText("REMOVE")}  ${TranslateText("PARTICIPANT")}}`}
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
                            }
                        </li>)
                    }
                </div>
                <div className={'dangerZone'}>
                    <p><Translate>Danger Zone</Translate></p>
                    <Button
                        icon={"delete_forever"}
                        iconProps={{
                            filled: true,
                            size: "1.6rem"
                        }}
                        accentColor={'var(--red-02)'}
                        title={`${TranslateText("DELETE")} ${TranslateText("GROUP")}`}
                        style={{
                            width: "100%",
                            backgroundColor: "var(--red-01)",
                            padding: "1rem 2.5rem"
                        }}
                        isLoading={isLoading}
                        onClick={() => setDeleteModalVisible(true)}
                    />
                </div>
            </Modal>
            <Modal
                icon={'delete_forever'}
                isVisible={isDeleteModalVisible}
                toggleVisibility={() => setDeleteModalVisible(!isDeleteModalVisible)}
                isLoading={isLoading}
                color={"var(--red-01)"}
                title={TranslateText("Are you sure you want to delete this group?")}
                description={TranslateText("When deleting the group EVERYTHING will be lost: tasks, attachments and users.\nThere is no way to recover a group after it has been deleted.")}
                actionProps={{
                    buttonText: TranslateText("DELETE"),
                    function: deleteGroup
                }}
            />
            {UsersModal}
        </main>
    )
}

export default Group;