import Link from "next/link";
import styles from "./footer.module.css";

import { useTranslations } from "@/i18n/hooks";

export default function LandingFooter() {
	const t = useTranslations();

	return (
		<div className={`${styles.container}`}>
			<h6>estudaí</h6>
			<p>
				{t.landing.greeting}{" "}
				<Link
					style={{ cursor: "pointer" }}
					target={"_blank"}
					href={`https://instagram.com/theduardomaciel`}
				>
					@theduardomaciel
				</Link>
			</p>
		</div>
	);
}
