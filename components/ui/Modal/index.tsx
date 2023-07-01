"use client";

import styles from "./modal.module.css";
import React, { FC, SVGProps } from "react";

import { AnimatePresence, MotionStyle, motion } from "framer-motion";

// Components
import Button from "../Button";

import CloseIcon from "@material-symbols/svg-600/rounded/close.svg";
import ArrowBack from "@material-symbols/svg-600/rounded/arrow_back.svg";
import { Translations } from "@/i18n/hooks";

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
	isVisible: boolean;
	style?: MotionStyle;
	toggleVisibility: () => void;

	color: string;
	title?: string;
	description?: React.ReactNode;

	icon: FC<SVGProps<HTMLOrSVGElement>>;
	iconProps?: {
		color?: string;
		size?: number | string;
	};

	actionProps?: {
		buttonText: string;
		disabled?: boolean;
		function?: () => void;
		buttonIcon?: FC<SVGProps<HTMLOrSVGElement>>;
		isForm?: boolean;
	};

	dict: Translations["modal"]["default"];

	isLoading?: boolean;
	suppressReturnButton?: boolean;
};

export default function Modal({
	isVisible,
	toggleVisibility,
	style,
	color,
	isLoading,
	icon: Icon,
	title,
	description,
	suppressReturnButton,
	iconProps,
	actionProps,
	children,
	dict,
	...rest
}: ModalProps) {
	const handleClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		const target = event.nativeEvent.target as HTMLDivElement;
		if (target.id === "background" && !isLoading) {
			toggleVisibility();
		}
	};

	return (
		<AnimatePresence mode="wait">
			{isVisible && (
				<motion.div
					className={styles.background}
					key="modal"
					id="background"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					onClick={(event) => handleClick(event)}
				>
					<motion.div
						className={styles.container}
						key="modalContent"
						style={style}
						initial={{ y: 300, x: 0, opacity: 0 }}
						animate={{ y: 0, x: 0, opacity: 1 }}
						exit={{ y: 300, x: 0, opacity: 0 }}
						transition={{ type: "spring", duration: 0.65 }}
					>
						<div className={styles.headerHolder}>
							<div className={styles.headerContainer}>
								<div
									style={{ backgroundColor: color }}
									className={styles.iconHolder}
								>
									<Icon
										className="icon"
										color={iconProps?.color}
										fontSize={iconProps?.size ?? "3.6rem"}
									/>
								</div>
								{title && (
									<h2
										id="desktop"
										style={{
											fontSize:
												iconProps?.size ?? "3.8rem",
										}}
									>
										{title}
									</h2>
								)}
							</div>
							{!isLoading && (
								<CloseIcon
									className={`${styles.closeIcon} icon`}
									color="var(--primary-02)"
									fontSize={iconProps?.size ?? "4.8rem"}
									onClick={toggleVisibility}
								/>
							)}
						</div>

						{title && (
							<h2
								id="mobile"
								style={{
									color: color ? color : "var(--primary-02)",
								}}
							>
								{title}
							</h2>
						)}
						{description && (
							<p
								className={styles.description}
								style={{
									color: color ? color : "var(--primary-02)",
								}}
							>
								{description}
							</p>
						)}

						{children}

						{!actionProps?.isForm && (
							<div className={styles.buttonsHolder}>
								{!suppressReturnButton && !isLoading && (
									<Button
										onClick={toggleVisibility}
										className="uppercase px-6 py-[0.7rem]"
										preset="secondary"
									>
										{actionProps?.function ? (
											<CloseIcon
												className={`icon`}
												fontSize={`2.4rem`}
											/>
										) : (
											<ArrowBack
												className={`icon`}
												fontSize={`2.4rem`}
											/>
										)}
										{actionProps?.function
											? dict.cancel
											: dict.return}
									</Button>
								)}
								{actionProps?.function && (
									<Button
										onClick={actionProps?.function}
										disabled={
											actionProps?.disabled || isLoading
										}
										isLoading={isLoading}
										style={{
											background: actionProps?.disabled
												? "var(--light-gray)"
												: color,
											padding: `0.7rem 1.5rem`,
											textTransform: "uppercase",
										}}
									>
										{actionProps?.buttonIcon ? (
											<actionProps.buttonIcon
												className={`icon`}
												fontSize={"2.4rem"}
											/>
										) : (
											<Icon
												className={`icon`}
												fontSize={"2.4rem"}
											/>
										)}
										{actionProps?.buttonText}
									</Button>
								)}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
