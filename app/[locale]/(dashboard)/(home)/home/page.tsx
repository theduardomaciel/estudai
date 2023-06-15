import { redirect } from "next/navigation";

// Components
import TaskView from "@/components/Task";
import IntroductionModal from "@/components/Landing/IntroModal";

// Stylesheets
import styles from "../styles/Home.module.css";

// Internationalization
import { useTranslations, Translations } from "@/i18n/hooks";

// Utils
import { arrayPrototype } from "./filters";
import getUser from "@/services/getUser";

export default async function Home({
	searchParams,
}: {
	searchParams: { isNewUser?: string; viewMode?: string };
}) {
	const t = useTranslations().home;
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const { isNewUser, viewMode } = searchParams;
	const tasksArray = arrayPrototype([
		...user.activities,
		...user.tests,
		...user.events,
	]);

	const weekTasks = tasksArray
		.filterWeekTasks()
		.map((task, index) => (
			<TaskView key={index} task={task} status={"pending"} />
		));

	const monthTasks = tasksArray
		.filterMonthTasks()
		.map((task, index) => (
			<TaskView key={index} task={task} status={"pending"} />
		));

	const otherMonthsTasks = tasksArray
		.filterMonthTasks(undefined, true)
		.map((task, index) => (
			<TaskView key={index} task={task} status={"pending"} />
		));

	const otherTasks = tasksArray
		.filterNoDateTasks()
		.map((task, index) => (
			<TaskView key={index} task={task} status={"pending"} />
		));

	const hasTasks = tasksArray.length > 0;

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
