"use client";
import { useEffect, useRef, useState } from "react";

import { createCommand, LexicalCommand } from "lexical";
import { computePosition } from "@floating-ui/dom";
import { LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { debounce } from "../utils/debounce";

type OpenLinkMenuPosition = { x: number; y: number } | undefined;

export const LINK_SELECTOR = `[data-lexical-editor] a`;
export const OPEN_LINK_MENU_ID = "open-link-menu";
export const TOGGLE_EDIT_LINK_MENU: LexicalCommand<undefined> = createCommand();

import { CopyIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/ui";

export function OpenLinkPlugin() {
    const ref = useRef<HTMLDivElement>(null);
    const linkSetRef = useRef<Set<string>>(new Set());

    const [copied, setCopied] = useState(false);
    const [width, setWidth] = useState<number | undefined>(undefined);
    const [pos, setPos] = useState<OpenLinkMenuPosition>(undefined);
    const [link, setLink] = useState<string | null>(null);

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const menu = (e.target as HTMLElement).closest<HTMLElement>(
                `#${OPEN_LINK_MENU_ID}`
            );
            if (menu) return;

            const link = (e.target as HTMLElement).closest<HTMLElement>(
                LINK_SELECTOR
            );

            if (!link || !ref.current) {
                setPos(undefined);
                setLink(null);
                return;
            }

            computePosition(link, ref.current, { placement: "bottom" })
                .then((pos) => {
                    setPos({ x: pos.x, y: pos.y + 10 });
                    setLink(link.getAttribute("href"));
                })
                .catch(() => {
                    setPos(undefined);
                });

            return true;
        };

        const debouncedMouseMove = debounce(handleMouseMove, 200);

        return editor.registerMutationListener(LinkNode, (mutations) => {
            for (const [key, type] of mutations) {
                switch (type) {
                    case "created":
                    case "updated":
                        linkSetRef.current.add(key);
                        if (linkSetRef.current.size === 1)
                            document.addEventListener(
                                "mousemove",
                                debouncedMouseMove
                            );
                        break;

                    case "destroyed":
                        linkSetRef.current.delete(key);
                        if (linkSetRef.current.size === 0)
                            document.removeEventListener(
                                "mousemove",
                                debouncedMouseMove
                            );
                        break;
                }
            }
        });
    }, [editor, pos]);

    return (
        <div
            id={OPEN_LINK_MENU_ID}
            ref={ref}
            style={{ top: pos?.y, left: pos?.x, width }}
            aria-hidden={!pos?.x || !pos?.y}
            className={cn(
                `absolute flex items-center justify-between bg-neutral border-[1px] border-light-gray rounded-md p-2 gap-2 opacity-0 invisible`,
                {
                    "opacity-1 visible": pos?.x && pos.y,
                }
            )}
        >
            {link && !copied ? (
                <a
                    className="text-xs opacity-75 cursor-pointer"
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {link}
                </a>
            ) : (
                <span className="w-full text-xs text-center opacity-75 cursor-pointer">
                    {copied ? "🎉 Copied!" : "No link"}
                </span>
            )}
            {link ? (
                <div>
                    <CopyIcon
                        className="cursor-pointer w-4 h-4 flex items-center justify-center p-0.5 hover:bg-background-04 rounded transition-colors"
                        color="var(--primary-03)"
                        fontSize={`1.4rem`}
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            setCopied(true);
                            setWidth(
                                ref.current?.getBoundingClientRect().width
                            );
                            setTimeout(() => {
                                setCopied(false);
                                setWidth(undefined);
                            }, 1000);
                        }}
                    />
                </div>
            ) : undefined}
        </div>
    );
}
