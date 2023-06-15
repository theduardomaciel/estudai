import Link from "next/link";

// Sections
import LandingHeader from "@/components/Landing/Header";
import LandingFooter from "@/components/Landing/Footer";

// Stylesheets
import styles from "styles/Landing.module.css";

// Components
import Note from "@/components/Landing/Note";
import RedirectButton, { ICON_PROPS } from "@/components/Button/Redirect";
import Device from "@/components/Landing/Device";

// Icons
import StarIcon from "/public/landing/star.svg";
import PiIcon from "/public/landing/pi.svg";
import EnergyIcon from "/public/landing/energy.svg";
import PaperPlaneIcon from "/public/landing/paper_plane.svg";
import BaskharaIcon from "/public/landing/baskhara.svg";

import ArrowRightIcon from "@material-symbols/svg-600/rounded/arrow_right_alt.svg";

// Fonts
import { karla } from "../fonts";

// Internationalization
import { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/hooks";

export const metadata = {
	title: "estudaí",
	description:
		"Uma plataforma de organização de estudos online que o ajudará a revisar e manter suas matérias em dia. Chega de esquecimentos.",
};

export default async function Landing({
	params: { lang },
}: {
	params: { lang: Locale };
}) {
	const t = useTranslations();

	return (
		<main className={`${styles.holder} ${karla.variable}`}>
			<LandingHeader>
				<Note
					showOnlyInDesktop={true}
					tag={`${t.landing.early_access_new} v0.1`}
					description={{
						landscape: t.landing.early_access_landscape,
						portrait: t.landing.early_access_portrait,
					}}
				/>
			</LandingHeader>

			<StarIcon className={styles.star} />
			<PiIcon className={styles.pi} />
			<EnergyIcon className={styles.energy} />
			<PaperPlaneIcon className={styles.paperPlane} />
			<BaskharaIcon className={styles.baskhara} />
			<StarIcon className={styles.star2} />

			<div className={styles.container}>
				<Note
					showOnlyInMobile={true}
					tag={`${t.landing.early_access_new} v0.1`}
					description={{
						landscape: t.landing.early_access_landscape,
						portrait: t.landing.early_access_portrait,
					}}
				/>
				<div className={styles.title}>
					<h1>{t.landing.title}</h1>
					<p>{t.landing.subtitle}</p>
					<Link href={"/register"}>
						<RedirectButton>
							{t.landing.button}
							<ArrowRightIcon className="icon" fontSize={20} />
						</RedirectButton>
					</Link>
				</div>
				<Device />
			</div>

			<LandingFooter />
		</main>
	);
}
