"use client";

import styles from "./modal.module.css";
import React, { FC, ReactElement, SVGProps } from "react";

import { AnimatePresence, MotionStyle, motion } from "framer-motion";

// Components
import Button from "../Button";

import CloseIcon from "@material-symbols/svg-600/rounded/close.svg";
import ArrowBack from "@material-symbols/svg-600/rounded/arrow_back.svg";

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
		position?: "flex-start" | "center" | "flex-end";
		builtWithTitle?: boolean;
	};

	actionProps?: {
		buttonText: string;
		disabled?: boolean;
		function?: () => void;
		buttonIcon?: FC<SVGProps<HTMLOrSVGElement>>;
		isForm?: boolean;
	};

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
						<div className={styles.headerContainer}>
							<div
								className={styles.headerContainer}
								style={{
									justifyContent: iconProps?.position
										? iconProps?.position
										: "center",
								}}
							>
								{true && (
									<div
										style={{ backgroundColor: color }}
										className={styles.iconHolder}
									>
										<Icon
											className="icon"
											color={iconProps?.color}
											fontSize={iconProps?.size}
										/>
									</div>
								)}
								{iconProps?.builtWithTitle && (
									<h2
										style={{
											textAlign: "left",
											fontSize:
												iconProps?.size ?? "3.8rem",
											lineHeight: "3.25rem",
										}}
									>
										{title}
									</h2>
								)}
							</div>
							{iconProps?.position === "flex-start" &&
								!isLoading && (
									<CloseIcon
										style={{ justifySelf: "flex-end" }}
										color="var(--primary-02)"
										fontSize={iconProps?.size ?? "4.8rem"}
										onClick={toggleVisibility}
									/>
								)}
						</div>

						{title && !iconProps?.builtWithTitle && (
							<h2
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
								{!suppressReturnButton &&
									!isLoading /* && iconProps?.position !== "flex-start" */ && (
										<Button
											onClick={toggleVisibility}
											style={{
												textTransform: "uppercase",
												background: color
													? color ===
													  "var(--primary-02)"
														? "var(--primary-04)"
														: "var(--font-light)"
													: "var(--primary-02)",
												padding: `0.7rem 1.5rem`,
											}}
											accentColor={
												color && "var(--light-gray)"
											}
										>
											{actionProps?.function
												? `Cancel`
												: `Return`}
											{actionProps?.function ? (
												<CloseIcon className={`icon`} />
											) : (
												<ArrowBack className={`icon`} />
											)}
										</Button>
									)}
								{actionProps?.function && (
									<Button
										onClick={actionProps?.function}
										disabled={actionProps?.disabled}
										isLoading={isLoading}
										/* disableHoverEffect={
											actionProps?.disabled
										} */
										style={{
											background: !actionProps?.disabled
												? color
												: "var(--light-gray)",
											padding: `0.7rem 1.5rem`,
											textTransform: "uppercase",
											cursor:
												actionProps.disabled ||
												isLoading
													? "not-allowed"
													: "pointer",
										}}
										accentColor={color && color}
									>
										{actionProps?.buttonIcon && (
											<actionProps.buttonIcon
												className={`icon`}
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