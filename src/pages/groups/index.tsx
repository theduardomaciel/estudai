import { useRef, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { parseCookies } from 'nookies';

// Components
import Sidebar from '../../components/Sidebar';
import Profile from '../../components/Profile';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input, { InputLabel } from '../../components/Input';
import { Switch, SwitchThumb } from '../../components/Switch';

// Server Props
import getUser from '../../services/getUserByToken';
import getUserIdByToken from '../../services/getUserIdByToken';
import removeCookies from '../../services/removeCookies';
import { api } from '../../lib/api';

// Stylesheets
import styles from '../../styles/Groups.module.css';
import inputStyles from "../../components/Input/label.module.css";

// Types
import { Group } from '../../types/Group';
import { User } from '../../types/User';

// Icons
import PlaneIcon from '/public/landing/paper_plane.svg';
import Link from 'next/link';
import UsersPortraits from '../../components/UsersPortraits';
import Menu from '../../components/Menu';
import { EmptyTasksMessage } from '../home';
import Translate, { TranslateText } from '../../components/Translate';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['estudai.token']: token } = parseCookies(context)

    let user = await getUser(token, 'full', "full") as unknown as User;

    user.tasks.map((task, index) => {
        const date = new Date(task.date);
        task.date = Math.floor(date.getTime());
        if (task.group) {
            task.group.createdAt = Math.floor(task.group.createdAt as number);
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
            user
        }
    }
}

const Groups = ({ user }: { user: User }) => {
    const router = useRouter();

    const [isCreateGroupModalVisible, setCreateGroupModalVisible] = useState('');
    const [isLoading, setLoading] = useState(false);

    const isGroupPrivate = useRef(true);
    const groupName = useRef("");

    const createdGroup = useRef<Group>();

    async function createGroup() {
        console.log(groupName)
        setLoading(true)

        if (groupName.current.length < 3) {
            setLoading(false)
            return;
        };

        try {
            const response = await api.post('/groups/new', { userId: user.id, name: groupName.current, isPrivate: isGroupPrivate })
            console.log(response.data)

            createdGroup.current = response.data;
            setCreateGroupModalVisible('success')

            setLoading(false)
        } catch (error) {
            console.log(error)

            setCreateGroupModalVisible('error')
            setLoading(false)
        }
    }

    const link = `https://estudai.vercel.app/groups/${createdGroup.current?.shareLink}`;
    const linkTextRef = useRef<HTMLParagraphElement>(null);

    function onLinkClick() {
        navigator.clipboard.writeText(link)
        if (linkTextRef.current) {
            linkTextRef.current.textContent = TranslateText("Copied to clipboard!")
            setTimeout(() => {
                if (linkTextRef.current) {
                    linkTextRef.current.textContent = link
                }
            }, 1000);
        }
    }

    return (
        <main>
            <Head>
                <title>{TranslateText("Groups")}</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile user={user} />
                <div className={"header"}>
                    <h3 className={"title"}><Translate>My Groups</Translate></h3>
                    <Button
                        classes={styles.addButton}
                        style={{ backgroundColor: "var(--primary-02)", padding: "1rem 2.5rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)" }}
                        icon={"group_add"}
                        title={TranslateText("Create a group")}
                        onClick={() => setCreateGroupModalVisible('default')}
                    />
                </div>
                <div className={styles.content}>
                    {
                        user.groups.length > 0 ?
                            user.groups.map((group, index) => {
                                const pendingTasks = group.tasks.filter((task, i) => task.interactedBy.find((taskUser, i) => taskUser.id === user.id) ? false : true && task.date > new Date().getTime()).length;

                                return <Link key={index} href={`/groups/${group.id}`}>
                                    <div className={styles.groupCard}>
                                        <header>
                                            <h3>{group.name}</h3>
                                            <div className={styles.iconContainer}>
                                                <span className={'material-symbols-rounded static'}>notifications_active</span>
                                                <p>{pendingTasks} {pendingTasks === 1 ? TranslateText("pending activity") : TranslateText("pending activities")}</p>
                                            </div>
                                        </header>
                                        <p>{group.pinnedMessage && group.pinnedMessage.length > 0 ? group.pinnedMessage : `[${TranslateText("no pinned message")}]`}</p>
                                        <div className={styles.usersInfoContainer}>
                                            <UsersPortraits imagesUrls={group.users.map((user, i) => user.image_url)} />
                                            <div className={styles.iconContainer}>
                                                <span className={'material-symbols-rounded static'}>person</span>
                                                <p>{group.users.length} <Translate>participant</Translate>{group.users.length !== 1 && "s"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            })
                            :
                            <EmptyTasksMessage description={TranslateText("To join a group, access an invite link that has been sent to you.")} />
                    }
                </div>
            </div>
            <Modal
                isVisible={isCreateGroupModalVisible !== ''}
                toggleVisibility={() => setCreateGroupModalVisible('')}
                icon={isCreateGroupModalVisible === 'default' ? "add_box" :
                    isCreateGroupModalVisible === 'success' ? "add_task" :
                        "remove"
                }
                iconProps={{ position: "flex-start", builtWithTitle: true, size: "3.8rem" }}
                color={`var(--primary-02)`}
                isLoading={isLoading}
                actionProps={{
                    buttonText: isCreateGroupModalVisible === 'default' ? TranslateText("Create group") : TranslateText("Join the group"),
                    function: isCreateGroupModalVisible === "default" ?
                        () => createGroup() :
                        isCreateGroupModalVisible === "success" ?
                            () => router.push(`/groups/${createdGroup.current?.id}`) :
                            undefined

                }}
                style={{ color: "var(--primary-02)", fontFamily: "Inter", fontWeight: 500 }}
                suppressReturnButton={isCreateGroupModalVisible === 'success'}
                title={isCreateGroupModalVisible === 'default' ? TranslateText("Create group") :
                    isCreateGroupModalVisible === 'success' ? TranslateText("Yay! Everything worked.") :
                        TranslateText("Oh. Looks like something went bad.")
                }
            >
                {
                    isCreateGroupModalVisible === "default" ?
                        <>
                            <Input
                                label={TranslateText("Group name")}
                                placeholder={TranslateText("Insert the group name")}
                                maxLength={30}
                                type="text"
                                onChange={(event) => groupName.current = event.currentTarget.value}
                            />
                            <div className={styles.toggleContainer}>
                                <InputLabel label={`${TranslateText("Private group")}?`} />
                                <Switch defaultChecked onCheckedChange={(checked: boolean) => isGroupPrivate.current = checked}>
                                    <SwitchThumb />
                                </Switch>
                            </div>
                        </>
                        : isCreateGroupModalVisible === "success" ?
                            <>
                                <p><Translate>Access your newly created group now and share the access link with others!</Translate></p>
                                <div className={`${inputStyles.input} hoverLink`} onClick={onLinkClick}>
                                    <p ref={linkTextRef}>{`https://estudai.vercel.app/groups/${createdGroup.current?.shareLink}`}</p>
                                    <span className='material-symbols-rounded'>content_copy</span>
                                </div>
                            </>
                            :
                            <p><Translate>We had an internal issue and were unable to create your group. Please try again and contact us if the problem persists.</Translate></p>
                }
            </Modal>
            <Menu />
        </main>
    )
}

export default Groups;
