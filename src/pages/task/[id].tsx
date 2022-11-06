import React, { SetStateAction, useEffect, useMemo, useRef, useState, Dispatch } from 'react';

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
import Spinner from '../../components/Spinner';
import EditTaskModalPreset from '../../components/Modal/Presets/EditTaskModal';
import UsersModalPreset from '../../components/Modal/Presets/UsersModal';
import AttachmentsLoader from '../../components/AttachmentLoader';

// Types
import { Task } from '../../types/Task';

// Services and Utilities
import getAllTasks from '../../services/getAllTasks';
import getTask from '../../services/getTask';
import formatDate from '../../utils/formatDate';
import { perQuestion, subjectsString, taskGroupType, taskMaxScore, taskMode, taskType } from "../../components/Task";

import { getTagInfo, tagsNames } from '../../utils/getTagInfo';

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

    if (!task) {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            },
        }
    }

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
        props: { task },
    }
}

interface SectionProps {
    tagsSectionId: number;
}

import fileStyles from "../../components/AttachmentLoader/File/styles.module.css"
import LinkAttachment from '../../components/AttachmentLoader/Link';
import { Attachment } from '../../types/Attachment';
import Modal from '../../components/Modal';
import { EmptyTasksMessage } from '../home';

// Authentication
import { parseCookies } from 'nookies';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Subject } from '../../types/Subject';

type TagComponentProps = React.LiHTMLAttributes<HTMLLIElement> & {
    attachment: Attachment;
    index: number;
}

