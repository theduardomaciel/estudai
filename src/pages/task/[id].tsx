import React, { SetStateAction, useEffect, useMemo, useState } from 'react';

import Head from 'next/head';
import type { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import Image from 'next/image';
import { useRouter } from 'next/router';

// Stylesheets
import styles from "../../styles/Task.module.css"

// Components
import Sidebar from '../../components/Sidebar';
import Navigator from '../../components/Navigator';
import Button from '../../components/Button';
import UsersPortraits from '../../components/UsersPortraits';
import { Separator } from '../../components/Separator';
import SectionSelector from '../../components/SectionSelector';
import ErrorContainer from '../../components/ErrorContainer';
import { perQuestion, subjectsString, taskGroupType, taskMaxScore, taskMode, taskType } from '../../components/Task';

// Types
import { Task } from '../../types/Task';

// Services and Utilities
import getAllTasks from '../../services/getAllTasks';
import getTask from '../../services/getTask';
import formatDate from '../../utils/formatDate';

import { getTagInfo, tagsNames } from '../../utils/getTagInfo';
import getSubjectInfo from '../../utils/getSubjectInfo';

// Imports
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";
import ImgAttachment from "/public/icons/attachment/img.svg";

import placeholder from '/public/images/user_placeholder.jpg';

export const getStaticPaths = async () => {
    const tasksResponse = await getAllTasks() as unknown as Array<Task>;

    const tasks = tasksResponse.map((task) => ({ params: { id: task.id.toString() } }))

    return {
        paths: tasks,
        fallback: 'blocking', // can also be true or 'blocking'
    }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: GetStaticPropsContext) {

    const params = context.params as any;
    const id = params.id;

    let task = await getTask(parseInt(id)) as unknown as Task;

    const date = new Date(task.date);
    task.date = Math.floor(date.getTime());

    task.attachments?.map((attachment, index) => {
        const attachmentDate = new Date(attachment.createdAt as string);
        task.attachments[index].createdAt = Math.floor(attachmentDate.getTime()) as number;
        return task;
    })

    if (task.group) {
        task.group.createdAt = Math.floor(date.getTime());
    }

    return {
        // Passed to the page component as props
        props: { task, },
    }
}

interface SectionProps {
    tagsSectionId: number;
}

import fileStyles from "../../components/AttachmentLoader/File/styles.module.css"
import LinkAttachment from '../../components/AttachmentLoader/Link';
import { Attachment } from '../../types/Attachment';
import Modal from '../../components/Modal';

// Authentication
import { parseCookies } from 'nookies';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { group } from 'console';
import { EmptyTasksMessage } from '../home';

type TagComponentProps = React.LiHTMLAttributes<HTMLLIElement> & {
    attachment: Attachment;
    index: number;
}

const Task = ({ task }: { task: Task }) => {
    const router = useRouter();
    const { signOut } = useAuth();
    const { 'app.userId': userId } = parseCookies()

    const [isActivity, isTest] = taskGroupType(task.type);
    const titleType = isActivity ? "Atividade" : isTest ? "Avaliação" : "Evento"

    const [attachmentsInteracted, setAttachmentsInteracted] = useState<Array<boolean | string>>(['loading'])

    function Tag({ attachment, index, ...rest }: TagComponentProps) {
        const [isAttachmentLoading, setAttachmentLoading] = useState(attachmentsInteracted[0] === 'loading');
        const attachmentInteracted = attachmentsInteracted[index] === true;

        return <li key={index} className={fileStyles.attachment} style={{ maxWidth: "fit-content" }} {...rest} >
            <div className={fileStyles.header}>
                {
                    attachment.type == "application/pdf" ?
                        <PDFAttachment className={fileStyles.icon} />
                        :
                        attachment.type === 'image/jpeg' ?
                            <ImgAttachment className={fileStyles.icon} />
                            :
                            <DocAttachment className={fileStyles.icon} />
                }
                {/* {
                attachment.createdBy?.id === 123 &&
                <span className={`material-symbols-rounded ${fileStyles.close}`} onClick={removeAttachment}>
                    close
                </span>
            } */}
            </div>
            <p className={fileStyles.fileName}>{attachment.name}</p>
            <div className={styles.attachmentButtonsHolder}>
                <a href={attachment.viewLink} target={"_blank"} rel="noreferrer">
                    <Button
                        title='Visualizar'
                        icon={'visibility'}
                        iconProps={{ size: "1.6rem" }}
                        classes={styles.attachmentButton}
                    />
                </a>
                <a href={attachment.downloadLink} download>
                    <Button
                        title='Baixar'
                        icon={'file_download'}
                        iconProps={{ size: "1.6rem" }}
                        classes={styles.attachmentButton}
                    />
                </a>
            </div>
            <Button
                title={attachmentInteracted ? 'Desmarcar' : "Marcar como concluído"}
                icon={attachmentInteracted ? 'remove' : 'check'}
                iconProps={{ size: "1.6rem", color: "var(--primary-02)" }}
                classes={`${styles.attachmentButton} ${styles.use}`}
                isSelected={attachmentInteracted}
                style={{
                    width: "100%",
                    padding: "0.65rem 1.5rem",
                    fontWeight: 500
                }}
                preset={"fillHover"}
                isLoading={isAttachmentLoading || attachmentInteracted === null}
                onClick={() => toggleAttachmentInteraction(attachment.id, index, setAttachmentLoading)}
            />
        </li>
    }

    async function toggleAttachmentInteraction(attachmentId: string, attachmentIndex: number, setAttachmentLoading: (state: boolean) => SetStateAction<void>) {
        setAttachmentLoading(true)

        if (!userId) {
            await signOut();
        }

        try {
            const response = await api.patch(`/attachments/${attachmentId}`, { userId: userId })
            console.log(response)
            if (response.data.removed) {
                console.warn("Removeu a marcação.");
                let copy = [...attachmentsInteracted]
                copy[attachmentIndex] = false;
                setAttachmentsInteracted(copy)
            } else if (response.data.added) {
                console.warn("Adicionou a marcação.");
                let copy = [...attachmentsInteracted]
                copy[attachmentIndex] = true;
                setAttachmentsInteracted(copy)
            }
        } catch (error) {
            console.log(error)
        }

        setAttachmentLoading(false)
    }

    const tagsCount = (tagId: number) => task.attachments.filter((attachment, index) => attachment.tags.includes(tagId)).length;

    const attachmentsWithoutTag = task.attachments?.filter((attachment, index) => { return attachment.tags.length === 0 })
    const attachmentsWithoutTagList = attachmentsWithoutTag.map((attachment, index) => <Tag key={index} index={index} attachment={attachment} />)

    const attachmentsWithTag = task.attachments.filter((attachment, index) => { return attachment.tags.length > 0 })
    const attachmentsViewList = attachmentsWithTag.map((attachment, index) => <Tag key={index} index={index} attachment={attachment} />)

    const AttachmentsSection = ({ tagsSectionId }: SectionProps) => {
        const [name, icon] = getTagInfo(tagsSectionId)

        const attachmentsOfSection = attachmentsViewList.filter((attachment, index) => { return attachment.props.attachment.tags.includes(tagsSectionId) })

        return (
            <div className={styles.attachmentsSection}>
                <div className={styles.attachmentHeader}>
                    <span className={`material-symbols-rounded`}>{icon}</span>
                    <p>{name}</p>
                </div>
                <ul className={styles.attachmentsContainer}>
                    {attachmentsOfSection}
                </ul>
            </div>
        )
    }

    const [section, setSection] = useState('Anexos')

    const attachmentsContainer = <>
        <div className='header'>
            <SectionSelector sections={["Anexos", "Links"]} actualSection={section} setSection={setSection} />
            <div className={`row ${styles.headerButtons}`}>
                <Button icon={'filter_alt'} />
                <Button icon={section === "Anexos" ? 'attach_file' : 'link'} title={section === 'Anexos' ? 'Adicionar anexo' : 'Adicionar link'} />
            </div>
        </div>
        {
            section === "Anexos" ?
                attachmentsWithTag.length > 0 || attachmentsWithoutTag.length > 0 ?
                    <div className={styles.attachmentsParentHolder}>
                        {attachmentsWithoutTagList}
                        {
                            tagsNames.map((tagName, index) => {
                                const count = tagsCount(index)
                                return count > 0 && <AttachmentsSection key={index} tagsSectionId={index} />
                            })
                        }
                    </div>
                    :
                    <EmptyTasksMessage description='Essa atividade ainda não possui anexos.' />
                :
                task.links.length > 0 ?
                    task.links.map((link, index) => {
                        return <LinkAttachment key={index} link={link} index={index} />
                    })
                    :
                    <EmptyTasksMessage description='Essa atividade ainda não possui links.' />
        }
    </>

    const [hasInteracted, setInteracted] = useState<boolean | null>(null)

    useEffect(() => {
        // Carregamento da interação geral com a tarefa
        setInteracted(task.interactedBy.find((user, index) => {
            return user.id = parseInt(userId)
        }) ? true : false)

        // Carregamento da interação com um attachment
        const attachmentsThatUserHasInteracted = task.attachments.map((attachment, index) => attachment.markedBy.find(user => user.id === parseInt(userId)) ? true : false)
        setAttachmentsInteracted(attachmentsThatUserHasInteracted)
    }, [])

    const [isLoading, setLoading] = useState(false);

    async function toggleInteraction() {
        setLoading(true)

        if (!userId) {
            await signOut();
        }

        try {
            const response = await api.patch(`/tasks/${task.id}`, { userId: userId })

            if (response.data.removed) {
                console.warn("Removeu a interação");
                setInteracted(false)
            } else if (response.data.added) {
                console.warn("Adicionou a interação");
                setInteracted(true)
            }
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    function goToTaskGroup() {
        console.log(task.group, 'teste')
        if (task.group) {
            router.push(`/groups/${task.group.id}`)
        }
    }

    // Test Type
    const [isContentsModalVisible, setContentsModalVisible] = useState(false);
    const subjectsText = useMemo(() => subjectsString(task.subjects), [])

    // Activity and Event Type
    const [isUsersModalVisible, setUsersModalVisible] = useState(false);

    const usersModal = <Modal
        isVisible={isUsersModalVisible}
        toggleVisibility={() => setUsersModalVisible(!isUsersModalVisible)}
        icon={'check'}
        iconProps={{ position: "flex-start", builtWithTitle: true, size: "2.8rem" }}
        color={`var(--primary-02)`}
    >
        <div className={styles.usersContainer}>
            <header>
                <div className={'iconHolder'}>
                    <span className="material-symbols-rounded static">person</span>
                    <p>Usuário</p>
                </div>
                {/* <div className={'iconHolder'}>
                    <span className="material-symbols-rounded static">calendar_today</span>
                    <p>Data</p>
                </div> */}
            </header>
            {
                task.interactedBy.map((user, index) => <li key={index} className={styles.user}>
                    <div className={'iconHolder'} style={{ gap: "1rem" }}>
                        <Image src={user.image_url} alt={'User avatar'} width={22} height={22} style={{ borderRadius: "50%" }} />
                        <p style={{ width: "fit-content" }}>{`${user.firstName} ${user.lastName}`}</p>
                    </div>

                    {/* <p>---</p> */}
                </li>)
            }
        </div>
    </Modal>

    if (isActivity) {
        const [name, icon] = getSubjectInfo(task.subjects[0])
        const title = `${titleType} de ${name}`

        const description = task.description as string;
        const hasText = description.length > 7

        const daysToRed = 2 * 24 * 60 * 60 * 1000; // 2 dias e mili segundos
        const daysToExpire = task.date - new Date().getTime();

        return (
            <main className={styles.holder}>
                <Head>
                    <title>{title}</title>
                </Head>
                <Sidebar />
                <div className={styles.container}>
                    <div className='header'>
                        <Navigator directory={title} parentDirectory={task.group ? task.group.name : undefined} onClick={goToTaskGroup} />
                        {
                            task.interactedBy.length > 0 &&
                            <div className={styles.usersInfo}>
                                <UsersPortraits imagesUrls={task.interactedBy.map((user, i) => user.image_url)} />
                                <p>+ de <span onClick={() => setUsersModalVisible(true)}>{task.interactedBy.length} membro{task.interactedBy.length !== 1 ? "s" : ''}</span> já {task.interactedBy.length !== 1 ? 'concluíram' : 'concluiu'} a atividade</p>
                            </div>
                        }
                    </div>
                    <div className={styles.info}>
                        <div className={styles.column} style={{ justifyContent: "space-between" }}>
                            {
                                hasText ?
                                    <div dangerouslySetInnerHTML={{ __html: JSON.stringify(task.description) as unknown as string }}></div>
                                    :
                                    <p>{`[nenhuma descrição provida]`}</p>
                            }
                            <div className={styles.userInfo}>
                                <div className={styles.userIcon}>
                                    <Image
                                        src={task.createdBy.image_url || placeholder}
                                        width={14}
                                        height={14}
                                        alt={`Imagem de perfil do usuário que criou a atividade.`}
                                    />
                                </div>
                                <p>{hasText ? 'descrição' : 'atividade'} enviada por <span>{task.createdBy?.firstName}</span></p>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <Button
                                title={hasInteracted ? 'DESMARCAR COMO CONCLUÍDO' : 'MARCAR COMO CONCLUÍDO'}
                                icon={hasInteracted ? 'remove' : 'check'}
                                style={{ height: "3.25rem" }}
                                iconProps={{ size: "1.8rem", color: `var(--primary-02)` }}
                                classes={`${styles.defaultButton} ${styles.top}`}
                                isSelected={hasInteracted === true}
                                isLoading={isLoading || hasInteracted === null}
                                onClick={toggleInteraction}
                                preset={"fillHover"}
                            />
                            <div className={styles.taskInfo}>
                                <p>{taskType(task.type)}</p>
                                <Separator orientation='vertical' />
                                <p>{taskMode(task.mode)}</p>
                                <Separator orientation='vertical' />
                                <p>{taskMaxScore(task.maxScore)}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.deadline} style={{ backgroundColor: daysToExpire < daysToRed && daysToExpire > 0 ? 'var(--yellow-01)' : daysToExpire < 0 ? 'var(--red-01)' : 'var(--primary-02)' }}>
                        <p>
                            {
                                daysToExpire < -1 ?
                                    <><span className='bold'>EITA!</span> O prazo dessa atividade já expirou. Você tinha até o dia</>
                                    : <><span className='bold'>ATENÇÃO!</span> Você tem até o dia</>
                            }
                        </p>
                        <div>
                            <span className={`material-symbols-rounded static`}>calendar_today</span>
                            <span>{formatDate(task.date)}</span>
                        </div>
                        <p>para entregar essa atividade.</p>
                    </div>
                    {attachmentsContainer}
                </div>
                {usersModal}
            </main>
        )
    } else if (isTest) {
        const title = `Avaliação ${task.type === "av1" ? 'Mensal' : "Bimestral"} ${`(${task.type.toUpperCase()})`}`;

        return (
            <main className={styles.holder}>
                <Head>
                    <title>{title}</title>
                </Head>
                <Sidebar />
                <div className={styles.container}>
                    <div className='header'>
                        <Navigator directory={title} parentDirectory={task.group ? task.group.name : undefined} onClick={goToTaskGroup} />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.column} style={{ justifyContent: "space-between" }}>
                            <p><strong style={{ marginRight: "0.5rem" }}>{`Matérias: `} </strong> {subjectsText}</p>
                            <div className={styles.userInfo}>
                                <div className={styles.userIcon}>
                                    <Image
                                        src={task.createdBy?.image_url || placeholder}
                                        width={14}
                                        height={14}
                                        alt={`Imagem de perfil do usuário que criou a atividade.`}
                                    />
                                </div>
                                <p>conteúdo enviado por <span>{task.createdBy?.firstName}</span></p>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <Button
                                title='VER CONTEÚDOS'
                                icon={'apps'}
                                iconProps={{ size: "1.8rem", color: "var(--primary-02)" }}
                                classes={styles.defaultButton}
                                preset={"fillHover"}
                                onClick={() => setContentsModalVisible(true)}
                            />
                            <div className={styles.taskInfo}>
                                <p>{taskType(task.type)}</p>
                                <Separator orientation='vertical' />
                                <p>{task.questionsAmount + " questões"}</p>
                                <Separator orientation='vertical' />
                                <p>{perQuestion(task.questionsAmount as number) + " por questão"}</p>
                            </div>
                        </div>
                    </div>
                    {attachmentsContainer}
                </div>
                <Modal
                    icon={'apps'}
                    isVisible={isContentsModalVisible}
                    toggleVisibility={() => setContentsModalVisible(!isContentsModalVisible)}
                    color={"var(--primary-02)"}
                    iconProps={{ position: "flex-start", size: '3.2rem' }}
                >
                    <div className={styles.contentsHolder}>
                        {
                            task.contents?.map((contentString, subjectId) => {
                                if (contentString !== "") {
                                    const [name, icon] = getSubjectInfo(subjectId)
                                    return <div key={subjectId} className={styles.content}>
                                        <div className={styles.header}>
                                            <span className={'material-symbols-rounded static'}>{icon}</span>
                                            <p>{name}</p>
                                        </div>
                                        <p>{contentString}</p>
                                    </div>
                                }
                            })
                        }
                    </div>
                </Modal>
            </main>
        )
    } else if (task.title) {
        const description = task.description as string;
        const hasText = description.length > 7

        return (
            <main className={styles.holder}>
                <Head>
                    <title>{task.title}</title>
                </Head>
                <Sidebar />
                <div className={styles.container}>
                    <div className='header'>
                        <Navigator directory={task.title} parentDirectory={task.group ? task.group.name : undefined} onClick={goToTaskGroup} />
                        {
                            task.interactedBy.length > 0 &&
                            <div className={styles.usersInfo}>
                                <UsersPortraits imagesUrls={task.interactedBy.map((user, i) => user.image_url)} />
                                <p>+ de <span onClick={() => setUsersModalVisible(true)}>{task.interactedBy.length} membro{task.interactedBy.length !== 1 ? "s" : ''}</span> já {task.interactedBy.length !== 1 ? 'marcaram' : 'marcou'} presença</p>
                            </div>
                        }
                    </div>
                    <div className={styles.info}>
                        <div className={styles.column} style={{ justifyContent: "space-between" }}>
                            {
                                hasText ?
                                    <div dangerouslySetInnerHTML={{ __html: JSON.stringify(task.description) as unknown as string }}></div>
                                    :
                                    <p>{`[nenhuma descrição provida]`}</p>
                            }
                            <div className={styles.userInfo}>
                                <div className={styles.userIcon}>
                                    <Image
                                        src={task.createdBy?.image_url || placeholder}
                                        width={14}
                                        height={14}
                                        alt={`Imagem de perfil do usuário que criou a atividade.`}
                                    />
                                </div>
                                <p>evento indicado por <span>{task.createdBy?.firstName}</span></p>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <Button
                                title={hasInteracted ? 'REMOVER PRESENÇA' : 'CONFIRMAR PRESENÇA'}
                                icon={hasInteracted ? 'remove' : 'co_present'}
                                iconProps={{ size: "1.8rem", color: `var(--primary-02)` }}
                                classes={styles.defaultButton}
                                isLoading={isLoading || hasInteracted === null}
                                isSelected={hasInteracted === true}
                                onClick={toggleInteraction}
                                preset={'fillHover'}
                            />
                            <div className={`${styles.taskInfo} ${styles.vertical}`}>
                                <div className={styles.horizontalInfo}>
                                    <span className={`material-symbols-rounded`}>location_on</span>
                                    <p>{task.address}</p>
                                </div>
                                {/* <Separator orientation='horizontal' /> */}
                                <div className={styles.horizontalInfo}>
                                    <span className={`material-symbols-rounded`}>calendar_today</span>
                                    <p>{formatDate(task.date, true)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        title='ARQUIVAR'
                        icon={'archive'}
                        iconProps={{ size: "1.8rem", color: `var(--primary-02)` }}
                        preset={'fillHover'}
                        classes={styles.defaultButton}
                    />
                    {attachmentsContainer}
                </div>
                {usersModal}
            </main>
        )
    } else {
        return (
            <main className={styles.holder}>
                <Head>
                    <title>{task.title}</title>
                </Head>
                <Sidebar />
                <div className={styles.container}>
                    <ErrorContainer
                        title='Opa, parece que tivemos um erro interno :('
                        description='Por favor, nos envie uma mensagem por nosso Instagram para que a gente te ajude a resolver o problema.'
                    />
                </div>
            </main>
        )
    }
}

export default Task;