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
                <span className={'material-symbols-rounded'} style={{ fontSize: "2.8rem", color: "var(--light", padding: "0rem" }}>{icon ? icon : 'report'}</span>
            </div>

            <h2>{title}</h2>
            {
                description &&
                <p>{description}</p>
            }
            <Button
                onClick={() => router.push(`/home`)}
                title={returnButtonText ? returnButtonText : "VOLTAR PARA O INÍCIO"}
                icon={'subdirectory_arrow_left'}
                iconProps={{ size: "1.3rem" }}
                style={{
                    padding: `1.25rem 1.75rem`,
                    backgroundColor: "var(--primary-02)",
                    borderRadius: "0.5rem",
                    fontFamily: "Karla",
                    fontSize: "1.4rem"
                }}
            />
        </div>
    )
}

export default ErrorContainer;