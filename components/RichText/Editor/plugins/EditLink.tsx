"use client";
import {
    SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import {
    $getSelection,
    COMMAND_PRIORITY_LOW,
    createCommand,
    LexicalCommand,
} from "lexical";

import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { computePosition } from "@floating-ui/dom";

import { useClickOutside } from "../hooks/useClickOutside";
import { $getSharedLinkTarget } from "../utils/$getSharedLinkTarget";

// Icons
import TrashIcon from "@material-symbols/svg-600/rounded/delete.svg";
import CheckIcon from "@material-symbols/svg-600/rounded/check.svg";
import { cn } from "@/lib/ui";

type EditLinkMenuPosition = { x: number; y: number } | undefined;

export const TOGGLE_EDIT_LINK_MENU: LexicalCommand<undefined> = createCommand();

export function EditLinkPlugin() {
    const ref = useRef<HTMLFormElement>(null); // atualizar isso aqui caso volte a utilizar div (HtmlDivElement)
    const inputRef = useRef<HTMLInputElement>(null);

    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [pos, setPos] = useState<EditLinkMenuPosition>(undefined);
    const [domRange, setDomRange] = useState<Range | undefined>(undefined);
    const [hasLink, setHasLink] = useState(false);

    const [editor] = useLexicalComposerContext();

    const resetState = useCallback(() => {
        setValue("");
        setError(false);
        setPos(undefined);
        setDomRange(undefined);
        editor.focus();
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            TOGGLE_EDIT_LINK_MENU,
            () => {
                const nativeSel = window.getSelection();
                const isCollapsed =
                    nativeSel?.rangeCount ===
                    0; /* || nativeSel?.isCollapsed; */

                console.log(nativeSel, "nativeSel");

                if (
                    !!pos?.x ||
                    !!pos?.y ||
                    !ref.current ||
                    !nativeSel ||
                    isCollapsed
                ) {
                    resetState();
                    return false;
                }

                const domRange = nativeSel.getRangeAt(0);

                computePosition(domRange, ref.current, { placement: "bottom" })
                    .then((pos) => {
                        setPos({ x: pos.x, y: pos.y + 10 });
                        setDomRange(domRange);
                        editor.getEditorState().read(() => {
                            const selection = $getSelection();
                            const linkTarget = $getSharedLinkTarget(selection);
                            setHasLink(!!linkTarget);
                        });
                    })
                    .catch(() => {
                        resetState();
                    });

                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, pos, resetState]);

    useEffect(() => {
        if (pos?.x && pos?.y) {
            let initialUrl = "";

            editor.getEditorState().read(() => {
                const selection = $getSelection();
                initialUrl = $getSharedLinkTarget(selection) ?? "";
            });

            setValue(initialUrl);
            inputRef.current?.focus();
        }
    }, [pos, editor]);

    useClickOutside(ref, () => {
        resetState();
    });

    const handleSetLink = (event?: SyntheticEvent) => {
        if (event) {
            event.preventDefault();
        }
        if (!value) return;

        const isLinkSet = editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url: value,
            target: "_blank",
        });

        if (isLinkSet) resetState();
        else setError(true);
    };

    const handleRemoveLink = () => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        resetState();
    };

    return (
        <>
            <FakeSelection range={domRange} />
            <form
                ref={ref}
                id="edit-link-menu"
                onSubmit={handleSetLink}
                style={{ top: pos?.y, left: pos?.x }}
                aria-hidden={!pos?.x || !pos?.y}
                className={cn(
                    `absolute flex items-center justify-between bg-neutral border-[1px] px-2.5 py-1.5 border-light-gray rounded-md gap-1 opacity-0 invisible`,
                    {
                        "border-red-500": error,
                        "opacity-1 visible": pos?.x && pos?.y,
                    }
                )}
            >
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="url"
                    className="text-xs text-font-light bg-transparent border-none outline-none"
                    placeholder="Enter URL"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            /* handleSetLink(); */
                            const form = e.currentTarget.closest("form");
                            if (form) {
                                // Ao invés de chamar o submit do form, chamamos o submit do botão para aproveitarmo-nos do evento de validação do form
                                form.submitButton.click();
                            }
                            return;
                        }

                        if (e.key === "Escape") {
                            e.preventDefault();
                            resetState();
                            return;
                        }
                    }}
                />
                {hasLink ? (
                    <div className="flex items-center justify-center p-0.5 hover:bg-red-02/10 rounded transition-colors">
                        <TrashIcon
                            className="icon cursor-pointer"
                            fontSize={`1.8rem`}
                            color="var(--red-02)"
                            onClick={handleRemoveLink}
                        />
                    </div>
                ) : null}
                <button
                    className="flex items-center justify-center p-0.5 hover:bg-background-04 rounded transition-colors"
                    type="submit"
                    name="submitButton"
                >
                    <CheckIcon
                        className="icon cursor-pointer"
                        fontSize={`1.8rem`}
                        color="var(--primary-03)"
                        style={{
                            opacity: value ? 1 : 0.5,
                        }}
                        /* onClick={handleSetLink} */
                    />
                </button>
            </form>
        </>
    );
}

/**
 * Renders a fake selection when the input element is focused.
 * This is to have some visual feedback to see where the link will be inserted.
 */

function FakeSelection({ range }: { range: Range | undefined }) {
    if (!range) return null;

    const domRect = range.getBoundingClientRect();
    return createPortal(
        <div
            className="absolute bg-slate-200 -z-[1]"
            style={{
                left: domRect.left,
                width: domRect.width,
                top: domRect.top - 2,
                height: domRect.height + 4,
            }}
        />,
        document.body
    );
}
