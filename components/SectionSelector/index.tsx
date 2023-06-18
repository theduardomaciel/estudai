"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./sectionSelector.module.css";

interface Section {
	id?: string;
	name: string;
}

interface SectionSelectorProps {
	sections: Array<Section>;
}

export default function SectionSelector({ sections }: SectionSelectorProps) {
	const pathname = usePathname();
	const actualSection = pathname.split("/")[3];
	console.log("Actual", actualSection);

	return (
		<ul className={styles.selector}>
			{sections.map((section, index) => (
				<Link
					className="flex-1"
					key={index}
					href={{
						pathname: `/home/${section.id ?? ""}`,
					}}
				>
					<li
						className={`${styles.section} ${
							actualSection === section.id ? styles.selected : ""
						}`}
					>
						<p>{section.name}</p>
						<div />
					</li>
				</Link>
			))}
		</ul>
	);
}
