import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

// Stylesheets
import styles from '../../../styles/GroupInvite.module.css';

// Components
import Button from '../../../components/Button';

import Logo from "/public/logo.svg";

import { api } from '../../../lib/api';
import { Group } from '../../../types/Group';
import { User } from '../../../types/User';
import getUser from '../../../services/getUser';
import getGroup from '../../../services/getGroup';
import getUserIdByToken from '../../../services/getUserIdByToken';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import removeCookies from '../../../services/removeCookies';
import { parseCookies } from 'nookies';
import Link from 'next/link';

interface GroupInfo {
    id: number;
    name: string;
    usersAmount: number;
}

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

    const groupInviteLink = context.query.inviteLink as string;

    const group = await getGroup(undefined, groupInviteLink) as unknown as Group | null;
    let groupInfo = null;

    if (group) {
        groupInfo = {
            id: group.id,
            name: group.name,
            usersAmount: group.users.length
        }
    }

    let user = await getUser(userId as number, 'basic') as unknown as User;

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
        return group;
    })

    return {
        props: {
            groupInfo,
            user
        }
    }
}

const GroupInvite = ({ user, groupInfo }: { user: User, groupInfo: GroupInfo }) => {
    const router = useRouter();
    /* const { inviteLink } = router.query; */

    /* const [groupInfo, setGroupInfo] = useState<GroupInfo | null | 'error'>(null); */

    /* async function getGroup() {
        if (inviteLink) {
            console.log("Obtendo grupo com o link de convite fornecido...", inviteLink)
            try {
                const response = await api.get(`/groups/${inviteLink}`);
                const group = response.data as Group;
                console.log(group)
                setGroupInfo({
                    id: group.id,
                    name: group.name,
                    usersAmount: group.users.length
                })

                const userResponse = await api.get(`/users/${inviteLink}`);
            } catch (error) {
                console.log(error, 'Não foi possível obter o grupo com o link informado')
                setGroupInfo('error')
            }
        } else {
            setTimeout(() => {
                getGroup()
            }, 500);
        }
    } */

    /* useEffect(() => {
        setTimeout(() => {
            getGroup()
        }, 500);
    }, [inviteLink]) */

    const [isLoading, setLoading] = useState(false);
    const isInGroup = user.groups.find((group, i) => group.id === groupInfo.id) ? true : false;

    async function exitGroup() {
        setLoading(true)

        try {
            const response = await api.patch(`/groups/${groupInfo.id}`, { userId: user.id })
            console.log(response.data)
            router.push(`/groups`)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <main className={styles.holder}>
            <Head>
                <title>estudaí</title>
            </Head>
            <div className={styles.container}>
                <Logo width={120} height={60} fill={'var(--light)'} />
                <div className={`${styles.infoHolder} ${groupInfo === null || groupInfo === undefined ? styles.loading : ''}`}>
                    {
                        /* groupInfo === 'error' ?
                            <>
                                <p>Não foi possível encontrar um grupo com o link de convite fornecido :(</p>
                            </>
                            : */ /* groupInfo === null || groupInfo === undefined ?
<>
<div></div>
<div></div>
</> */
                        groupInfo === null || groupInfo === undefined ?
                            <>
                                <p>Não foi possível encontrar um grupo com o link de convite fornecido :(</p>
                            </>
                            :
                            isInGroup ?
                                <>
                                    <p>Você já faz parte do grupo</p>
                                    <h1>{groupInfo.name}!</h1>
                                    <Link href={`/groups`} style={{ width: "100%" }}>
                                        <Button
                                            title='Voltar ao início'
                                            style={{ width: "100%", height: "3.85rem" }}
                                        />
                                    </Link>
                                </>
                                :
                                <>
                                    {/* <span className={`${styles.mainIcon} material-symbols-rounded static`}>group</span> */}
                                    <p>Você foi convidado(a) a entrar em</p>
                                    <h1>{groupInfo.name}</h1>
                                    <div className={styles.iconHolder}>
                                        <span className='material-symbols-rounded instantFilled static'>person</span>
                                        <p>{`${groupInfo.usersAmount} membro${groupInfo.usersAmount !== 1 ? 's' : ''}`}</p>
                                    </div>
                                    <Button
                                        title='Aceitar convite'
                                        onClick={exitGroup}
                                        isLoading={isLoading}
                                        style={{ width: "100%", height: "3.85rem" }}
                                    />
                                </>
                    }
                </div>
            </div>
        </main>
    )
}

export default GroupInvite;