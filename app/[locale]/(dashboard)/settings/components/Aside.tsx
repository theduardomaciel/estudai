"use client";
import { usePathname } from "next/navigation";

import styles from "@/styles/settings.module.css";

import ChevronLeft from "@material-symbols/svg-600/rounded/chevron_left.svg";
import ChevronRight from "@material-symbols/svg-600/rounded/chevron_right.svg";

import LogoutModalPreset from "@/components/Modal/Presets/LogoutModal";
import Link from "next/link";
import { Translations } from "@/i18n/hooks";

const SECTIONS = [
	"account",
	"connections",
	"preferences",
	"personalization",
	"language",
];

interface Props {
	dict: {
		[key: string]: string;
	};
	modalDict: Translations["modal"];
}

export default function SettingsAside({ dict, modalDict }: Props) {
	const pathname = usePathname();
	const purePathname = pathname.split("/")[3]; // We use index 3 to match locale on pathname (and ignore "/settings")

	const currentActive = SECTIONS.findIndex(
		(section) => section === purePathname
	);

	const { setLogoutModalVisible, LogoutModal } = LogoutModalPreset({
		dict: modalDict,
	});

	return (
		<div className={styles.menu}>
			<ChevronLeft
				className={`icon ${styles.chevron} min-w-[2.4rem]`}
				color={"var(--primary-02)"}
				fontSize={"2.4rem"}
			/>
			<ul className={styles.sections}>
				<Link href={`/settings`}>
					<li
						className={`${styles.section} ${
							currentActive === -1 ? styles.selected : ""
						}`}
					>
						{dict.account}
					</li>
				</Link>
				<Link href={`/settings/connections`}>
					<li
						className={`${styles.section} ${
							currentActive === 1 ? styles.selected : ""
						}`}
					>
						{dict.connections}
					</li>
				</Link>
				<Link href={`/settings/preferences`}>
					<li
						className={`${styles.section} ${
							currentActive === 2 ? styles.selected : ""
						}`}
					>
						{dict.preferences}
					</li>
				</Link>
				<Link href={`/settings/customization`}>
					<li
						className={`${styles.section} ${
							currentActive === 3 ? styles.selected : ""
						}`}
					>
						{dict.customization}
					</li>
				</Link>
				<Link href={`/settings/language`}>
					<li
						className={`${styles.section} ${
							currentActive === 4 ? styles.selected : ""
						}`}
					>
						{dict.language}
					</li>
				</Link>
				<li
					onClick={() => setLogoutModalVisible(true)}
					className={`${styles.section} ${styles.exit}`}
					style={{ color: "var(--red-01)" }}
				>
					{dict.logout}
				</li>
			</ul>
			<ChevronRight
				className={`icon ${styles.chevron} min-w-[2.4rem]`}
				color={"var(--primary-02)"}
				fontSize={"2.4rem"}
			/>
			{LogoutModal}
		</div>
	);
}
