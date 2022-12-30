import React from "react";
import UsersPortraits from "../UsersPortraits";

import styles from "./task.module.css"

// Contexto
import { useAppContext } from "../../contexts/AppContext";
import Link from "next/link";
import { Task } from "../../types/Task";
import formatDate from "../../utils/formatDate";
import { Subject } from "../../types/Subject";
import Translate, { TranslateText } from "../Translate";

// Data
export const isActivity = (type: string) => type === 'obligatory' || type === "elective";;
export const isTest = (type: string) => type === 'av1' || type === "av2" || type === "recuperation";
export const taskGroupType = (type: string) => { return [isActivity(type), isTest(type)] };

export const taskType = (type: string | undefined) => type === "obligatory" ? 'AV3' :
    type === "elective" ? TranslateText("Elective") :
        type === "av1" ? 'AV1' :
            type === 'av2' ? 'AV2' : "AV"

export const taskMode = (mode: string | undefined) => mode === "written" ? TranslateText("Written") :
    mode === "typed" ? TranslateText("Typed") :
        mode === "both" ? TranslateText("Written or typed") :
            TranslateText("No restriction")

export const taskMaxScore = (score: number | undefined) => score && score > 0 ? `${score}${score?.toString().length === 1 ? ",0" : ""} ${TranslateText("points")}` :
    TranslateText("No score")

export const perQuestion = (questionsAmount: number) => questionsAmount ? (10 / questionsAmount).toString().slice(0, 5) : 0

export const subjectsString = (subjects: Subject[]) => subjects.map((subject, index) => {
    const name = subject.name as string;
    if (index + 1 === subjects.length) {
        return `${TranslateText("and")} ` + name
    } else if (index + 1 !== subjects.length - 1) {
        return name + ", "
    } else {
        return name + " "
    }
})

export const UsersPortraitsFromTask = ({ concludedUsersAmount, images, groupName, message }: { concludedUsersAmount: number, images: Array<string>, groupName: string, message: string }) => <div className={styles.usersHolder}>
    {
        concludedUsersAmount > 0 && <UsersPortraits imagesUrls={images} />
    }
    {
        concludedUsersAmount > 0 ?
            <p className={styles.usersAmount}>{`${TranslateText("+ than")} ${concludedUsersAmount} ${TranslateText("member")} ${TranslateText("from")} ${groupName ? groupName : "..."} ${message}`}</p> :
            <p className={styles.usersAmount}>{`${TranslateText("no member from")} `} <strong>{groupName}</strong> {` ${TranslateText("concluded this task yet")}!`}</p>
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
        <p>{`[${TranslateText("no description provided")}]`}</p>

    // Ícones dos usuários e informação de usuários que concluíram
    const concludedUsersAmount = task.interactedBy ? task.interactedBy.length : 0;
    const images = task.interactedBy ? task.interactedBy.map((user, index) => user.image_url) : 0;

    const Status = ({ icon, text, color, hideTime }: { icon: string, text: string, color: string, hideTime?: boolean }) => <div className={styles.deadline} style={{ color: color }}>
        <>
            <span className={`material-symbols-rounded`}>{icon}</span>
            {
                hideTime ?
                    text
                    :
                    `${text} ${formatDate(task.date, true)}`
            }
        </>
    </div>

    const taskIsActivity = isActivity(task.type);
    const taskIsTest = isTest(task.type);

    // General
    const borderStyle = `1px ${status !== "pending" ? 'double' : 'solid'} ${status === 'concluded' ? 'var(--green-01)' : status === 'expired' ? 'var(--red-01)' : 'var(--primary-04)'}`;

    const infoContent = taskIsActivity ?
        <>
            {taskType(task.type)}
            <div className={styles.circle} />
            {taskMode(task.mode)}
            <div className={styles.circle} />
            {taskMaxScore(task.maxScore)}
        </> :
        taskIsTest ?
            <>
                {taskType(task.type)}
                <div className={styles.circle} />
                {task.questionsAmount + ` ${TranslateText("questions")}`}
                <div className={styles.circle} />
                {perQuestion(task.questionsAmount as number) + ` ${TranslateText(" per question")}`}
            </>
            : <>
                <span style={{ fontSize: "1.6rem" }} className={`material-symbols-rounded`}>location_on</span>
                <p>{task.address}</p>
            </>

    const statusMessage = taskIsActivity ?
        task.group && <UsersPortraitsFromTask
            message={`${TranslateText("already")} ${TranslateText("concluded", concludedUsersAmount !== 1)} ${TranslateText("the activity")}`}
            groupName={task.group.name}
            concludedUsersAmount={concludedUsersAmount} images={images as string[]}
        />
        : taskIsTest ?
            <></>
            :
            task.group && <UsersPortraitsFromTask
                message={`${TranslateText("already")} ${TranslateText("confirmed", concludedUsersAmount !== 1)} ${TranslateText("presence")}`}
                groupName={task.group.name}
                concludedUsersAmount={concludedUsersAmount}
                images={images as string[]}
            />

    const statusContent = taskIsActivity ?
        status === 'concluded' ? <Status icon="check" text={`${TranslateText("task concluded")}`} color="var(--green-01)" hideTime /> :
            status === "expired" ? <Status icon="schedule" text={`${TranslateText("expired")} ${TranslateText("in the day")}`} color="var(--red-01)" /> :
                task.date ? <Status icon="schedule" text="entrega até" color="var(--primary-02)" /> :
                    <></>
        : taskIsTest ?
            status === "expired" ? <Status icon="archive" text={`${TranslateText("archived")} ${TranslateText("in the day")}`} color="var(--primary-02)" /> :
                <Status icon="calendar_today" text="" color="var(--primary-02)" />
            :
            status === 'concluded' ? <Status icon="schedule" text={TranslateText("Concluded")} color="var(--green-01)" /> :
                status === "expired" ? <Status icon="schedule" text={`${TranslateText("expired")} ${TranslateText("in the day")}`} color="var(--red-01)" /> :
                    <Status icon="schedule" text={`${TranslateText("event")} ${TranslateText("in the day")}`} color="var(--primary-02)" />

    const icon = taskIsActivity ? (task.subjects.length > 0 ? task.subjects[0].icon : "check_box_outline_blank") : taskIsTest ? "glyphs" : "local_activity";
    const title = taskIsActivity ? (task.subjects.length > 0 ? task.subjects[0].name : TranslateText("Generic task")) : taskIsTest ? task.type === "av1" ? TranslateText("Monthly evaluation (AV1)") : TranslateText("Bimonthly evaluation (AV2)") : task.title

    return (
        <Link href={`/task/${task.id}`}>
            <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`} style={{ border: borderStyle }}>
                <div className={styles.column}>
                    <div className={styles.icon}>
                        <span className={`material-symbols-rounded`}>{icon} </span>
                    </div>
                    <div className={styles.description}>
                        <h4><Translate>{title}</Translate></h4>
                        <div className={styles.info}>
                            {infoContent}
                        </div>
                        {taskIsTest ? <p>{subjectsString(task.subjects)}</p> : <Content />}
                    </div>
                </div>
                <div className={`${styles.column} ${styles.two}`}>
                    {statusMessage}
                    {statusContent}
                </div>
            </div>
        </Link>
    )
}