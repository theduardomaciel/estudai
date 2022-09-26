import * as LabelPrimitive from '@radix-ui/react-label';
import { useEffect } from 'react';
import { useRef } from 'react';

import styles from "./label.module.css"

// Icons
import LeftChevron from "/public/icons/left_chevron.svg";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    fixedUnit?: string;
    height?: string | number;
    numberControl?: boolean;
}

interface InputLabelProps {
    label: string;
}

export const InputLabel = (props: InputLabelProps) => <LabelPrimitive.Root className={styles.label}>
    {props.label}
</LabelPrimitive.Root>

const Input = (props: Props) => {
    const input = useRef<HTMLInputElement | null>(null);
    const fixedUnit = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (input.current && fixedUnit.current) {
            const fixedUnitWidth = fixedUnit.current?.offsetWidth as number;
            const inputHeight = input.current?.offsetHeight as number;
            input.current.style.paddingRight = `${fixedUnitWidth + 10}px`
            fixedUnit.current.style.height = `${inputHeight}px`
        }
    }, [])

    function animateArrow(button: HTMLElement) {
        button.classList.toggle(styles.clicked)
        setTimeout(() => {
            button.classList.toggle(styles.clicked)
        }, 1000 * 0.1);
    }

    function increaseCount(event: MouseEvent) {
        const button = event.target as HTMLDivElement;
        animateArrow(button)

        if (input.current && parseInt(input.current.value)) {
            input.current.value = (Math.max(0, parseInt(input.current.value) + 1)).toString()
        }
    }

    function decreaseCount(event: MouseEvent) {
        const button = event.target as HTMLDivElement;
        animateArrow(button)

        if (input.current && parseInt(input.current.value)) {
            input.current.value = (Math.max(0, parseInt(input.current.value) - 1)).toString()
        }
    }

    return <div className={styles.flex}>
        {
            props.label &&
            <InputLabel label={props.label} />
        }
        {
            props.fixedUnit ?
                <div style={{ display: "flex", flexDirection: "row", width: "100%", height: props.height }}>
                    {
                        props.numberControl && <div className={`${styles.increaseControl}`}>
                            <LeftChevron onClick={increaseCount} className={styles.increaseArrow} />
                            <LeftChevron onClick={decreaseCount} className={styles.decreaseArrow} />
                        </div>
                    }
                    <input
                        style={{ height: props.height ? "100%" : "3rem", textAlign: props.numberControl ? "end" : "start" }}
                        className={styles.input}
                        ref={input}
                        {...props}
                    />
                    <div ref={fixedUnit} className={`${styles.input} ${styles.fixedUnit}`}>
                        {props.fixedUnit}
                    </div>
                </div>
                :
                <input className={styles.input} type="text" id="taskName" {...props} />
        }

    </div>
}

export default Input;