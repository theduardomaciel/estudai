import Image from 'next/image'

// Imports
import placeholder from '/public/images/user_placeholder.jpg';

// Stylesheet
import styles from './profile.module.css'

// Components
import Button from '../Button'

// Types
import { User } from '../../types/User';

interface Props {
    onClick?: () => void;
    user?: User;
}

export default function Profile(props: Props) {

    function getGreetings() {
        const now = new Date();
        const actualHour = now.getHours()

        if (actualHour > 4 && actualHour <= 11) {
            return "Bom dia,"
        } else if (now.getHours() > 11 && actualHour <= 18) {
            return "Boa tarde,"
        } else if (now.getHours() > 18) {
            return "Boa noite,"
        } else {
            return "Bem vindo,"
        }
    }

    return (
        <div className={styles.holder}>
            <div className={styles.profile}>
                <div className={styles.image}>
                    <Image
                        src={props.user?.image_url || placeholder}
                        width={42}
                        height={42}
                    />
                </div>

                <div className={styles.text}>
                    <p>{getGreetings()}</p>
                    <p>{`${props.user?.firstName} ${props.user?.lastName}`}</p>
                </div>
            </div>
            <div className={styles.row2}>
                <div className={styles.pendingReminder}>
                    <span className="material-symbols-rounded">notifications_active</span>
                    <p>Você tem <span> 6 atividades </span> pendentes.</p>
                    <div className={styles.progressHolder}>
                        <p>61%</p>
                        <div className={styles.progressBar}>
                            <div />
                            <div />
                        </div>
                    </div>
                </div>
                <Button classes={styles.openMenu} onClick={props.onClick} icon={"menu"} />
            </div>
        </div>
    )
}