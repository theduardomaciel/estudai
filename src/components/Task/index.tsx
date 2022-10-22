import React from "react";
import UsersPortraits from "../UsersPortraits";

import styles from "./task.module.css"

// Contexto
import { useAppContext } from "../../contexts/AppContext";
import Link from "next/link";
import { Task } from "../../types/Task";
import getSubjectInfo from "../../utils/getSubjectInfo";
import formatDate from "../../utils/formatDate";

interface TaskProps {
    task: Task;
}

export const isActivity = (type: string) => type === 'obligatory' || type === "elective";;
export const isTest = (type: string) => type === 'av1' || type === "av2" || type === "recuperation";
export const taskGroupType = (type: string) => { return [isActivity(type), isTest(type)] };

export const taskType = (type: string | undefined) => type === "obligatory" ? 'AV3' : 'Eletiva'
export const taskMode = (mode: string | undefined) => mode === "written" ? "Escrita" : mode === "typed" ? "Digitada" : mode === "both" ? "Escrito ou Digitado" : "Livre"
export const taskMaxScore = (score: number | undefined) => `${score}${score?.toString().length === 1 ? ",0" : ""} pontos`

export const perQuestion = (questionsAmount: number) => questionsAmount ? (10 / questionsAmount).toString().slice(0, 5) : 0

export const subjectsString = (subjects: number[]) => subjects.map((subjectId, index) => {
    const [name, icon] = getSubjectInfo(subjectId)
    if (name.length > 0) {
        if (index + 1 === subjects.length) {
            console.log("Adicionando e")
            return "e " + name
        } else if (subjects.length !== 2) {
            console.log("Adicionando com vírgula")
            return name + ", "
        } else {
            console.log("Adicionando sem nada")
            return name + " "
        }
    }
})

export const UsersPortraitsFromTask = ({ concludedUsersAmount, images, groupName }: { concludedUsersAmount: number, images: Array<string>, groupName?: string }) => <div className={styles.usersHolder}>
    <UsersPortraits imagesUrls={images.slice(0, 5)} />
    <p className={styles.usersAmount}>{`+ de ${concludedUsersAmount} membros de ${groupName ? groupName : "placeholder"} já concluíram a atividade`}</p>
</div>;

export default function TaskView({ task }: TaskProps) {
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
    console.log(concludedUsersAmount, task.interactedBy)
    const images = task.interactedBy ? task.interactedBy.map((user, index) => user.image_url) : 0;

    if (isActivity(task.type)) {
        const [name, icon] = getSubjectInfo(task.subjects[0])

        return <Link href={`/task/${task.id}`}>
            <a href="">
                <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}>
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
                            concludedUsersAmount > 1 && <UsersPortraitsFromTask concludedUsersAmount={concludedUsersAmount} images={images as string[]} />
                        }
                        <div className={styles.deadline}>
                            <>
                                <span className={`material-symbols-rounded`}>schedule</span>
                                entrega até {formatDate(task.date, true)}
                            </>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    } else if (isTest(task.type)) {
        return <Link href={`/task/${task.id}`}>
            <a href="">
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
                        <div className={styles.deadline}>
                            <span className={`material-symbols-rounded`}>calendar_today</span>
                            {formatDate(task.date, true)}
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    } else {
        return <Link href={`/task/${task.id}`}>
            <a href="">
                <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}>
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
                        {
                            concludedUsersAmount > 1 && <UsersPortraitsFromTask concludedUsersAmount={concludedUsersAmount} images={images as string[]} />
                        }
                        <div className={styles.deadline}>
                            <span className={`material-symbols-rounded`}>calendar_today</span>
                            {`evento no dia ` + formatDate(task.date, true)}
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    }
}