import React, { useCallback } from 'react'

import { Editor } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import { styled } from '@stitches/react';
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';

import styles from './toolbar.module.css'

// Icons
import {
    StrikethroughIcon,
    TextAlignLeftIcon,
    TextAlignCenterIcon,
    TextAlignRightIcon,
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
    Pencil1Icon
} from '@radix-ui/react-icons';


const itemStyles = {
    all: 'unset',
    flex: '0 0 auto',
    color: "var(--primary-03)",
    height: 25,
    padding: '0 5px',
    borderRadius: 4,
    display: 'inline-flex',
    fontSize: 13,
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { backgroundColor: "var(--primary-04)", filter: "brightness(1.2)", color: "var(--light)" },
    '&:focus': { position: 'relative', boxShadow: `0 0 0 2px ${"var(--primary-02)"}` },
};

const ToolbarSeparator = styled(ToolbarPrimitive.Separator, {
    width: 1,
    backgroundColor: "var(--primary-04)",
    margin: '0 1rem',
});

const ToolbarToggleGroup = styled(ToolbarPrimitive.ToggleGroup, {
    display: 'inline-flex',
    borderRadius: 4,
});

const ToolbarToggleItem = styled(ToolbarPrimitive.ToggleItem, {
    ...itemStyles,
    boxShadow: 0,
    backgroundColor: 'white',
    marginLeft: 2,
    '&:first-child': { marginLeft: 0 },
    '&.selected': { backgroundColor: "var(--primary-04)", color: "var(--light)" }
    /* '&[data-state=on]': { backgroundColor: "var(--primary-04)", color: "var(--light)" }, */
});

interface Props {
    editor: Editor
}

export default function FormatToolbar({ editor }: Props) {
    if (!editor) {
        return null
    }

    const isBold = editor.isActive('bold');
    const isItalic = editor.isActive('italic');
    const isStrike = editor.isActive('strike');
    const isUnderlined = editor.isActive('underline');

    const isLeft = editor.isActive({ textAlign: 'left' })
    const isCenter = editor.isActive({ textAlign: 'center' })
    const isRight = editor.isActive({ textAlign: 'right' })

    const isHighlighted = editor.isActive('highlight');

    /* const properties = [
        ...(isBold ? ['bold'] : []),
        ...(isItalic ? ['italic'] : []),
        ...(isStrike ? ['strikethrough'] : []),

        ...(isLeft ? ['left'] : []),
        ...(isCenter ? ['center'] : []),
        ...(isRight ? ['right'] : []),

        ...(isHighlighted ? ['highlight'] : []),
    ]; */

    return (
        <ToolbarPrimitive.Root className={styles.container} aria-label="Formatting options">
            <ToolbarToggleGroup
                type="single"
                aria-label="Text formatting"
                onValueChange={(value: string) => {
                    switch (value) {
                        case 'bold':
                            editor.chain().focus().toggleBold().run();
                            break;
                        case 'italic':
                            editor.chain().focus().toggleItalic().run();
                            break;
                        case 'strikethrough':
                            editor.chain().focus().toggleStrike().run();
                            break;
                        case 'underline':
                            editor.chain().focus().toggleUnderline().run();
                            break;
                    }
                }}
            /* onValueChange={(values: string[]) => {
                console.log(values)
                values.forEach(value => {
                    switch (value) {
                        case 'bold':
                            editor.chain().focus().toggleBold().run();
                            break;
                        case 'italic':
                            editor.chain().focus().toggleItalic().run();
                            break;
                        case 'strikethrough':
                            editor.chain().focus().toggleStrike().run();
                            break;
                    }
                });
            }} */
            /* value={properties} */
            >
                <ToolbarToggleItem value="bold" aria-label="Bold" className={isBold ? 'selected' : ""}>
                    <FontBoldIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="italic" aria-label="Italic" className={isItalic ? 'selected' : ""}>
                    <FontItalicIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="strikethrough" aria-label="Strike through"
                    className={isStrike ? 'selected' : ""}
                /* disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                } */
                >
                    <StrikethroughIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="underline" aria-label="Underline"
                    className={isUnderlined ? 'selected' : ""}
                >
                    <UnderlineIcon />
                </ToolbarToggleItem>
            </ToolbarToggleGroup>
            <ToolbarSeparator />
            <ToolbarToggleGroup type="single" defaultValue="left" aria-label="Text decoration" onValueChange={(value: string) => {
                switch (value) {
                    case 'highlight':
                        editor.chain().focus().toggleHighlight().run();
                        break;
                }
            }}>
                <ToolbarToggleItem value="highlight" aria-label="Highlight" className={isHighlighted ? 'selected' : ""}>
                    {/* <span className="material-symbols-rounded" style={{ fontSize: "1.6rem" }}>
                        border_color
                    </span> */}
                    <Pencil1Icon />
                </ToolbarToggleItem>
            </ToolbarToggleGroup>
            <ToolbarSeparator />
            <ToolbarToggleGroup type="single" defaultValue="left" aria-label="Text alignment" onValueChange={(value: string) => {
                switch (value) {
                    case 'left':
                        editor.chain().focus().setTextAlign('left').run()
                        break;
                    case 'center':
                        editor.chain().focus().setTextAlign('center').run()
                        break;
                    case 'right':
                        editor.chain().focus().setTextAlign('right').run()
                        break;
                }
            }}>
                <ToolbarToggleItem value="left" aria-label="Left aligned" className={isLeft ? 'selected' : ""}>
                    <TextAlignLeftIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="center" aria-label="Center aligned" className={isCenter ? 'selected' : ""}>
                    <TextAlignCenterIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="right" aria-label="Right aligned" className={isRight ? 'selected' : ""}>
                    <TextAlignRightIcon />
                </ToolbarToggleItem>
            </ToolbarToggleGroup>
        </ToolbarPrimitive.Root>
    )
}