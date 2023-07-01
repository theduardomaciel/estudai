"use client"; // Error components must be Client components

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Styles
import styles from "styles/Landing.module.css";

// Components
import Button from "@/components/ui/Button";

import ArrowLeftIcon from "@material-symbols/svg-600/rounded/keyboard_backspace.svg";

export const metadata = {
	title: "opa... parece que tivemos um problema...",
};

export default function Error({ error }: { error: Error }) {
	const router = useRouter();

	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<main className={styles.holder} style={{ background: "transparent" }}>
			<div
				className={styles.container}
				style={{ justifyContent: "center" }}
			>
				<div className={styles.title}>
					<h1>
						Opa! Parece que tivemos um problema!
						<br />{" "}
					</h1>
					<p>
						{error
							? `Um erro foi encontrado. Por favor, tente novamente mais tarde.`
							: `Nos deparamos com o seguinte erro:\n${error}\n\nPor favor, reporte-o para nós por meio de nossas redes.`}
					</p>
					<Button onClick={() => router.push("/")}>
						<ArrowLeftIcon className="icon" fontSize={18} />
						Voltar para o início
					</Button>
				</div>
			</div>
		</main>
	);
}
