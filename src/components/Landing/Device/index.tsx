import Image from 'next/image'
import styles from './device.module.css'

// Images
import MobileScreenshot from "/public/images/portrait_screenshot.png";
import DesktopScreenshot from "/public/images/landscape_screenshot.png";
import { useScreenSize } from '../../../hooks/useScreenSize';

interface Props {
    additionalClass?: string;
}

export default function Device(props: Props) {
    const { isScreenWide } = useScreenSize();

    const width = isScreenWide ? 996 : 290;
    const height = isScreenWide ? 560 : 600;

    return (
        <div id={props.additionalClass} className={`${styles.container} ${props.additionalClass}`}>
            <div className={styles.image}>
                <Image
                    className={styles.imageS}
                    src={isScreenWide ? DesktopScreenshot : MobileScreenshot}
                    width={width}
                    height={height}
                />
            </div>
        </div>
    )
}