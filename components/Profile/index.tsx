import Image from "next/image";

// Imports
import NotificationsIcon from "@material-symbols/svg-600/rounded/notifications_active.svg";

// Components
import ToggleMenuButton from "@/components/Menu/ToggleButton";

// Stylesheet
import styles from "./profile.module.css";

// Types
//import type { User } from "@/types/User";
import type { User } from "@prisma/client";

import { useTranslations } from "@/i18n/hooks";

interface Props {
	user: User | null;
	showMenu?: boolean;
}

function getGreetings() {
	const t = useTranslations();

	const now = new Date();
	const actualHour = now.getHours();

	if (actualHour > 4 && actualHour <= 11) {
		return `${t.greetings.morning},`;
	} else if (now.getHours() > 11 && actualHour <= 18) {
		return `${t.greetings.afternoon},`;
	} else if (now.getHours() > 18) {
		return `${t.greetings.evening},`;
	}
}

export default function Profile({ user, showMenu = true }: Props) {
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
					<p>{getGreetings()}</p>
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
								Você tem{" "}
								<span>{`${pendingTasksLength} atividade${
									pendingTasksLength !== 1 ? "s" : ""
								}`}</span>{" "}
								pendente
								{pendingTasksLength !== 1 ? "s" : ""}
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
						<p>You have no pending activities!</p>
					)}
				</div>
				{showMenu && <ToggleMenuButton />}
			</div>
		</div>
	);
}
