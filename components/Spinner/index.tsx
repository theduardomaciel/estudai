import styles from "./spinner.module.css";

interface Props {
	color: string;
	size?: number;
	className?: string;
}

export default function Spinner({ color, size, className }: Props) {
	const parentStyle = {
		width: size ? `${size}rem` : "2.5rem",
		height: size ? `${size}rem` : "2.5rem",
	};
	const childrenStyle = {
		width: size ? `${size - size / 5}rem` : "2rem",
		height: size ? `${size - size / 5}rem` : "2rem",
		borderColor: `${
			color ? color : "var(--neutral)"
		} transparent transparent transparent`,
	};

	return (
		<div className={`${styles.loader} ${className}`} style={parentStyle}>
			<div style={childrenStyle} />
			<div style={childrenStyle} />
		</div>
	);
}
