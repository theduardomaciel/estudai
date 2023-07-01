import Image from "next/image";

// Imports
import NotificationsIcon from "@material-symbols/svg-600/rounded/notifications_active.svg";

// Components
import ToggleMenuButton from "@/components/Menu/ToggleButton";

// Stylesheet
import styles from "./profile.module.css";

// Types
import type { User } from "@prisma/client";

// Internationalization
import { Translations, useTranslations } from "@/i18n/hooks";

interface Props {
	user: User | null;
	showMenu?: boolean;
}

function getGreetings(t: Translations["profile"]["greetings"]) {
	const now = new Date();
	const actualHour = now.getHours();

	if (actualHour >= 4 && actualHour <= 11) {
		return `${t.morning},`;
	} else if (actualHour >= 12 && actualHour < 18) {
		return `${t.afternoon},`;
	}
	return `${t.evening},`;
}

export default function Profile({ user, showMenu = true }: Props) {
	const t = useTranslations().profile;

	const pendingTasksLength = 0;
	const completedTasksLength = 0;

	const completedPercentage =
		completedTasksLength && pendingTasksLength
			? (completedTasksLength * 100) /
			  (pendingTasksLength + completedTasksLength)
			: 0;

	return (
		<div className={styles.holder}>
			<div className={styles.profile}>
				<div className={styles.image}>
					{user?.avatar === "google" && user.image_url ? (
						<Image
							src={user?.image_url}
							width={42}
							height={42}
							alt="Avatar do usuário"
						/>
					) : (
						<div
							className={`${
								styles.avatar
							} ${`avatar_${user?.avatar}`}`}
						/>
					)}
				</div>
				<div className={styles.text}>
					<p>{getGreetings(t.greetings)}</p>
					<p>{`${user?.firstName} ${
						user?.lastName ? user?.lastName : ""
					}`}</p>
				</div>
			</div>
			<div className={styles.row2}>
				<div className={styles.pendingReminder}>
					<NotificationsIcon className="icon" fontSize={"2.4rem"} />
					{pendingTasksLength && pendingTasksLength > 0 ? (
						<>
							<p>
								{pendingTasksLength !== 1
									? t.pending.pending_plural.replace(
											"{{count}}",
											pendingTasksLength
									  )
									: t.pending.pending}
							</p>
							<div className={styles.progressHolder}>
								<p>{Math.floor(completedPercentage)}%</p>
								<div className={styles.progressBar}>
									<div
										style={{
											width: `${completedPercentage}%`,
										}}
									/>
									<div />
								</div>
							</div>
						</>
					) : (
						<p>{t.pending.no_pending}.</p>
					)}
				</div>
				{showMenu && <ToggleMenuButton />}
			</div>
		</div>
	);
}
