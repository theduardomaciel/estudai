"use client";

import styles from "./menu.module.css";

// Components
import Button from "../Button";

// Icons
import CloseIcon from "@material-symbols/svg-600/rounded/close.svg";
import OpenIcon from "@material-symbols/svg-600/rounded/menu.svg";
import clsx from "clsx";

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
		<Button
			className={clsx("p-2 flex lg:hidden", {
				"bg-transparent border-none": type === "close",
			})}
			preset={type === "open" ? "primary" : "scale"}
			onClick={toggleMenu}
		>
			{type === "open" ? (
				<OpenIcon
					className="icon"
					color="var(--neutral)"
					fontSize={"2rem"}
				/>
			) : (
				<CloseIcon
					className="icon min-w-[2rem] min-h-[2rem]"
					color="var(--font-dark)"
					fontSize={"2rem"}
				/>
			)}
		</Button>
	);
}
