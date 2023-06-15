"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./sectionSelector.module.css";

interface Section {
	id: string;
	name: string;
}

interface SectionSelectorProps {
	sections: Array<Section>;
}

export default function SectionSelector({ sections }: SectionSelectorProps) {
	const pathname = usePathname();
	const actualSection = pathname.split("/")[2];

	return (
		<ul className={styles.selector}>
			{sections.map((section, index) => (
				<Link
					key={index}
					className={`${styles.section} ${
						actualSection === section.id ? styles.selected : ""
					}`}
					href={{
						pathname: `/home/${section.name}`,
					}}
				>
					<p>{section.name}</p>
					<div />
				</Link>
			))}
		</ul>
	);
}
