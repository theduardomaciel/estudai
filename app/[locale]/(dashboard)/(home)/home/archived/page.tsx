import { redirect } from "next/navigation";

// Stylesheets
import styles from "../styles/Home.module.css";

// Components
import TaskView from "@/components/Task";
import EmptyMessage from "@/components/Empty";

// Internationalization
import { useTranslations } from "@/i18n/hooks";

// Utils
import getUser from "@/services/getUser";
import { arrayPrototype } from "../filters";

export default async function HomeArchived({
	params,
	searchParams,
}: {
	params: { section?: string };
	searchParams: { isNewUser?: string; viewMode?: string };
}) {
	const t = useTranslations().home;
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const { viewMode } = searchParams;

	const tasksArray = arrayPrototype([
		...user.activitiesInteracted,
		...user.eventsInteracted,
	]);

	// Avaliações - arquivam sem estar expirados
	// Atividades - expiram e concluem
	// Eventos - expiram e arquivam, mas não concluem

	const archivedTasks = [
		...user.tests.filterArchivedTasks(),
		...user.events.filterArchivedTasks(),
	];

	const expiredTasks = user.activities.filterArchivedTasks();
	const concludedTasks = user.activitiesInteracted;

	const archivedTasksViews = archivedTasks.map((task, index) => (
		<TaskView key={index} task={task} status={"archived"} />
	));

	const expiredTasksViews = expiredTasks.map((task, index) => (
		<TaskView key={index} task={task} status={"expired"} />
	));

	const concludedTasksViews = concludedTasks.map((task, index) => (
		<TaskView key={index} task={task} status={"concluded"} />
	));

	const sortedArray = [
		...archivedTasksViews,
		...expiredTasksViews,
		...concludedTasksViews,
	].sort((a, b) => {
		/*  const aDate = new Date(a.props.task.date);
        const bDate = new Date(b.props.task.date);
        return aDate.getTime() - bDate.getTime(); */
		const aDate = new Date(a.props.task.date);
		const bDate = new Date(b.props.task.date);
		if (aDate && bDate) {
			return aDate.getTime() - bDate.getTime();
		} else if (aDate) {
			return -1;
		} else if (bDate) {
			return 1;
		} else {
			return 0;
		}
	});

	const hasTasks = tasksArray.length > 0;

	return (
		<>
			<ul className={`${styles.tasks}`}>
				{hasTasks ? (
					<>
						<div className={styles.filterGroup}>{sortedArray}</div>
					</>
				) : (
					<EmptyMessage />
				)}
			</ul>
		</>
	);
}
