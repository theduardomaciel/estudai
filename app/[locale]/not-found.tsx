// Styles
import styles from "styles/Landing.module.css";

// Components
import Button from "@/components/Button";

// Icons
import StarIcon from "/public/landing/star.svg";
import PiIcon from "/public/landing/pi.svg";
import EnergyIcon from "/public/landing/energy.svg";
import PaperPlaneIcon from "/public/landing/paper_plane.svg";
import BaskharaIcon from "/public/landing/baskhara.svg";

import ArrowLeftIcon from "@material-symbols/svg-600/rounded/keyboard_backspace.svg";
import RedirectButton from "@/components/Button/Redirect";
import Link from "next/link";

export const metadata = {
	title: "404! parece que essa página não existe...",
};

export default function NotFound() {
	return (
		<main className={styles.holder}>
			<div
				className={styles.container}
				style={{ justifyContent: "center" }}
			>
				<div className={styles.title}>
					<h1>
						404.
						<br />{" "}
					</h1>
					<p>
						Oops! Parece que você se perdeu no caminho para o
						sucesso acadêmico. Não se preocupe, nós temos a solução.
						<br />
						Basta voltar para a página inicial e seguir as nossas
						dicas de organização de estudos. <br />
						Você vai ver como é fácil organizar seus estudos. Mas
						não demore muito, porque o tempo está passando e você
						tem muito o que estudar!
					</p>
					<Link href={`/`}>
						<RedirectButton>
							<ArrowLeftIcon className="icon" fontSize={18} />
							Voltar para o início
						</RedirectButton>
					</Link>
				</div>
			</div>
			<StarIcon className={styles.star} />
			<PiIcon className={styles.pi} />
			<EnergyIcon className={styles.energy} />
			<PaperPlaneIcon className={styles.paperPlane} />
			<BaskharaIcon className={styles.baskhara} />
			<StarIcon className={styles.star2} />
		</main>
	);
}
