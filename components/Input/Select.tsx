import { styled } from "@stitches/react";
import * as SelectPrimitive from "@radix-ui/react-select";

import styles from "./label.module.css";
import React from "react";

const StyledTrigger = (props: SelectPrimitive.SelectTriggerProps) => (
	<SelectPrimitive.SelectTrigger
		className={styles.input}
		style={{
			display: "inline-flex",
			justifyContent: "space-between",
			paddingInline: "2rem",
			paddingBlock: "2rem",
			textAlign: "left",
			wordBreak: "break-all",
			fontSize: "1.3rem",
		}}
		{...props}
	>
		{props.children}
	</SelectPrimitive.SelectTrigger>
);

interface Content {
	children: React.ReactNode | any;
}

function Content({ children, ...props }: Content) {
	return (
		<SelectPrimitive.Portal style={{ zIndex: 10 }}>
			<StyledContent {...props}>{children}</StyledContent>
		</SelectPrimitive.Portal>
	);
}

const StyledIcon = styled(SelectPrimitive.SelectIcon, {
	color: "var(--primary-03)",
});

const StyledContent = styled(SelectPrimitive.Content, {
	overflow: "hidden",
	backgroundColor: "var(--neutral)",
	borderRadius: "1rem",
	boxShadow:
		"0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
	padding: "2rem 1.2rem",
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
	position: "absolute",
	left: 0,
	width: 25,
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
});

const StyledItem = styled(SelectPrimitive.Item, {
	all: "unset",
	fontSize: 13,
	lineHeight: 1,
	color: "var(--primary-03)",
	borderRadius: 3,
	display: "flex",
	alignItems: "center",
	height: "3.5rem",
	padding: "0 3.5rem 0 2.5rem",
	position: "relative",
	userSelect: "none",

	"&[data-disabled]": {
		color: "var(--font-light)",
		/* pointerEvents: 'none', */
		cursor: "not-allowed",
	},

	"&[data-highlighted]": {
		backgroundColor: "var(--primary-03)",
		color: "var(--neutral)",
	},
});

const StyledLabel = styled(SelectPrimitive.Label, {
	padding: "0px 1rem",
	fontSize: "1.6rem",
	lineHeight: "2.5rem",
	color: "var(--primary-03)",
	marginBottom: "1rem",
});

const scrollButtonStyles = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "2.5rem",
	backgroundColor: "var(--neutral)",
	color: "var(--primary-02)",
	cursor: "default",
};

const StyledSeparator = styled(SelectPrimitive.Separator, {
	height: 1,
	backgroundColor: "var(--primary-04)",
	margin: "2rem 0.5rem",
});

const StyledScrollUpButton = styled(
	SelectPrimitive.ScrollUpButton,
	scrollButtonStyles
);

const StyledScrollDownButton = styled(
	SelectPrimitive.ScrollDownButton,
	scrollButtonStyles
);

export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = SelectPrimitive.Value;
export const SelectIcon = StyledIcon;
export const SelectContent = Content;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectSeparator = StyledSeparator;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;
