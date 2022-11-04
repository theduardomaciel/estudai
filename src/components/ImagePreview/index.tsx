import Image from "next/image";
import { useRouter } from "next/router";

// Imports
import styles from "./error.module.css"

// Components
import Button from "../Button";

type Props = {
    imagesUrls: string[]
}

export default function ErrorContainer({ imagesUrls }: Props) {
    return (
        <div className={styles.container}>
            {/* {
                imagesUrls.map((image_url, index) => <Image
                    src={image_url}
                />)
            } */}
        </div>
    )
}