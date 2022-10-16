import * as LabelPrimitive from '@radix-ui/react-label';
import { MouseEvent, useEffect } from 'react';
import { useRef } from 'react';

import styles from "./label.module.css"

interface InputLabelProps {
    label: string;
}

export const InputLabel = (props: InputLabelProps) => <LabelPrimitive.Root className={styles.label}>
    {props.label}
</LabelPrimitive.Root>

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    fixedUnit?: string;
    height?: string | number;
    numberControl?: boolean;
}
const Input = ({ label, fixedUnit, height, numberControl, ...rest }: Props) => {
    const input = useRef<HTMLInputElement | null>(null);

    function animateArrow(button: HTMLElement) {
        button.classList.toggle(styles.clicked)
        setTimeout(() => {
            button.classList.toggle(styles.clicked)
        }, 1000 * 0.1);
    }

    function increaseCount(event: MouseEvent<HTMLSpanElement>) {
        const button = event.target as HTMLDivElement;
        animateArrow(button)

        console.log('increasing', input.current)

        if (input.current && parseInt(input.current.value)) {
            input.current.value = (Math.max(0, parseInt(input.current.value) + 1)).toString()
        } else {
            if (input.current) {
                input.current.value = "0"
            }
        }
    }

    function decreaseCount(event: MouseEvent<HTMLSpanElement>) {
        const button = event.target as HTMLDivElement;
        animateArrow(button)

        if (input.current && parseInt(input.current.value)) {
            input.current.value = (Math.max(0, parseInt(input.current.value) - 1)).toString()
        } else {
            if (input.current) {
                input.current.value = "0"
            }
        }
    }

    return <div className={styles.flex}>
        {
            label &&
            <InputLabel label={label} />
        }
        {
            fixedUnit ?
                <div className={styles.fixedUnitFrame}>
                    {
                        numberControl &&
                        <div className={`${styles.increaseControl}`}>
                            <span className={`click material-symbols-rounded ${styles.increaseArrow}`} onClick={increaseCount}>expand_less</span>
                            <span className={`click material-symbols-rounded ${styles.decreaseArrow}`} onClick={decreaseCount}>expand_more</span>
                        </div>
                    }
                    <input
                        name='maxScore'
                        style={{ height: height ? height : "4.2rem", textAlign: numberControl ? "end" : "start", paddingRight: input.current ? `${Math.max(input.current.placeholder.length * 4.5, 7.5)}rem` : "7.5rem" }}
                        className={styles.input}
                        ref={input}
                        {...rest}
                    />
                    <div className={`${styles.input} ${styles.fixedUnit}`}>
                        {fixedUnit}
                    </div>
                </div>
                :
                <input style={{ height: height ? height : "4.2rem", }} className={styles.input} type="text" id="taskName" {...rest} />
        }

    </div>
}

export default Input;