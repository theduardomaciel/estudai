import React from 'react';
import { styled } from '@stitches/react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

const StyledSwitch = styled(SwitchPrimitive.Root, {
    all: 'unset',
    width: "4.2rem",
    height: "2.5rem",
    backgroundColor: "var(--primary-04)",
    borderRadius: '99999px',
    position: 'relative',
    /* boxShadow: `0 1.5px 8px var(--primary-04)`, */
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    '&:focus': { boxShadow: `0 0 0 2px var(--primary-02)` },
    '&[data-state="checked"]': { backgroundColor: 'var(--primary-02)' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
    display: 'block',
    width: 21,
    height: 21,
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: `0 2px 2px var(--primary-01)`,
    transition: 'transform 100ms',
    transform: 'translateX(2px)',
    willChange: 'transform',
    '&[data-state="checked"]': { transform: 'translateX(19px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;