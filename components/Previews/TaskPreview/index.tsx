import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	Activity,
	ActivityRestriction,
	InteractedActivity,
	Subject,
	Test,
	User,
	Event,
} from "@prisma/client";

import styles from "./task.module.css";

// Components
import UsersPortraits from "../../UsersPortraits";

// Icons
import GenericActivityIcon from "@material-symbols/svg-600/rounded/check_box_outline_blank.svg";

import TestIcon from "@material-symbols/svg-600/rounded/glyphs.svg";
import EventIcon from "@material-symbols/svg-600/rounded/local_activity.svg";

import ArchivedIcon from "@material-symbols/svg-600/rounded/archive.svg";
import ConcludedIcon from "@material-symbols/svg-600/rounded/check_circle.svg";
import ExpiredIcon from "@material-symbols/svg-600/rounded/lock.svg";
import PendingIcon from "@material-symbols/svg-600/rounded/schedule.svg";

import LinkIcon from "@material-symbols/svg-600/rounded/link.svg";
import AddressIcon from "@material-symbols/svg-600/rounded/location_on.svg";

// Utils
import formatDate from "@/utils/formatDate";

// Internationalization
import { Translations } from "@/i18n/hooks";
import { Locale } from "@/i18n/config";
import Image from "next/image";

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

export type ViewMode = "card" | "list";

// Types
interface TaskProps {
	status: "archived" | "concluded" | "expired" | "pending";
	dict: Translations["tasks"];
	locale: Locale;
	viewMode: ViewMode;
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
	interactedAt,
	viewMode,
}: TaskProps & {
	interactedAt?: Date;
} & {
	activity: Activity & {
		subjects: Subject[];
		interactions: InteractedActivity & { user: User }[];
	};
}) {
	const activityObligatoriness = activity.isMandatory
		? t.obligatoriness.mandatory
		: t.obligatoriness.optional;

	const activityRestriction =
		activity.restriction === ActivityRestriction.INDIVIDUAL
			? t.activity.restrictions.individual
			: t.activity.restrictions.group;

	const activityStatus = STATUS[status as keyof typeof STATUS];

	const activityDate = formatDate(
		status === "concluded" && interactedAt
			? interactedAt
			: activity.createdAt
	);

	return (
		<Link href={`/activities/${activity.id}`}>
			<div
				className={`${styles.container} ${
					viewMode === "card" ? styles.card : ""
				}`}
				style={{ border: getBorderStyle(status) }}
			>
				<div className={styles.column}>
					<div className={styles.icon}>
						{activity.subjects.length > 0 ? (
							<GenericActivityIcon />
						) : activity.subjects.length === 1 ? (
							<GenericActivityIcon />
						) : (
							<Image
								src={activity.subjects[0].icon}
								alt={activity.subjects[0].name}
								width={24}
								height={24}
							/>
						)}
					</div>
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
							{activity.maxScore} {t.activity.points}
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
					{activity.groupId && activity.interactions && (
						<MembersPortraits
							label={
								activity.interactions.length !== 1
									? t.activity.interacted_by
									: t.activity.interacted_by_singular
							}
							membersAmount={activity.interactions.length}
							images={activity.interactions.map((interaction) =>
								interaction.user
									? interaction.user.avatar === "google"
										? interaction.user.image_url
										: interaction.user.avatar
									: null
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
						{activityDate}
					</div>
				</div>
			</div>
		</Link>
	);
}

export function TestView({
	test,
	status,
	dict: t,
}: TaskProps & {
	test: Test & {
		subjects: Subject[];
	};
}) {
	const viewMode = useSearchParams().get("viewMode") || "card";

	const testObligatoriness = test.isMandatory
		? t.obligatoriness.mandatory
		: t.obligatoriness.optional;

	const subInfo = test.title?.match(/\[(.*?)\]/);
	const testSubInfo = subInfo ? subInfo[1] : null;

	const testStatus = STATUS[status as keyof typeof STATUS];

	return (
		<Link href={`/tests/${test.id}`}>
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
							{test.title ??
							t.activity.placeholder_title.includes("_reverse")
								? `${subjectsString(test.subjects, t)} ${
										t.test.placeholder_title
								  }`
								: `${t.test.placeholder_title} ${subjectsString(
										test.subjects,
										t
								  )}`}
						</h4>
						<div className={styles.info}>
							{testObligatoriness} ({testSubInfo})
							<div className={styles.circle} />
							{test.maxScore} {t.test.questions}
							<div className={styles.circle} />
							{test.showQuestionsAverage &&
								test.maxScore &&
								test.questionsAmount &&
								`${(
									test.maxScore / test.questionsAmount
								).toFixed(2)} ${t.test.per_question}`}
						</div>
						{subjectsString(test.subjects, t)}
					</div>
				</div>
				<div className={`${styles.column} ${styles.two}`}>
					<div
						className={styles.deadline}
						style={{ color: testStatus.color }}
					>
						{testStatus.icon}
						{status === "archived" &&
							t.activity.status[
								status as keyof typeof t.activity.status
							]}
						{test.date?.toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "2-digit",
						})}
					</div>
				</div>
			</div>
		</Link>
	);
}

export function EventView({
	event,
	status,
	dict: t,
	viewMode,
}: TaskProps & {
	event: Event & {
		interactions: InteractedActivity & { user: User }[];
	};
}) {
	const eventObligatoriness = event.isMandatory
		? t.obligatoriness.mandatory
		: t.obligatoriness.optional;

	const eventStatus = STATUS[status as keyof typeof STATUS];

	return (
		<Link href={`/events/${event.id}`}>
			<div
				className={`${styles.container} ${
					viewMode === "card" ? styles.card : ""
				}`}
				style={{ border: getBorderStyle(status) }}
			>
				<div className={styles.column}>
					<div className={styles.icon}></div>
					<div className={styles.description}>
						<h4>{event.title}</h4>
						<div className={styles.info}>
							{eventObligatoriness}
							<div className={styles.circle} />
							{event.address?.includes("http") ? (
								<>
									<LinkIcon />
									{event.address}
								</>
							) : (
								<>
									<AddressIcon />
									{event.address}
								</>
							)}
						</div>
						{event.description && event.description.length > 7 ? (
							<div
								className={styles.content}
								dangerouslySetInnerHTML={{
									__html: JSON.stringify(
										event.description
									) as unknown as string,
								}}
							/>
						) : (
							<p>{`[${t.activity.no_description}]`}</p>
						)}
					</div>
				</div>
				<div className={`${styles.column} ${styles.two}`}>
					{event.groupId && event.interactions && (
						<MembersPortraits
							label={
								event.interactions.length !== 1
									? t.activity.interacted_by
									: t.activity.interacted_by_singular
							}
							membersAmount={event.interactions.length}
							images={event.interactions.map((interaction) =>
								interaction.user
									? interaction.user.avatar === "google"
										? interaction.user.image_url
										: interaction.user.avatar
									: null
							)}
							dict={t.memberPortraits}
						/>
					)}
					<div
						className={styles.deadline}
						style={{ color: eventStatus.color }}
					>
						{eventStatus.icon}
						{
							t.activity.status[
								status as keyof typeof t.activity.status
							]
						}
						{event.date?.toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "2-digit",
						})}
					</div>
				</div>
			</div>
		</Link>
	);
}
