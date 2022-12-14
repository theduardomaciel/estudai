import { useEffect, useRef, useState } from 'react'

import styles from './calendar.module.css'
import Link from 'next/link';

interface Props {
    userId?: number;
    initialDate?: Date;
    hasMonthSelector?: boolean;
    setDate?: any;
    linkToCreate?: boolean;
}

// Funções do blog do: https://bobbyhadz.com/

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function getLastDateOfMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export default function Calendar(props: Props) {

    // Dates
    const date = new Date();
    const initialDate = props.initialDate ? new Date(props.initialDate) : null;

    // Specific Dates
    const currentYear = date.getFullYear();
    const currentMonth = useRef(initialDate ? initialDate.getMonth() : date.getMonth());
    const initialFirstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth.current)

    // Calendar
    const calendarLength = initialFirstDayOfMonth > 4 ? 42 : 35;
    const [calendar, setCalendar] = useState(new Array(calendarLength).fill('default'))

    // Date Selection
    const initialMonthDay = initialDate?.getDate() as number;
    const [selected, setSelected] = useState<number | undefined>(initialMonthDay + initialFirstDayOfMonth - 1);

    // Functions
    const isBeforeMonth = (day: number) => {
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth.current)

        return day < firstDayOfMonth
    };

    const isAfterMonth = (day: number) => {
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth.current)
        const lastDateOfMonth = getLastDateOfMonth(currentYear, currentMonth.current);

        return day > lastDateOfMonth + firstDayOfMonth
    };

    const getDay = (index: number) => {
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth.current)
        const lastDateOfMonth = getLastDateOfMonth(currentYear, currentMonth.current);
        const lastDateOfLastMonth = getLastDateOfMonth(currentYear, currentMonth.current - 1)

        /* if (isBeforeMonth(index)) {
            console.log('O index está antes do começo do mês atual.')
            return lastDateOfLastMonth - (firstDayOfMonth - 1) + index
        } else if (isAfterMonth(index + 1)) {
            console.log('O index está depois do começo do mês atual.')
            return (index - firstDayOfMonth) - lastDateOfMonth + 1
        } else {
            console.log('O index está no mês atual.')
            return index - firstDayOfMonth + 1;
        } */

        return isBeforeMonth(index) ?
            lastDateOfLastMonth - (firstDayOfMonth - 1) + index
            :
            isAfterMonth(index + 1) ?
                (index - firstDayOfMonth) - lastDateOfMonth + 1
                :
                index - firstDayOfMonth + 1;
    }

    function updateCalendar() {
        let newCalendar = [...calendar];

        calendar.forEach((string, index) => {
            const beforeMonth = isBeforeMonth(index);
            const afterMonth = isAfterMonth(index + 1);

            if (beforeMonth || afterMonth) {
                newCalendar[index] = "outsideRange"
            } else if (currentMonth.current === date.getMonth() && getDay(index) === date.getDate()) {
                newCalendar[index] = 'today'
            } else {
                newCalendar[index] = 'default'
            }
        })
        setCalendar(newCalendar)
    }

    useEffect(() => {
        updateCalendar()
    }, [])

    function decreaseMonth() {
        if (currentMonth.current > 0) {
            currentMonth.current -= 1;

            setSelected(undefined)
            updateCalendar()
        }
    }

    function increaseMonth() {
        if (currentMonth.current < 11) {
            currentMonth.current += 1;

            setSelected(undefined)
            updateCalendar()
        }
    }

    function setDate(index: number, day: number, month: number) {
        console.log("Dia: ", day, "Mês: ", month, 'Index: ', index)
        setSelected(index)
        if (props.setDate) {
            const newDate = `${currentYear}-${month}-${day}`;
            console.log(newDate)
            props.setDate(newDate)
        }
    }

    return (
        <div className={styles.holder}>
            {
                props.hasMonthSelector &&
                <div style={{ justifyContent: "space-between" }} className={`${styles.days} row`}>
                    {
                        currentMonth.current !== 0 ?
                            <span className={`material-icons-rounded click static`} onClick={decreaseMonth}>chevron_left</span>
                            : <div style={{ width: 24 }}></div>
                    }
                    <p>{months[currentMonth.current]}</p>
                    {
                        currentMonth.current !== 11 ?
                            <span className={`material-icons-rounded click static `} onClick={increaseMonth}>chevron_right</span>
                            : <div style={{ width: 24 }}></div>
                    }
                </div>
            }
            {
                /* calendarLength <= 35 && */
                <div style={{ justifyContent: "space-between" }} className={`${styles.days} row`}>
                    <p>D</p>
                    <p>S</p>
                    <p>T</p>
                    <p>Q</p>
                    <p>Q</p>
                    <p>S</p>
                    <p>S</p>
                </div>
            }
            <ul className={styles.calendar}>
                {
                    calendar.map((dayStatus, index) => {
                        const day = getDay(index)
                        const calendarMonth = isBeforeMonth(index) ? currentMonth.current : isAfterMonth(index + 1) ? currentMonth.current + 2 : currentMonth.current + 1;

                        return props.linkToCreate ?
                            <Link
                                key={index.toString()}
                                href={{
                                    pathname: '/task/new',
                                    query: {
                                        date: `${currentYear}-${calendarMonth}-${day + 1}`
                                    },
                                }}
                                as={`/task/new`}
                            >
                                <li
                                    onMouseEnter={(event) => !props.setDate ? event.currentTarget.textContent = "+" : ""}
                                    onMouseLeave={(event) => !props.setDate ? event.currentTarget.textContent = day.toString() : ""}
                                    className={`${styles.day} ${styles[dayStatus]} ${index === selected ? styles.selected : ""}`}
                                    onClick={() => setDate(index, day, calendarMonth)}
                                >
                                    {day}
                                </li>
                            </Link>
                            :
                            <li
                                key={index.toString()}
                                onMouseEnter={(event) => !props.setDate ? event.currentTarget.textContent = "+" : ""}
                                onMouseLeave={(event) => !props.setDate ? event.currentTarget.textContent = day.toString() : ""}
                                className={`${styles.day} ${styles[dayStatus]} ${index === selected ? styles.selected : ""}`}
                                onClick={() => setDate(index, day, calendarMonth)}
                            >
                                {day}
                            </li>
                    })
                }
            </ul>
        </div>
    )
}