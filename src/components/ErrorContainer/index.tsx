import { useRouter } from "next/router";

// Imports
import styles from "./error.module.css"

// Components
import Button from "../Button";

type Props = {
    icon?: string;
    title: string;
    description?: string;
    returnButtonText?: string;
}

const ErrorContainer = ({ icon, title, description, returnButtonText }: Props) => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.iconHolder}>
                <span className={'material-symbols-rounded'} style={{ fontSize: "4.8rem", color: "var(--light" }}>{icon}</span>
            </div>

            <h2>{title}</h2>
            {
                description &&
                <p>{description}</p>
            }
            <Button
                onClick={() => router.back()}
                title={returnButtonText ? returnButtonText : "VOLTAR PARA O INÍCIO"}
                icon={'subdirectory_arrow_left'}
                style={{
                    padding: `0.5rem 1.5rem`
                }}
            />
        </div>
    )
}

export default ErrorContainer;