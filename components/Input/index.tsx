import * as LabelPrimitive from '@radix-ui/react-label';
import { MouseEvent, useEffect } from 'react';
import { useRef } from 'react';
import Translate from '../Translate';

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
    icon?: string;
}
const Input = ({ label, fixedUnit, height, numberControl, icon, ...rest }: Props) => {
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

    return <div className={styles.flex} key={'inputContainer'}>
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
                            <span className={`click material-icons-rounded ${styles.increaseArrow}`} onClick={increaseCount}>expand_less</span>
                            <span className={`click material-icons-rounded ${styles.decreaseArrow}`} onClick={decreaseCount}>expand_more</span>
                        </div>
                    }
                    <input
                        name='maxScore'
                        key={'input'}
                        style={{ height: height ? height : "3.8rem", textAlign: numberControl ? "end" : "start", paddingRight: "7.5rem" }}
                        className={styles.input}
                        ref={input}
                        {...rest}
                    />
                    <div className={`${styles.input} ${styles.fixedUnit}`}>
                        <Translate>{fixedUnit}</Translate>
                    </div>
                </div>
                :
                icon ?
                    <div className={styles.fixedUnitFrame}>
                        {
                            icon &&
                            <span style={{ fontSize: "1.8rem" }} className={`static material-icons-rounded ${styles.icon}`}>{icon}</span>
                        }
                        <input style={{ height: height ? height : "3.8rem", paddingLeft: "3.4rem" }} className={styles.input} key={'taskNAme'} id="taskName" {...rest} />
                    </div>
                    :
                    <input style={{ height: height ? height : "3.8rem", }} className={styles.input} key={'taskNAme'} id="taskName" {...rest} />
        }

    </div>
}

export default Input;