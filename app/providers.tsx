"use client";
import { CSSProperties } from "react";
import { ThemeProvider } from "next-themes";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { Tag, TagProps } from "@/components/Attachment/Loader/Tag";

// Drag 'n Drop
import { DndProvider, Preview } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch"; // or any other pipeline

interface GeneratorProps {
    item: TagProps;
    style: CSSProperties;
}

const ComponentPreview = (): JSX.Element => {
    return (
        <Preview
            generator={({ item, style }: GeneratorProps): JSX.Element => {
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
                attribute="class"
                defaultTheme="light"
                /* defaultTheme="system"
				enableSystem */
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
