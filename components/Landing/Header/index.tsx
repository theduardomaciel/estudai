import Link from "next/link";
import styles from "./header.module.css";

// Logo
import Logo from "/public/logo.svg";
import { useTranslations } from "@/i18n/hooks";

export default function LandingHeader({
	children,
}: {
	children?: React.ReactNode;
}) {
	const t = useTranslations();
	return (
		<div className={`${styles.container}`}>
			<Link href={`/`} style={{ cursor: "pointer" }}>
				<Logo width={78.19} height={38} fill={`var(--primary-02)`} />
			</Link>
			{children}
			<div className={styles.links}>
				<Link href={"/login"}>
					<p className={styles.link}>{t.landing.login}</p>
				</Link>
				{/* <Link href={"/register"}>
					<p className={styles.register}>{t.landing.register}</p>
				</Link> */}
			</div>
		</div>
	);
}
