"use client";

import { CSSProperties } from "react";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Drag 'n Drop
import { DndProvider, Preview } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch"; // or any other pipeline

import { Tag, TagProps } from "@/components/AttachmentLoader/Tag";
const ComponentPreview = (): JSX.Element => {
	return (
		<Preview
			generator={({
				itemType,
				item,
				style,
				ref,
			}: {
				itemType: any;
				item: TagProps;
				style: CSSProperties;
				ref: any;
			}): JSX.Element => {
				return (
					<Tag tagId={item.tagId} index={item.index} style={style} />
				);
			}}
		/>
	);
};

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<GoogleOAuthProvider
			clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}
		>
			<ThemeProvider
				themes={["default", "red", "green", "blue", "yellow"]}
			>
				<DndProvider options={HTML5toTouch}>
					{children}
					<ComponentPreview />
				</DndProvider>
			</ThemeProvider>
		</GoogleOAuthProvider>
	);
}