const Task = ({ task }: { task: Task }) => {
    const router = useRouter();
    const { signOut } = useAuth();
    const { 'app.userId': userId } = parseCookies()

    const [permissionLevel, setPermissionLevel] = useState<"user" | "creator" | "noPermission" | null>("user")

    const [isActivity, isTest] = taskGroupType(task.type);
    const { setUsersModalVisible, UsersModal, setUsersModalProps } = UsersModalPreset({ users: task.interactedBy });

    const [attachments, setAttachments] = useState(task.attachments);
    const [links, setLinks] = useState<Array<string>>(task.links);

    async function removeAttachment(attachment: Attachment, attachmentIndex: number, setAttachmentLoading: Dispatch<SetStateAction<boolean>>) {
        setAttachmentLoading(true)
        const deleteResponse = await api.delete(`/attachments/${attachment.id}`)

        try {
            if (deleteResponse.status === 200) {
                let array = [...attachments];
                array.splice(attachmentIndex, 1);
                setAttachments(array)
                console.log(`Anexo ${attachmentIndex} removido com sucesso.`)
            } else {
                console.log("Não foi possível remover o anexo")
            }
            setAttachmentLoading(false)
        } catch (error) {
            console.log(error)
            setAttachmentLoading(false)
        }
    }

    const [attachmentsInteracted, setAttachmentsInteracted] = useState<Array<boolean | string>>(['loading'])

    function Tag({ attachment, index, ...rest }: TagComponentProps) {
        const [isAttachmentLoading, setAttachmentLoading] = useState(attachmentsInteracted[0] === 'loading');
        const attachmentInteracted = attachmentsInteracted[index] === true;

        const [isAttachmentOwner, setIsAttachmentOwner] = useState(false);

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

        useEffect(() => {
            if (attachment.uploadedBy && permissionLevel && attachment.uploadedBy.id === parseInt(userId)) {
                setIsAttachmentOwner(true)
            }
        }, [])

        return <li key={index} className={`${fileStyles.attachment} ${styles.file}`} {...rest} >
            <div className={fileStyles.header}>
                {
                    attachment.type == "application/pdf" ?
                        <PDFAttachment className={fileStyles.icon} />
                        :
                        attachment.type === 'image/jpeg' || attachment.type === "image/png" ?
                            <ImgAttachment className={fileStyles.icon} />
                            :
                            <DocAttachment className={fileStyles.icon} />
                }
                <div style={{ display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
                    <span
                        className={`material-symbols-rounded ${fileStyles.close}`}
                        onClick={() => {
                            setUsersModalProps({ users: [attachment.uploadedBy], icon: 'add_to_drive', name: 'enviado por', dates: [attachment.createdAt as string] })
                            setUsersModalVisible(true)
                        }}
                        style={{ fontSize: "1.8rem" }}
                    >
                        info
                    </span>
                    {
                        isAttachmentOwner ?
                            isAttachmentLoading ?
                                <Spinner color='var(--primary-02)' size={1.5} />
                                :
                                <span className={`material-symbols-rounded ${fileStyles.close}`} onClick={() => removeAttachment(attachment, index, setAttachmentLoading)} style={{ fontSize: "2rem" }}>
                                    close
                                </span>
                            :
                            <></>
                    }
                </div>
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
            <div className={'iconHolder'} style={{ fontSize: "1.4rem", color: "var(--primary-02)", fontWeight: 600, fontFamily: "Inter" }}>
                <span style={{ fontSize: "1.6rem" }} className="material-symbols-rounded static">check_circle</span>
                {
                    attachment.interactedBy && <p style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setUsersModalProps({ users: attachment.interactedBy })}>{attachment.interactedBy.length}</p>
                }
            </div>
        </li>
    }

    const tagsCount = (tagId: number) => attachments.filter((attachment, index) => attachment.tags.includes(tagId)).length;

    const attachmentsWithoutTagList = attachments
        .filter((attachment) => { return attachment.tags.length === 0 })
        .map((attachment, index) => <Tag key={index} index={index} attachment={attachment} />)

    const attachmentsWithTagList = attachments
        .filter((attachment) => { return attachment.tags.length > 0 })
        .map((attachment, index) => <Tag key={index} index={index} attachment={attachment} />)

    const AttachmentsSection = ({ tagsSectionId }: SectionProps) => {
        const [name, icon] = getTagInfo(tagsSectionId)

        const attachmentsOfSection = attachmentsWithTagList.filter((attachment, index) => { return attachment.props.attachment.tags.includes(tagsSectionId) })

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
    const [hasInteracted, setInteracted] = useState<boolean | null>(null)

    const AttachmentsContainer = <>
        <div className='header'>
            <SectionSelector sections={["Anexos", "Links"]} actualSection={section} setSection={setSection} />
            <div className={`row ${styles.headerButtons}`}>
                <Button icon={'filter_alt'} />
                {
                    permissionLevel &&
                    <Button
                        icon={section === "Anexos" ? 'attach_file' : 'link'}
                        title={section === "Anexos" ? "Adicionar anexo" : "Adicionar link"}
                        onClick={() => setAddAttachmentModalVisible(true)}
                    />
                }
            </div>
        </div>
        {
            section === "Anexos" ?
                attachmentsWithTagList.length > 0 || attachmentsWithoutTagList.length > 0 ?
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
                links.length > 0 ?
                    links.map((link, index) => {
                        return <LinkAttachment key={index} link={link} index={index} />
                    })
                    :
                    <EmptyTasksMessage description='Essa atividade ainda não possui links.' />
        }
    </>

    const [isLoading, setLoading] = useState(false);

    // Set Subjects Modal
    const [isContentsModalVisible, setContentsModalVisible] = useState(false);
    const subjectsText = useMemo(() => subjectsString(task.subjects), [])

    const [subjects, setSubjects] = useState<Subject[] | undefined>(undefined);
    const contents = task.contents ? new Map(Object.entries(JSON.parse(task.contents))) : undefined;

    const ContentsView = contents && Array.from(contents).map(([subjectId, content], index) => {
        const subject = subjects?.find((subject, i) => subject.id === subjectId)
        return <div key={index} className={styles.content}>
            <div className={styles.header}>
                <span className={'material-symbols-rounded static'}>{subject?.icon}</span>
                <p>{subject?.name}</p>
            </div>
            <p>{content as string}</p>
        </div>
    })

    const Column2 = isActivity ? <>
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
    </> : isTest ?
        <>
            <Button
                title='VER CONTEÚDOS'
                icon={'apps'}
                iconProps={{ size: "1.8rem", color: "var(--primary-02)" }}
                classes={styles.defaultButton}
                preset={"fillHover"}
                onClick={() => setContentsModalVisible(true)}
            />
            <div className={styles.taskInfo}>
                <div className={'iconHolder'} >
                    <span className="material-symbols-rounded static" style={{ color: "var(--primary-02)", fontSize: "1.6rem" }}>calendar_today</span>
                    <p>{formatDate(task.date)}</p>
                </div>
                <Separator orientation='vertical' />
                <p>{task.questionsAmount + " questões"}</p>
                <Separator orientation='vertical' />
                <p>{perQuestion(task.questionsAmount as number) + " por questão"}</p>
            </div>
            <Modal
                icon={'apps'}
                isVisible={isContentsModalVisible}
                toggleVisibility={() => setContentsModalVisible(!isContentsModalVisible)}
                color={"var(--primary-02)"}
                suppressReturnButton
                iconProps={{ position: "flex-start", size: '3.2rem' }}
            >
                <div className={styles.contentsHolder}>
                    {ContentsView}
                </div>
            </Modal>
        </>
        :
        <>
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
                <div className={styles.horizontalInfo}>
                    <span className={`material-symbols-rounded`}>calendar_today</span>
                    <p>{formatDate(task.date, true)}</p>
                </div>
            </div>
        </>

    // Edit Task Modal
    const { EditTaskModal, setEditTaskModalVisible } = EditTaskModalPreset(task);

    const UserInfo = ({ text, name }: { text: string, name: string }) => permissionLevel === "creator" ?
        <span
            style={{ color: "var(--font-light)", fontSize: "1.6rem" }}
            className="material-symbols-rounded static click"
            onClick={() => setEditTaskModalVisible(true)}
        >
            more_horiz
        </span>
        :
        <div className={styles.userInfo}>
            <div className={styles.userIcon}>
                <Image
                    src={task.createdBy.image_url || placeholder}
                    width={14}
                    height={14}
                    alt={`Imagem de perfil do usuário que criou a atividade.`}
                />
            </div>
            <p>{text}<span>{name}</span></p>
        </div>

    /* ATTACHMENT UPLOAD -------------------------------------------------- */

    const [isAddAttachmentModalVisible, setAddAttachmentModalVisible] = useState(false);
    const [newAttachments, setNewAttachments] = useState<Array<Attachment>>([]);
    const [newLinks, setNewLinks] = useState<Array<string>>([]);

    async function uploadAttachments() {
        setLoading(true)
        try {
            const response = await api.patch(`/tasks/${task.id}`, { userId: parseInt(userId), existingTaskId: task.id, attachments: newAttachments, links: newLinks })
            console.log(response.data)
            setAttachments(attachments.concat(newAttachments))
            setLinks(links.concat(newLinks))
            setNewAttachments([])
            setNewLinks([])
        } catch (error) {
            console.log(error)
        }
        setNewAttachments([])
        setAddAttachmentModalVisible(false);
        setLoading(false)
    }

    const hasUploadedAtLeastOne = newAttachments.find((attachment, i) => attachment.downloadLink !== "") ? true : false;

    const AddAttachmentModal = <Modal
        isVisible={isAddAttachmentModalVisible}
        color={`var(--primary-02)`}
        icon={'add'}
        iconProps={{ builtWithTitle: true, size: "2.8rem", position: "center" }}
        toggleVisibility={() => {
            setNewAttachments([])
            setAddAttachmentModalVisible(!isAddAttachmentModalVisible)
        }}
        isLoading={isLoading}
        title={"Adicione novos anexos ou links abaixo:"}
        actionProps={{
            buttonText: "ENVIAR",
            buttonIcon: "file_upload",
            disabled: !hasUploadedAtLeastOne && newLinks.length === 0,
            function: uploadAttachments
        }}
    >
        <AttachmentsLoader
            attachments={newAttachments}
            setAttachments={setNewAttachments}
            links={newLinks}
            setLinks={setNewLinks}
        />
    </Modal>

    /* GENERAL FUNCTIONS ------------------------------------------------------ */
    function goToTaskGroup() {
        if (task.group) {
            router.push(`/groups/${task.group.id}`)
        }
    }

    async function toggleInteraction() {
        setLoading(true)
        if (!userId) await signOut();

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

    useEffect(() => {
        // Carregamento da interação geral com a tarefa
        setInteracted(task.interactedBy.find((user, index) => {
            return user.id = parseInt(userId)
        }) ? true : false)

        // Determinamos se o usuário está logado
        const hasPermission = task.group ? task.group.private && task.group.users.find((user, i) => user.id === parseInt(userId)) : true;
        const isCreator = task.createdBy.id === parseInt(userId);
        const isLogged = userId ? true : false;
        setPermissionLevel(
            hasPermission && isLogged && isCreator ? "creator" :
                hasPermission && isLogged && !isCreator ? "user" :
                    !hasPermission && isLogged ? "noPermission" :
                        null
        )

        async function getSubjects() {
            const response = await api.get(`/subjects/true`)
            if (response.status === 200) {
                console.log("Matérias obtidas com sucesso.")
                setSubjects(response.data.defaultSubjects.concat(response.data.userSubjects))
            }
        }
        getSubjects()

        // Carregamento da interação com um attachment
        const attachmentsThatUserHasInteracted = attachments.map((attachment, index) => attachment.interactedBy.find(user => user.id === parseInt(userId)) ? true : false)
        setAttachmentsInteracted(attachmentsThatUserHasInteracted)
    }, [])

    /* GENERAL PROPS ------------------------------------------------------ */
    const title = isActivity ? (task.subjects.length > 0 ? `Atividade de ${task.subjects[0].name}` : "Tarefa genérica") : isTest ? `Avaliação ${task.type === "av1" ? 'Mensal' : "Bimestral"} ${`(${task.type.toUpperCase()})`}` : task.title ? task.title : "Tarefa"

    const closeToDeadline = 2 * 24 * 60 * 60 * 1000; // 2 dias em mili-segundos
    const daysToExpire = task.date - new Date().getTime();

    if (task.group && task.group.private && permissionLevel === "noPermission") {
        return <main className={styles.holder}>
            <Head>
                <title>Opa!</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <div className='header'>
                    <Navigator suppressBackButton={true} directory={'Acesso Negado'} parentDirectory={task.group ? task.group.name : undefined} onClick={goToTaskGroup} />
                </div>
                <ErrorContainer
                    title='Desculpe, você não possui acesso a essa atividade.'
                    description='Se você acha que isso é um engano, por favor, entre em contato com quem a criou.'
                />
            </div>
        </main>
    } else {
        return (
            <main className={`${styles.holder} ${!permissionLevel ? styles.unauthenticated : ""}`}>
                <Head>
                    <title>{title}</title>
                </Head>
                <Sidebar notAuthenticated={!permissionLevel} />
                <div className={styles.container}>
                    <div className='header'>
                        <Navigator suppressBackButton={!permissionLevel} directory={title} parentDirectory={task.group ? task.group.name : undefined} onClick={goToTaskGroup} />
                        {
                            task.interactedBy.length > 0 &&
                            <div className={styles.usersInfo}>
                                <UsersPortraits imagesUrls={task.interactedBy.map((user, i) => user.image_url)} />
                                <p>+ de <span onClick={() => setUsersModalProps({ users: task.interactedBy })}>{task.interactedBy.length} membro{task.interactedBy.length !== 1 ? "s" : ''}</span> já {task.interactedBy.length !== 1 ? 'concluíram' : 'concluiu'} a atividade</p>
                            </div>
                        }
                    </div>
                    <div className={styles.info}>
                        <div className={styles.column} style={{ justifyContent: "space-between" }}>
                            {
                                isTest || isActivity ?
                                    task.description ?
                                        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(task.description) as unknown as string }}></div>
                                        :
                                        <p>{`[nenhuma descrição provida]`}</p>
                                    :
                                    <p><strong style={{ marginRight: "0.5rem" }}>{`Matérias: `} </strong> {subjectsText}</p>
                            }
                            <UserInfo text={`${isActivity ? 'atividade' : 'descrição'} enviada por `} name={task.createdBy.firstName} />
                        </div>
                        <div className={styles.column}>
                            {Column2}
                        </div>
                    </div>
                    {
                        permissionLevel && isActivity && task.date ?
                            <div className={styles.deadline} style={{ backgroundColor: daysToExpire < closeToDeadline && daysToExpire > 0 ? 'var(--yellow-01)' : daysToExpire < 0 ? 'var(--red-01)' : 'var(--primary-02)' }}>
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
                            : <></>
                    }
                    {AttachmentsContainer}
                </div>
                {UsersModal}
                {EditTaskModal}
                {AddAttachmentModal}
            </main>
        )
    }
}

export default Task;