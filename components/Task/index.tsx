"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Activity, ActivityRestriction, Subject, User } from "@prisma/client";

import styles from "./task.module.css";

// Components
import UsersPortraits from "../UsersPortraits";

// Icons
import GenericActivityIcon from "@material-symbols/svg-600/rounded/check_box_outline_blank.svg";
import TestIcon from "@material-symbols/svg-600/rounded/glyphs.svg";
import EventIcon from "@material-symbols/svg-600/rounded/local_activity.svg";

import ArchivedIcon from "@material-symbols/svg-600/rounded/archive.svg";
import ConcludedIcon from "@material-symbols/svg-600/rounded/check_circle.svg";
import ExpiredIcon from "@material-symbols/svg-600/rounded/lock.svg";
import PendingIcon from "@material-symbols/svg-600/rounded/schedule.svg";

// Utils
import formatDate from "@/utils/formatDate";
import { Translations } from "@/i18n/hooks";

export const perQuestion = (questionsAmount: number) =>
	questionsAmount ? (10 / questionsAmount).toString().slice(0, 5) : 0;

export const subjectsString = (
	subjects: Subject[],
	dict: Translations["tasks"]
) =>
	subjects.map((subject, index) => {
		const name = subject.name as string;
		if (index + 1 === subjects.length) {
			return `${dict.and} ${name}`;
		} else if (index + 1 !== subjects.length - 1) {
			return name + ", ";
		} else {
			return name + " ";
		}
	});

interface MembersPortraitsProps {
	membersAmount: number;
	images: Array<string | null>;
	label: string;
	dict: Translations["tasks"]["memberPortraits"];
}

export const MembersPortraits = ({
	membersAmount,
	images,
	label,
	dict: t,
}: MembersPortraitsProps) => {
	return (
		<div className={styles.usersHolder}>
			{membersAmount > 0 && <UsersPortraits imagesUrls={images} />}
			{membersAmount > 0 ? (
				<p className={styles.usersAmount}>
					{`${t.others} ${membersAmount} ${
						membersAmount !== 1 ? t.member_plural : t.member
					} ${label}`}
				</p>
			) : (
				<p className={styles.usersAmount}>{`${t.empty}!`}</p>
			)}
		</div>
	);
};

const STATUS = {
	archived: {
		color: "var(--font-light)",
		icon: <GenericActivityIcon />,
	},
	concluded: {
		color: "var(--green-01)",
		icon: <ConcludedIcon />,
	},
	expired: {
		color: "var(--red-01)",
		icon: <ExpiredIcon />,
	},
	pending: {
		color: "var(--primary-04)",
		icon: <PendingIcon />,
	},
};

// Types
interface TaskProps {
	status: "archived" | "concluded" | "expired" | "pending";
	dict: Translations["tasks"];
}

const getBorderStyle = (status: TaskProps["status"]) =>
	`1px ${status !== "pending" ? "double" : "solid"} ${
		status === "concluded"
			? "var(--green-01)"
			: status === "expired"
			? "var(--red-01)"
			: "var(--primary-04)"
	}`;

export function ActivityView({
	activity,
	status,
	dict: t,
}: TaskProps & {
	activity: Activity & { subjects: Subject[]; interactedBy: User[] };
}) {
	const viewMode = useSearchParams().get("viewMode") || "card";

	const activityObligatoriness = activity.isMandatory
		? t.activity.obligatoriness.mandatory
		: t.activity.obligatoriness.optional;

	const activityRestriction =
		activity.restriction === ActivityRestriction.INDIVIDUAL
			? t.activity.restrictions.individual
			: t.activity.restrictions.group;

	const activityStatus = STATUS[status as keyof typeof STATUS];

	return (
		<Link href={`/activities/${activity.id}`}>
			<div
				className={`${styles.container} ${
					viewMode === "card" ? styles.card : ""
				}`}
				style={{ border: getBorderStyle(status) }}
			>
				<div className={styles.column}>
					<div className={styles.icon}></div>
					<div className={styles.description}>
						<h4>
							{activity.title ??
							t.activity.placeholder_title.includes("_reverse")
								? `${subjectsString(activity.subjects, t)} ${
										t.activity.placeholder_title
								  }`
								: `${
										t.activity.placeholder_title
								  } ${subjectsString(activity.subjects, t)}`}
						</h4>
						<div className={styles.info}>
							{activityObligatoriness}
							<div className={styles.circle} />
							{activityRestriction}
							<div className={styles.circle} />
							{activity.maxScore} {t.points}
						</div>
						{activity.description &&
						activity.description.length > 7 ? (
							<div
								className={styles.content}
								dangerouslySetInnerHTML={{
									__html: JSON.stringify(
										activity.description
									) as unknown as string,
								}}
							/>
						) : (
							<p>{`[${t.activity.no_description}]`}</p>
						)}
					</div>
				</div>
				<div className={`${styles.column} ${styles.two}`}>
					{activity.groupId && (
						<MembersPortraits
							label={
								activity.interactedBy.length !== 1
									? t.activity.concluded_by
									: t.activity.concluded_by_singular
							}
							membersAmount={activity.interactedBy.length}
							images={activity.interactedBy.map((user) =>
								user.avatar === "google"
									? user.image_url
									: user.avatar
							)}
							dict={t.memberPortraits}
						/>
					)}
					<div
						className={styles.deadline}
						style={{ color: activityStatus.color }}
					>
						{activityStatus.icon}
						{
							t.activity.status[
								status as keyof typeof t.activity.status
							]
						}
					</div>
				</div>
			</div>
		</Link>
	);
}

