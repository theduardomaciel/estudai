import Image from "next/image";
import styles from "./device.module.css";

// Images
import MobileScreenshot from "/public/images/portrait_screenshot.png";
import DesktopScreenshot from "/public/images/landscape_screenshot.png";

interface Props {
	additionalClass?: string;
}

export default function Device({ additionalClass }: Props) {
	return (
		<div
			id={additionalClass}
			className={`${styles.container} ${additionalClass}`}
		>
			<div className={styles.imageHolder}>
				<div className={styles.landscape}>
					<Image
						alt="Screenshot em paisagem do app"
						width={1366}
						height={768}
						src={DesktopScreenshot}
					/>
				</div>
				<div className={styles.portrait}>
					<Image
						alt="Screenshot em retrato do app"
						src={MobileScreenshot}
					/>
				</div>
			</div>
		</div>
	);
}
