import React, { SetStateAction, useRef, useState } from 'react';

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion"

// Style
import styles from './styles.module.css';

// Components
import Button from '../../Button';
import Image, { StaticImageData } from 'next/image';

interface Section {
    title: string;
    description: string;
    image_path: StaticImageData;
    imageSize: {
        width: number,
        height: number
    }
}

interface Props {
    /* actualSection: number;
    setActualSection: (section: number) => SetStateAction<boolean>; */
    sections: Array<Section>
}

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    }
};

/* const transition = {
    x: { type: "inertia", velocity: 50 },
    opacity: { duration: 1.65 },
    transition: {
        delayChildren: 1
    }
} */

const transition = {
    x: { type: "spring", stiffness: 100, damping: 30, mass: 2, duration: 0.8 },
    opacity: { duration: 0.75 },
}

export default function LandingIntroModal({ /* actualSection, setActualSection, */ sections }: Props) {
    const [[actualSection, direction], setActualSection] = useState([0, 1]);

    function hideModal() {
        const modal = document.getElementById("introModal");
        if (modal) {
            modal.style.opacity = "0";
            setTimeout(() => {
                modal?.remove();
            }, 500);
        }
    }

    function changeSection(factor?: number, directNumber?: number) {
        if (!factor && typeof directNumber === 'number') {
            if (directNumber > actualSection) {
                setActualSection([directNumber, 1])
            } else if (directNumber < actualSection) {
                setActualSection([directNumber, -1])
            }
        } else {
            console.log(factor, actualSection, sections.length)
            if (factor === 1 && actualSection < sections.length - 1) {
                setActualSection([actualSection + 1, 1])
            } else if (factor === -1 && actualSection > 0) {
                setActualSection([actualSection - 1, -1])
            } else {
                hideModal()
            }
        }
    }

    const sectionsModals = sections.map((section, index) => {
        return <motion.div
            id='introModal'
            className={styles.background}
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={styles.container}
                key={`modalContent_${index}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
            >
                <div className={styles.imageHolder}>
                    <Image src={section.image_path} height={section.imageSize.height} width={section.imageSize.width} priority />
                </div>
                <div className={styles.headerContainer}>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                </div>

                <div className={styles.circlesHolder}>
                    {
                        sections.map((_, i) => <div
                            key={i}
                            style={{ backgroundColor: actualSection === i ? "var(--primary-02)" : "var(--light-gray)" }}
                            onClick={() => changeSection(undefined, i)}
                        />)
                    }
                </div>

                <div className={styles.buttonsHolder}>
                    <Button
                        onClick={actualSection === 0 ? hideModal : () => changeSection(-1)}
                        title={actualSection === 0 ? 'Pular' : 'Anterior'}
                        style={{
                            padding: "1rem 2.5rem",
                            background: "var(--light)",
                            width: "100%",
                            border: "0.5px solid var(--light-gray)",
                            color: "var(--font-light)",
                            borderRadius: "0.75rem"
                        }}
                    />
                    <Button
                        onClick={() => changeSection(1)}
                        title={actualSection === sections.length - 1 ? 'Entrar na plataforma' : 'Próximo'}
                        style={{
                            padding: "1rem 2.5rem",
                            width: "100%",
                            background: "var(--primary-02)",
                            borderRadius: "0.75rem"
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    })

    return (
        <AnimatePresence mode='sync'>
            {sectionsModals[actualSection]}
        </AnimatePresence>
    );
}