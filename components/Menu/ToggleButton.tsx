"use client";

import styles from "./menu.module.css";

// Components
import Button from "../Button";

// Icons
import CloseIcon from "@material-symbols/svg-600/rounded/close.svg";
import OpenIcon from "@material-symbols/svg-600/rounded/menu.svg";

interface Props {
	type?: "open" | "close";
}

export default function ToggleMenuButton({ type = "open" }: Props) {
	function toggleMenu() {
		const menu = document.querySelector(`.${styles.holder}`);
		if (menu) {
			menu.classList.toggle(styles.open);
		}
	}

	return (
		<Button className={styles.toggleButton} onClick={toggleMenu}>
			{type === "open" ? (
				<OpenIcon className="icon" fontSize={"2rem"} />
			) : (
				<CloseIcon className="icon" fontSize={"2rem"} />
			)}
		</Button>
	);
}
