import { useEffect, useState } from 'react'
import Image from 'next/image'

// Components
import Button from '../Button'

import styles from './calendar.module.css'

interface Props {
    hasMonthSelector?: boolean;
    onClick?: () => void;
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

/* // 👇️ Other Months
const daysInJanuary = getDaysInMonth(2025, 1);
console.log(daysInJanuary); // 👉️ 31 */

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export default function Calendar(props: Props) {

    const date = new Date();
    const currentYear = date.getFullYear();
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());

    // Dias no mês atual
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    //console.log("mês atual:", months[currentMonth])

    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    //console.log("primeiro dia do mês atual :", firstDayOfMonth)

    const lastDateOfMonth = getLastDateOfMonth(currentYear, currentMonth);

    const lastDateOfLastMonth = getLastDateOfMonth(currentYear, currentMonth - 1)
    //console.log("último dia do mês passado: ", lastDateOfLastMonth)

    const calendarLength = firstDayOfMonth > 4 ? 42 : 35;
    let calendar = new Array(calendarLength).fill('default')

    const isBeforeMonth = (day: number) => day < firstDayOfMonth;
    const isAfterMonth = (day: number) => day > lastDateOfMonth + firstDayOfMonth

    for (let index = 0; index < calendarLength; index++) {
        if (isBeforeMonth(index) || isAfterMonth(index + 1)) {
            calendar[index] = "outsideRange"
        }
    }
    console.log(calendar)

    function decreaseMonth() {
        if (currentMonth > 0) {
            setCurrentMonth(currentMonth - 1)
        }
    }

    function increaseMonth() {
        if (currentMonth < 11) {
            setCurrentMonth(currentMonth + 1)
        }
    }

    function setDate(day: number, month: number) {
        console.log("Dia: ", day, "Mês: ", month)
    }

    return (
        <div className={styles.holder}>
            {
                props.hasMonthSelector &&
                <div style={{ justifyContent: "space-between" }} className={`${styles.days} row`}>
                    {
                        currentMonth !== 0 ?
                            <span className={`material-symbols-rounded click static`} onClick={decreaseMonth}>chevron_left</span>
                            : <div style={{ width: 24 }}></div>
                    }
                    <p>{months[currentMonth]}</p>
                    {
                        currentMonth !== 11 ?
                            <span className={`material-symbols-rounded click static `} onClick={increaseMonth}>chevron_right</span>
                            : <div style={{ width: 24 }}></div>
                    }
                </div>
            }
            <div style={{ justifyContent: "space-between" }} className={`${styles.days} row`}>
                <p>D</p>
                <p>S</p>
                <p>T</p>
                <p>Q</p>
                <p>Q</p>
                <p>S</p>
                <p>S</p>
            </div>
            <ul className={styles.calendar}>
                {
                    calendar.map((dayStatus, index) => {
                        const day = isBeforeMonth(index) ?
                            lastDateOfLastMonth - (firstDayOfMonth - 1) + index
                            :
                            isAfterMonth(index + 1) ?
                                (index - firstDayOfMonth) - lastDateOfMonth + 1
                                :
                                index - firstDayOfMonth + 1

                        const calendarMonth = isBeforeMonth(index) ? currentMonth : isAfterMonth(index + 1) ? currentMonth + 2 : currentMonth + 1;

                        return <li key={index} className={`${styles.day} ${styles[dayStatus]}`} onClick={() => setDate(day, calendarMonth)}>
                            {day}
                        </li>
                    })
                }
            </ul>
        </div>
    )
}