/* export default function TaskView({ task, status }: TaskProps) {
	const { viewMode } = useAppContext();

	const description = task.description && (task.description as string);

	const Content = () =>
		description && description.length > 7 ? (
			<div
				className={styles.content}
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						task.description
					) as unknown as string,
				}}
			/>
		) : (
			<p>{`[${TranslateText("no description provided")}]`}</p>
		);

	// Ícones dos usuários e informação de usuários que concluíram
	const concludedUsersAmount = task.interactedBy
		? task.interactedBy.length
		: 0;
	const images = task.interactedBy
		? task.interactedBy.map((user, index) => user.image_url)
		: 0;

	const Status = ({
		icon,
		text,
		color,
		hideTime,
	}: {
		icon: string;
		text: string;
		color: string;
		hideTime?: boolean;
	}) => (
		<div className={styles.deadline} style={{ color: color }}>
			<>
				<span className={`material-symbols-rounded`}>{icon}</span>
				{hideTime ? text : `${text} ${formatDate(task.date, true)}`}
			</>
		</div>
	);

	const taskIsActivity = isActivity(task.type);
	const taskIsTest = isTest(task.type);

	const infoContent = taskIsActivity ? (
		<>
			{taskType(task.type)}
			<div className={styles.circle} />
			{taskMode(task.mode)}
			<div className={styles.circle} />
			{taskMaxScore(task.maxScore)}
		</>
	) : taskIsTest ? (
		<>
			{taskType(task.type)}
			<div className={styles.circle} />
			{task.questionsAmount + ` ${TranslateText("questions")}`}
			<div className={styles.circle} />
			{perQuestion(task.questionsAmount as number) +
				` ${TranslateText(" per question")}`}
		</>
	) : (
		<>
			<span
				style={{ fontSize: "1.6rem" }}
				className={`material-symbols-rounded`}
			>
				location_on
			</span>
			<p>{task.address}</p>
		</>
	);

	const statusMessage = taskIsActivity ? (
		task.group && (
			<UsersPortraitsFromTask
				message={`${TranslateText("already")} ${TranslateText(
					"concluded",
					concludedUsersAmount !== 1
				)} ${TranslateText("the activity")}`}
				groupName={task.group.name}
				concludedUsersAmount={concludedUsersAmount}
				images={images as string[]}
			/>
		)
	) : taskIsTest ? (
		<></>
	) : (
		task.group && (
			<UsersPortraitsFromTask
				message={`${TranslateText("already")} ${TranslateText(
					"confirmed",
					concludedUsersAmount !== 1
				)} ${TranslateText("presence")}`}
				groupName={task.group.name}
				concludedUsersAmount={concludedUsersAmount}
				images={images as string[]}
			/>
		)
	);

	const statusContent = taskIsActivity ? (
		status === "concluded" ? (
			<Status
				icon="check"
				text={`${TranslateText("task concluded")}`}
				color="var(--green-01)"
				hideTime
			/>
		) : status === "expired" ? (
			<Status
				icon="schedule"
				text={`${TranslateText("expired")} ${TranslateText(
					"in the day"
				)}`}
				color="var(--red-01)"
			/>
		) : task.date ? (
			<Status
				icon="schedule"
				text="entrega até"
				color="var(--primary-02)"
			/>
		) : (
			<></>
		)
	) : taskIsTest ? (
		status === "expired" ? (
			<Status
				icon="archive"
				text={`${TranslateText("archived")} ${TranslateText(
					"in the day"
				)}`}
				color="var(--primary-02)"
			/>
		) : (
			<Status icon="calendar_today" text="" color="var(--primary-02)" />
		)
	) : status === "concluded" ? (
		<Status
			icon="schedule"
			text={TranslateText("Concluded")}
			color="var(--green-01)"
		/>
	) : status === "expired" ? (
		<Status
			icon="schedule"
			text={`${TranslateText("expired")} ${TranslateText("in the day")}`}
			color="var(--red-01)"
		/>
	) : (
		<Status
			icon="schedule"
			text={`${TranslateText("event")} ${TranslateText("in the day")}`}
			color="var(--primary-02)"
		/>
	);

	const icon = taskIsActivity
		? task.subjects.length > 0
			? task.subjects[0].icon
			: "check_box_outline_blank"
		: taskIsTest
		? "glyphs"
		: "local_activity";
	const title = taskIsActivity
		? task.subjects.length > 0
			? task.subjects[0].name
			: TranslateText("Generic task")
		: taskIsTest
		? task.type === "av1"
			? TranslateText("Monthly evaluation (AV1)")
			: TranslateText("Bimonthly evaluation (AV2)")
		: task.title;

	return (
		<Link href={`/task/${task.id}`}>
			<div
				className={`${styles.container} ${
					viewMode === "card" ? styles.card : ""
				}`}
				style={{ border: borderStyle }}
			>
				<div className={styles.column}>
					<div className={styles.icon}>
						<span className={`material-symbols-rounded`}>
							{icon}{" "}
						</span>
					</div>
					<div className={styles.description}>
						<h4>{title}</h4>
						<div className={styles.info}>{infoContent}</div>
						{taskIsTest ? (
							<p>{subjectsString(task.subjects)}</p>
						) : (
							<Content />
						)}
					</div>
				</div>
				<div className={`${styles.column} ${styles.two}`}>
					{statusMessage}
					{statusContent}
				</div>
			</div>
		</Link>
	);
} */
