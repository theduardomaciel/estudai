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
import getUser from '../../services/getUser';
import getUserIdByToken from '../../services/getUserIdByToken';
import removeCookies from '../../services/removeCookies';
import { api } from '../../lib/api';

// Stylesheets
import styles from '../../styles/Groups.module.css';
import inputStyles from "../../components/Input/label.module.css";

// Types
import { Group } from '../../types/Group';
import { User } from '../../types/User';

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

    let user = await getUser(userId as number) as unknown as User;

    user.tasks.map((task, index) => {
        const date = new Date(task.date);
        task.date = Math.floor(date.getTime());
        return task;
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
            linkTextRef.current.textContent = "Copiado para a área de transferência!"
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
                <title>Grupos</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Profile user={user} />
                <div className={"header"}>
                    <h3 className={"title"}>Meus Grupos</h3>
                    <Button
                        classes={styles.addButton}
                        style={{ backgroundColor: "var(--primary-02)", padding: "0.75rem 2.5rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)" }}
                        icon={"group_add"}
                        title='Criar um grupo'
                        onClick={() => setCreateGroupModalVisible('default')}
                    />
                </div>
            </div>
            <Modal
                isVisible={isCreateGroupModalVisible !== ''}
                toggleVisibility={() => setCreateGroupModalVisible('')}
                icon={isCreateGroupModalVisible === 'default' ? "add_box" :
                    isCreateGroupModalVisible === 'success' ? "priority" :
                        "remove"
                }
                iconProps={{ position: "flex-start", builtWithTitle: true, size: "3.8rem" }}
                color={`var(--primary-02)`}
                isLoading={isLoading}
                buttonText={isCreateGroupModalVisible === 'default' ? 'Criar grupo' : "Entrar no grupo"}
                actionFunction={isCreateGroupModalVisible === "default" ?
                    () => createGroup() :
                    isCreateGroupModalVisible === "success" ?
                        () => router.push(`/groups/${createdGroup.current?.id}`) :
                        undefined
                }
                suppressReturnButton={isCreateGroupModalVisible === 'success'}
                title={isCreateGroupModalVisible === 'default' ? "Criar grupo" :
                    isCreateGroupModalVisible === 'success' ? 'Eba! Deu tudo certo.' :
                        "Eita. Parece que deu ruim."
                }
            >
                {
                    isCreateGroupModalVisible === "default" ?
                        <>
                            <Input
                                label='Nome do Grupo'
                                placeholder='Insira o nome do grupo'
                                onChange={(event) => groupName.current = event.currentTarget.value}
                            />
                            <div className={styles.toggleContainer}>
                                <InputLabel label='Grupo privado?' />
                                <Switch defaultChecked onCheckedChange={(checked: boolean) => isGroupPrivate.current = checked}>
                                    <SwitchThumb />
                                </Switch>
                            </div>
                        </>
                        : isCreateGroupModalVisible === "success" ?
                            <>
                                <p>Acesse agora seu grupo recém-criado e compartilhe o link de acesso com outros!</p>
                                <div className={`${inputStyles.input} ${styles.hoverLink}`} onClick={onLinkClick}>
                                    <p ref={linkTextRef}>{`https://estudai.vercel.app/groups/${createdGroup.current?.shareLink}`}</p>
                                    <span className='material-symbols-rounded'>content_copy</span>
                                </div>
                            </>
                            :
                            <p>Tivemos um problema interno e não foi possível criar seu grupo. Pedimos a você que tente novamente e entre em contato conosco caso o problema persista.</p>
                }
            </Modal>
        </main>
    )
}

export default Groups;
