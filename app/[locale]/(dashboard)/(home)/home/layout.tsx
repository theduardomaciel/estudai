import Link from "next/link";

// Stylesheets
import styles from "@/styles/Home.module.css";

// Icons
import ListIcon from "@material-symbols/svg-600/rounded/format_list_bulleted.svg";
import CardIcon from "@material-symbols/svg-600/rounded/event_note.svg";

// Components
import SectionSelector from "@/components/SectionSelector";
import { AddTaskButton } from "@/components/Button/presets/AddTask";

// Utils
import getUser from "@/services/getUser";
import { useTranslations } from "@/i18n/hooks";

export default async function HomeLayout({
	children,
	searchParams,
}: {
	children: React.ReactNode;
	searchParams: { viewMode?: string };
}) {
	const t = useTranslations().home;

	const viewMode = searchParams?.viewMode;
	const user = await getUser();

	const userHasTasks =
		(user?.activities && user.activities.length > 0) ||
		(user?.tests && user.tests.length > 0) ||
		(user?.events && user.events.length > 0);

	return (
		<>
			<div className={"header"}>
				<h3 className={"title"}>My tasks</h3>
				<div className={styles.actionButtons}>
					{userHasTasks && (
						<div className={styles.viewType}>
							<Link
								href={{
									query: {
										...searchParams,
										viewMode: "list",
									},
								}}
								replace
							>
								<ListIcon
									className={`icon click ${styles.icon} ${
										viewMode === "list" && styles.active
									}`}
								/>
							</Link>
							<Link
								href={{
									query: {
										...searchParams,
										viewMode: "card",
									},
								}}
								replace
							>
								<CardIcon
									className={`icon click ${styles.icon} ${
										viewMode === "card" && styles.active
									}`}
								/>
							</Link>
						</div>
					)}
					<AddTaskButton />
				</div>
			</div>
			<div className={styles.subheader}>
				<SectionSelector
					sections={[
						{ id: "", name: t.sections.pending },
						{ id: "archived", name: t.sections.archived },
					]}
				/>
				{/* Botão filtro em breve... */}
			</div>
			{children}
		</>
	);
}
