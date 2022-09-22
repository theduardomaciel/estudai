import { styled } from '@stitches/react';
import * as LabelPrimitive from '@radix-ui/react-label';

import styles from "./label.module.css"

interface Props {
    label?: string;
    fixedUnit?: string;
    inputPlaceholder?: string;
}

const Label = (props: Props) => (
    <div className={styles.flex}>
        {
            props.label &&
            <LabelPrimitive.Root className={styles.label}>
                {props.label}
            </LabelPrimitive.Root>
        }
        {
            props.fixedUnit ?
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <input
                        className={styles.input}
                        type="text"
                        id="taskName"
                        placeholder={props.inputPlaceholder}
                    />
                    <div className={`${styles.input} ${styles.fixedUnit}`}>
                        {props.fixedUnit}
                    </div>
                </div>
                :
                <input className={styles.input} type="text" id="taskName" placeholder={props.inputPlaceholder} />
        }

    </div>
);

export default Label;