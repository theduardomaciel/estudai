import { redirect } from "next/navigation";

// Components
import { ActivityView, TestView, EventView, ViewMode } from "@/components/Task";
import IntroductionModal from "@/components/Landing/IntroModal";

// Stylesheets
import styles from "@/styles/Home.module.css";

// Internationalization
import { useTranslations, Translations } from "@/i18n/hooks";

// Utils
import getUser from "@/services/getUser";

export default async function Home({
	params,
	searchParams,
}: {
	params: { locale: string };
	searchParams: { isNewUser?: string; viewMode?: string };
}) {
	const dict = useTranslations();
	const t = dict.home;
	const locale = (params.locale as Locale) ?? i18n.defaultLocale;
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const viewMode = searchParams?.viewMode as ViewMode;
	const isNewUser = searchParams?.isNewUser === "true";

	const defaultParams = {
		dict: dict.tasks,
		locale,
		viewMode: (viewMode ?? "list") as ViewMode,
	};

	// Somente exibimos atividades concluídas na semana
	const concludedActivities = user.activities
		.filterWeekTasks()
		.filterArchivedTasks(true)
		.filterInteractedTasks(user.id)
		.map((activity, index) => (
			<ActivityView
				key={index}
				activity={activity as any}
				status={"concluded"}
				{...defaultParams}
			/>
		));

	const pendingActivities = user.activities
		.filterArchivedTasks(true)
		.map((activity, index) => (
			<ActivityView
				key={index}
				activity={activity as any}
				status={"pending"}
				{...defaultParams}
			/>
		));

	const pendingTests = user.tests
		.filterArchivedTasks(true)
		.map((test, index) => (
			<TestView
				key={index}
				test={test}
				status={"pending"}
				{...defaultParams}
			/>
		));

	const pendingEvents = user.events
		.filterArchivedTasks(true)
		.map((event, index) => (
			<EventView
				key={index}
				event={event as any}
				status={"pending"}
				{...defaultParams}
			/>
		));

	const sortedTasks = [
		...concludedActivities,
		...pendingActivities,
		...pendingTests,
		...pendingEvents,
	].sort((a, b) => {
		const aDate = new Date(a.props.activity.date);
		const bDate = new Date(b.props.activity.date);
		return aDate.getTime() - bDate.getTime();
	});

	const weekTasks = sortedTasks.filter((task) => {
		const taskDate = new Date(task.props.activity.date);
		const today = new Date();
		const week = 7 * 24 * 60 * 60 * 1000;
		return taskDate.getTime() - today.getTime() < week;
	});

	const monthTasks = sortedTasks.filter((task) => {
		const taskDate = new Date(task.props.activity.date);
		const today = new Date();
		const month = 30 * 24 * 60 * 60 * 1000;
		return taskDate.getTime() - today.getTime() < month;
	});

	const otherMonthsTasks = sortedTasks.filter((task) => {
		const taskDate = new Date(task.props.activity.date);
		const today = new Date();
		const month = 30 * 24 * 60 * 60 * 1000;
		return taskDate.getTime() - today.getTime() > month;
	});

	const otherTasks = sortedTasks.filter((task) => {
		return !task.props.activity.date;
	});

	const hasTasks = true;

	return (
		<>
			<ul className={`${styles.tasks}`}>
				{hasTasks ? (
					<>
						{monthTasks.length > 0 && (
							<div className={styles.filterGroup}>
								<h5>This week</h5>
								{weekTasks}
							</div>
						)}
						{monthTasks.length > 0 && (
							<div className={styles.filterGroup}>
								<h5>This month</h5>
								{monthTasks}
							</div>
						)}
						{otherMonthsTasks.length > 0 && (
							<div className={styles.filterGroup}>
								<h5>Next months</h5>
								{otherMonthsTasks}
							</div>
						)}
						{otherTasks.length > 0 && (
							<div className={styles.filterGroup}>
								<h5>Outros</h5>
								{otherMonthsTasks}
							</div>
						)}
					</>
				) : (
					<EmptyMessage />
				)}
			</ul>
			{!!isNewUser && (
				<IntroductionModal
					sections={INTRO_MODAL_SECTIONS({ dict: t.intro_modal })}
				/>
			)}
		</>
	);
}

// Intro Modal Images
import Modal1Image from "/public/landing/introModal/modal_1.png";
import Modal2Image from "/public/landing/introModal/modal_2.png";
import Modal3Image from "/public/landing/introModal/modal_3.png";
import Modal4Image from "/public/landing/introModal/modal_4.png";
import Modal5Image from "/public/landing/introModal/modal_5.png";
import EmptyMessage from "@/components/Empty";
import { Locale, i18n } from "@/i18n/config";
import tasksArray, { arrayPrototype, filterWeekTasks } from "./filters";

const INTRO_MODAL_SECTIONS = ({
	dict: t,
}: {
	dict: Translations["home"]["intro_modal"];
}) => {
	return [
		{
			title: t.modal1.title,
			description: t.modal1.description,
			image_path: Modal1Image,
			imageSize: { height: 225, width: 400 },
		},
		{
			title: t.modal2.title,
			description: t.modal2.description,
			image_path: Modal2Image,
			imageSize: { height: 100, width: 400 },
		},
		{
			title: t.modal3.title,
			description: t.modal3.description,
			image_path: Modal3Image,
			imageSize: { height: 180, width: 400 },
		},
		{
			title: t.modal4.title,
			description: t.modal4.description,
			image_path: Modal4Image,
			imageSize: { height: 180, width: 400 },
		},
		{
			title: t.modal5.title,
			description: t.modal5.description,
			image_path: Modal5Image,
			marginTop: "3.5rem",
			imageSize: { height: 350, width: 400 },
		},
	];
};
