import React from "react";
import UsersPortraits from "../UsersPortraits";

import styles from "./task.module.css"

// Contexto
import { useAppContext } from "../../contexts/AppContext";
import Link from "next/link";
import { Task } from "../../types/Task";
import getSubjectInfo from "../../utils/getSubjectInfo";
import formatDate from "../../utils/formatDate";

// Data
export const isActivity = (type: string) => type === 'obligatory' || type === "elective";;
export const isTest = (type: string) => type === 'av1' || type === "av2" || type === "recuperation";
export const taskGroupType = (type: string) => { return [isActivity(type), isTest(type)] };

export const taskType = (type: string | undefined) => type === "obligatory" ? 'AV3' : type === "elective" ? 'Eletiva' : type === "av1" ? 'AV1' : type === 'av2' ? 'AV2' : "AV"
export const taskMode = (mode: string | undefined) => mode === "written" ? "Escrita" : mode === "typed" ? "Digitada" : mode === "both" ? "Escrito ou Digitado" : "Livre"
export const taskMaxScore = (score: number | undefined) => `${score}${score?.toString().length === 1 ? ",0" : ""} pontos`

export const perQuestion = (questionsAmount: number) => questionsAmount ? (10 / questionsAmount).toString().slice(0, 5) : 0

export const subjectsString = (subjects: number[]) => subjects.map((subjectId, index) => {
    const [name, icon] = getSubjectInfo(subjectId)
    if (name.length > 0) {
        if (index + 1 === subjects.length) {
            return "e " + name
        } else if (subjects.length !== 2) {
            return name + ", "
        } else {
            return name + " "
        }
    }
})

export const UsersPortraitsFromTask = ({ concludedUsersAmount, images, groupName, message }: { concludedUsersAmount: number, images: Array<string>, groupName: string, message: string }) => <div className={styles.usersHolder}>
    {
        concludedUsersAmount > 0 && <UsersPortraits imagesUrls={images} />
    }
    {
        concludedUsersAmount > 0 ?
            <p className={styles.usersAmount}>{`+ de ${concludedUsersAmount} membro de ${groupName ? groupName : "placeholder"} ${message}`}</p> :
            <p className={styles.usersAmount}>{`nenhum membro de `} <strong>{groupName}</strong> {` concluiu essa atividade ainda!`}</p>
    }
</div>;

// Types
interface TaskProps {
    task: Task;
    status: 'concluded' | 'expired' | 'pending'
}

export default function TaskView({ task, status }: TaskProps) {
    const { viewMode } = useAppContext();

    const description = task.description && task.description as string;

    const Content = () => description && description.length > 7 ?
        <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(task.description) as unknown as string }}
        />
        :
        <p>{`[nenhuma descrição fornecida]`}</p>

    // Ícones dos usuários e informação de usuários que concluíram
    const concludedUsersAmount = task.interactedBy ? task.interactedBy.length : 0;
    const images = task.interactedBy ? task.interactedBy.map((user, index) => user.image_url) : 0;

    const Status = ({ icon, text, color }: { icon: string, text: string, color: string }) => <div className={styles.deadline} style={{ color: color }}>
        <>
            <span className={`material-symbols-rounded`}>{icon}</span>
            {`${text} ${formatDate(task.date, true)}`}
        </>
    </div>

    const borderStyle = `1px ${status !== "pending" ? 'double' : 'solid'} ${status === 'concluded' ? 'var(--green-01)' : status === 'expired' ? 'var(--red-01)' : 'var(--primary-04)'}`;

    if (isActivity(task.type)) {
        const [name, icon] = getSubjectInfo(task.subjects[0])

        return <Link href={`/task/${task.id}`}>
            <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`} style={{ border: borderStyle }}>
                <div className={styles.column}>
                    <div className={styles.icon}>
                        <span className={`material-symbols-rounded`}>{icon} </span>
                    </div>
                    <div className={styles.description}>
                        <h4>{name}</h4>
                        <div className={styles.info}>
                            <>
                                {taskType(task.type)}
                                <div className={styles.circle} />
                                {taskMode(task.mode)}
                                <div className={styles.circle} />
                                {taskMaxScore(task.maxScore)}
                            </>
                        </div>
                        <Content />
                    </div>
                </div>
                <div className={`${styles.column} ${styles.two}`}>
                    {
                        task.group && <UsersPortraitsFromTask message={`já ${concludedUsersAmount !== 1 ? 'concluíram' : 'concluiu'} a atividade`} groupName={task.group.name} concludedUsersAmount={concludedUsersAmount} images={images as string[]} />
                    }
                    {
                        status === 'concluded' ? <Status icon="schedule" text="concluída no dia" color="var(--green-01)" /> :
                            status === "expired" ? <Status icon="schedule" text="expirou no dia" color="var(--red-01)" /> :
                                <Status icon="schedule" text="entrega até" color="var(--primary-02)" />
                    }
                </div>
            </div>
        </Link>
    } else if (isTest(task.type)) {
        return <Link href={`/task/${task.id}`}>
            <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}>
                <div className={styles.column}>
                    <div className={styles.icon}>
                        <span className={`material-symbols-rounded`}>glyphs</span>
                    </div>
                    <div className={styles.description}>
                        <h4>{task.type === "av1" ? "Avaliação Mensal (AV1)" : "Avaliação Bimestral (AV2)"}</h4>
                        <div className={styles.info}>
                            <>
                                {taskType(task.type)}
                                <div className={styles.circle} />
                                {task.questionsAmount + " questões"}
                                <div className={styles.circle} />
                                {perQuestion(task.questionsAmount as number) + " por questão"}
                            </>
                        </div>
                        <p>{subjectsString(task.subjects)}</p>
                    </div>
                </div>
                <div className={`${styles.column} ${styles.two}`}>
                    {
                        status === "expired" ? <Status icon="archive" text="arquivada no dia" color="var(--primary-02)" /> :
                            <Status icon="calendar_today" text="" color="var(--primary-02)" />
                    }
                </div>
            </div>
        </Link>
    } else {
        return <Link href={`/task/${task.id}`}>
            <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`} style={{ border: borderStyle }}>
                <div className={styles.column}>
                    <div className={styles.icon}>
                        <span className={`material-symbols-rounded`}>local_activity</span>
                    </div>
                    <div className={styles.description}>
                        <h4>{task.title}</h4>
                        <Content />
                        <div className={styles.info}>
                            <span style={{ fontSize: "1.6rem" }} className={`material-symbols-rounded`}>location_on</span>
                            <p>{task.address}</p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.column} ${styles.two}`}>
                    {task.group && <UsersPortraitsFromTask message={`já ${concludedUsersAmount !== 1 ? 'marcaram' : 'marcou'} presença`} groupName={task.group.name} concludedUsersAmount={concludedUsersAmount} images={images as string[]} />}
                    {
                        status === 'concluded' ? <Status icon="schedule" text="Concluído" color="var(--green-01)" /> :
                            status === "expired" ? <Status icon="schedule" text="evento no dia" color="var(--red-01)" /> :
                                <Status icon="schedule" text="evento no dia" color="var(--primary-02)" />
                    }
                </div>
            </div>
        </Link>
    }
}