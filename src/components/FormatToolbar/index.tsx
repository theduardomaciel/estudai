import React from 'react'
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
    '&[data-state=on]': { backgroundColor: "var(--primary-04)", color: "var(--light)" },
});

interface Props {

}

export default function FormatToolbar(props: Props) {
    return (
        <ToolbarPrimitive.Root className={styles.container} aria-label="Formatting options">
            <ToolbarToggleGroup type="multiple" aria-label="Text formatting">
                <ToolbarToggleItem value="bold" aria-label="Bold">
                    <FontBoldIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="italic" aria-label="Italic">
                    <FontItalicIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="strikethrough" aria-label="Strike through">
                    <StrikethroughIcon />
                </ToolbarToggleItem>
            </ToolbarToggleGroup>
            <ToolbarSeparator />
            <ToolbarToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
                <ToolbarToggleItem value="left" aria-label="Left aligned">
                    <TextAlignLeftIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="center" aria-label="Center aligned">
                    <TextAlignCenterIcon />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="right" aria-label="Right aligned">
                    <TextAlignRightIcon />
                </ToolbarToggleItem>
            </ToolbarToggleGroup>
        </ToolbarPrimitive.Root>
    )
}