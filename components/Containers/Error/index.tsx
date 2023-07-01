import { useRouter } from "next/router";

// Imports
import styles from "./error.module.css";

import ArrowLeftIcon from "@material-symbols/svg-600/rounded/subdirectory_arrow_left.svg";

// Components
import Button from "@/components/ui/Button";

type Props = {
	title?: string;
	returnButtonText?: string;
	icon?: string;
	description?: string;
};

const ErrorContainer = ({
	icon,
	title,
	description,
	returnButtonText,
}: Props) => {
	const router = useRouter();

	return (
		<div className={styles.container}>
			<div className={styles.iconHolder}>
				<span
					className={"material-symbols-rounded"}
					style={{
						fontSize: "2.8rem",
						color: "var(--neutral",
						padding: "0rem",
					}}
				>
					{icon ? icon : "report"}
				</span>
			</div>
			{title && <h2>{title}</h2>}
			{description && <p>{description}</p>}
			{returnButtonText && (
				<Button
					onClick={() => router.push(`/home`)}
					style={{
						padding: `1.25rem 1.75rem`,
						backgroundColor: "var(--primary-02)",
						borderRadius: "0.5rem",
						fontFamily: "Karla",
						fontSize: "1.4rem",
					}}
				>
					<ArrowLeftIcon
						className="icon"
						fontSize={"1.3rem"}
						color={"var(--white)"}
					/>
					{returnButtonText}
				</Button>
			)}
		</div>
	);
};

export default ErrorContainer;
