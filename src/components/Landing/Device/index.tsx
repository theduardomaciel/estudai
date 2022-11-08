import Image from 'next/legacy/image'
import styles from './device.module.css'

// Images
import MobileScreenshot from "/public/images/portrait_screenshot.png";
import DesktopScreenshot from "/public/images/landscape_screenshot.png";

interface Props {
    additionalClass?: string;
}

export default function Device(props: Props) {
    return (
        <div id={props.additionalClass} className={`${styles.container} ${props.additionalClass}`}>
            <div className={styles.imageHolder}>
                <div className={styles.landscape}
                >
                    <Image
                        alt='Screenshot em paisagem do app'
                        src={DesktopScreenshot}
                    />
                </div>
                <div className={styles.portrait}
                >
                    <Image
                        alt='Screenshot em retrato do app'
                        src={MobileScreenshot}
                    />
                </div>
            </div>
        </div>
    )
}