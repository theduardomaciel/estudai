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
    user: User;
    showMenu?: boolean;
}

export default function Profile({ user, onClick, showMenu }: Props) {

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

    const actualDate = new Date();
    const now = actualDate.getTime();

    const pendingTasksLength = user?.tasks
        .filter((task, index) => {
            const notInteracted = task.interactedBy.find((taskUser, i) => taskUser.id === user?.id) ? false : true;
            if (task.date > now && notInteracted) {
                return true
            } else {
                return false
            }
        })
        .length;

    const completedTasksLength = user?.tasks
        .filter((task, index) => {
            const hasInteracted = task.interactedBy.find((taskUser, i) => taskUser.id === user?.id) ? true : false;
            if (task.date > now && hasInteracted) {
                return true
            } else {
                return false
            }
        })
        .length;

    const completedPercentage = (completedTasksLength * 100) / (pendingTasksLength + completedTasksLength);

    return (
        <div className={styles.holder}>
            <div className={styles.profile}>
                <div className={styles.image}>
                    <Image
                        src={user?.image_url || placeholder}
                        width={42}
                        height={42}
                        alt='Avatar do usuário'
                    />
                </div>

                <div className={styles.text}>
                    <p>{getGreetings()}</p>
                    <p>{`${user?.firstName} ${user?.lastName}`}</p>
                </div>
            </div>
            <div className={styles.row2}>
                <div className={styles.pendingReminder}>
                    <span className="material-symbols-rounded">notifications_active</span>
                    <p>Você tem <span>{`${pendingTasksLength} atividade${pendingTasksLength !== 1 ? "s" : ""}`}</span> pendente{pendingTasksLength !== 1 ? "s" : ""}</p>
                    <div className={styles.progressHolder}>
                        <p>{completedPercentage}%</p>
                        <div className={styles.progressBar}>
                            <div style={{ width: `${completedPercentage}%` }} />
                            <div />
                        </div>
                    </div>
                </div>
                {showMenu && <Button classes={styles.openMenu} onClick={onClick} icon={"menu"} />}
            </div>
        </div>
    )
}