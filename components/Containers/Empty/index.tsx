import styles from "./empty.module.css";
import BlurIcon from "@material-symbols/svg-600/rounded/blur_on.svg";

import { useTranslations } from "@/i18n/hooks";

interface EmptyTasks {
	description?: string;
	removeMargin?: boolean;
}

export default function EmptyMessage({
	description,
	removeMargin,
}: EmptyTasks) {
	const t = useTranslations().empty;

	return (
		<div
			style={{ marginTop: removeMargin ? "0px" : "10rem" }}
			className={styles.emptyTasks}
		>
			<BlurIcon
				className="icon"
				fontSize={"5.6rem"}
				color={"var(--primary-02)"}
			/>
			<p>
				<strong>{t.title}</strong>{" "}
			</p>
			<p>{description ? description : t.tasks}</p>
		</div>
	);
}
