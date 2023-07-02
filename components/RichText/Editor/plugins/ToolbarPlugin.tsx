"use client";
import { useCallback, useEffect, useState } from "react";

import { $isLinkNode } from "@lexical/link";
import {
    $getSelection,
    FORMAT_TEXT_COMMAND,
    LexicalEditor,
    RangeSelection,
    TextFormatType,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $isRangeSelected } from "../utils/$isRangeSelected";
import { TOGGLE_EDIT_LINK_MENU } from "./EditLink";

import {
    StrikethroughIcon,
    FontBoldIcon,
    FontItalicIcon,
    LinkBreak1Icon,
    UnderlineIcon,
    Pencil1Icon,
    Link1Icon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/ui";

interface Props {
    editor: LexicalEditor;
    values: {
        isBold: boolean;
        isItalic: boolean;
        isStrikethrough: boolean;
        isUnderline: boolean;
        isHighlight: boolean;
        isLink: boolean;
    };
}

function Toolbar({ editor, values }: Props) {
    return (
        <div
            className={
                "flex px-3 py-1 gap-1.5 justify-center items-center self-stretch rounded-md bg-primary-03"
            }
            aria-label="Formatting options"
        >
            <ToolbarItem
                isActive={values.isBold}
                aria-label="Bold"
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
                }
            >
                <FontBoldIcon color="var(--neutral)" />
            </ToolbarItem>
            <ToolbarItem
                isActive={values.isItalic}
                aria-label="Italic"
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
                }
            >
                <FontItalicIcon color="var(--neutral)" />
            </ToolbarItem>
            <ToolbarItem
                isActive={values.isStrikethrough}
                aria-label="Strike through"
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
                }
            >
                <StrikethroughIcon color="var(--neutral)" />
            </ToolbarItem>
            <ToolbarItem
                isActive={values.isHighlight}
                aria-label="Highlight"
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight")
                }
            >
                <Pencil1Icon color="var(--neutral)" fontSize={"1.2rem"} />
            </ToolbarItem>
            <div className="w-[0.75px] h-[50%] rounded bg-neutral mx-[10px] pointer-events-none select-none" />
            <ToolbarItem
                isActive={values.isLink}
                aria-label="Link"
                onClick={() =>
                    editor.dispatchCommand(TOGGLE_EDIT_LINK_MENU, undefined)
                }
            >
                {values.isLink ? (
                    <LinkBreak1Icon color="var(--neutral)" />
                ) : (
                    <Link1Icon color="var(--neutral)" />
                )}
            </ToolbarItem>
        </div>
    );
}

interface ToolbarItemProps extends React.HTMLAttributes<HTMLButtonElement> {
    isActive: boolean;
}

function ToolbarItem({ isActive, children, ...props }: ToolbarItemProps) {
    return (
        <button
            className={cn(
                "flex-shrink-0 flex-grow-0 basis-auto rounded inline-flex p-1 text-[13px] leading-none items-center justify-center bg-transparent outline-none hover:bg-primary-04 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-primary-04 first:ml-0 data-[state=on]:bg-primary-04",
                isActive && "bg-primary-04"
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export default function ToolbarPlugin() {
    const [isBold, setIsBold] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isHighlight, setIsHighlight] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const [editor] = useLexicalComposerContext();

    const updateMenu = useCallback(() => {
        editor.getEditorState().read(() => {
            if (
                editor.isComposing() ||
                editor.getRootElement() !== document.activeElement
            )
                return;

            const selection = $getSelection() as RangeSelection;

            /* if ($isRangeSelected(selection)) { */
            const nodes = selection.getNodes();
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsHighlight(selection.hasFormat("highlight"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
            setIsLink(nodes.every((node) => $isLinkNode(node.getParent())));
            /* } */
        });
    }, [editor]);

    // Rerender the menu automatically on every state update.
    // Needed to show correct state for active formatting state.
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            updateMenu();
        });
    }, [editor, updateMenu]);

    //console.log("ToolbarPlugin", { isBold, isItalic, isUnderline, isLink });

    return (
        <Toolbar
            editor={editor}
            values={{
                isBold,
                isItalic,
                isStrikethrough,
                isUnderline,
                isHighlight,
                isLink,
            }}
        />
    );
}
