import { redirect } from "next/navigation";

// Stylesheets
import styles from "@/styles/Home.module.css";

// Components
import { ActivityView, EventView, TestView, ViewMode } from "@/components/Task";
import EmptyMessage from "@/components/Empty";

// Internationalization
import { useTranslations } from "@/i18n/hooks";

// Utils
import getUser from "@/services/getUser";
import { Locale, i18n } from "@/i18n/config";
import {
	filterArchivedTasks,
	filterInteractedTasks,
	filterWeekTasks,
} from "../filters";

export default async function HomeArchived({
	params,
	searchParams,
}: {
	params: { locale: string };
	searchParams: { isNewUser?: string; viewMode?: string };
}) {
	const dict = useTranslations();
	const user = await getUser();

	const locale = (params.locale as Locale) ?? i18n.defaultLocale;

	if (!user) {
		redirect("/login");
	}

	const viewMode = searchParams?.viewMode as ViewMode;

	const defaultParams = {
		dict: dict.tasks,
		locale,
		viewMode: (viewMode ?? "list") as ViewMode,
	};

	// Avaliações e eventos - arquivam sem estar expirados
	// Atividades - são arquivadas quando expiram (podem ter sido concluídas ou não)

	const archivedTests = filterArchivedTasks(user.tests) as typeof user.tests;
	const archivedTestsViews = archivedTests.map((task, index) => (
		<TestView
			key={index}
			test={task}
			status={"archived"}
			{...defaultParams}
		/>
	));

	const archivedEvents = filterArchivedTasks(
		user.events
	) as typeof user.events;
	const archivedEventsViews = archivedEvents.map((event, index) => (
		<EventView
			key={index}
			event={event as any}
			status={"archived"}
			{...defaultParams}
		/>
	));

	const archivedActivities = filterArchivedTasks(
		user.activities
	) as typeof user.activities;
	// As tarefas que expiraram são aquelas que não foram interagidas e que a data de entrega já passou
	// Para esse sistema funcionar, o usuário não poderá interagir com a tarefa depois que ela expirar
	const expiredActivities = filterInteractedTasks(
		archivedActivities,
		user.id,
		true
	);
	const expiredActivitiesViews = expiredActivities.map((activity, index) => (
		<ActivityView
			key={index}
			activity={activity as any}
			status={"expired"}
			{...defaultParams}
		/>
	));

	// Como somente é possível concluir uma tarefa que já foi interagida, não é necessário filtrar por interação
	const concludedActivities = filterWeekTasks(
		filterInteractedTasks(archivedActivities, user.id),
		true
	);

	const concludedActivitiesViews = concludedActivities.map((task, index) => (
		<ActivityView
			key={index}
			activity={task as any}
			status={"concluded"}
			{...defaultParams}
		/>
	));

	const sortedArray = [
		...archivedTestsViews,
		...archivedEventsViews,
		...expiredActivitiesViews,
		...concludedActivitiesViews,
	].sort((a, b) => {
		/* const aDate = new Date(a.props.task.date);
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

	const hasTasks = sortedArray.length > 0;

	return (
		<>
			<ul className={`${styles.tasks}`}>
				{hasTasks ? (
					<>
						<div className={styles.filterGroup}>{sortedArray}</div>
					</>
				) : (
					<EmptyMessage description={dict.home.empty_archived} />
				)}
			</ul>
		</>
	);
}
