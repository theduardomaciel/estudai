"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// Lexical React - Plugins
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
// import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

// Plugins
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import { EditLinkPlugin } from "./plugins/EditLink";

// Components
import Section, {
    SectionHeader,
    SectionHeaderProps,
} from "@/components/Section";
import { OpenLinkPlugin } from "./plugins/OpenLink";
import { MaxLengthPlugin } from "./plugins/MaxLengthPlugin";

const EDITOR_NODES = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
    CodeNode,
];

const Placeholder = () => {
    return (
        <div className="absolute top-4 left-4 opacity-50 text-sm text-font-light">
            Comece a escrever...
        </div>
    );
};

interface Props extends SectionHeaderProps {
    includeToolbar?: boolean;
    maxLength?: number;
}

export default function Editor({
    title,
    maxLength,
    includeToolbar = true,
}: Props) {
    return (
        <LexicalComposer
            initialConfig={{
                namespace: "lexical-editor",
                theme: {
                    link: "cursor-pointer",
                    text: {
                        bold: "font-semibold",
                        underline: "underline decoration-wavy",
                        italic: "italic",
                        strikethrough: "line-through",
                        underlineStrikethrough: "underlined-line-through",
                    },
                },
                // Any custom nodes go here
                nodes: EDITOR_NODES,
                onError: (error) => {
                    console.log(error);
                },
            }}
        >
            <Section>
                {title && (
                    <SectionHeader title={title}>
                        {includeToolbar && <ToolbarPlugin />}
                    </SectionHeader>
                )}
                <div className="flex w-full h-full relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 prose-strong:text-inherit max-w-none">
                    {/* Official Plugins */}
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="w-full p-4 bg-neutral border border-primary-03 rounded-md text-font-light text-sm font-sans font-normal focus:outline-1 focus:outline focus:outline-primary-03" />
                        }
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    {/* Custom Plugins */}
                    <AutoLinkPlugin />
                    <EditLinkPlugin />
                    <OpenLinkPlugin />
                    {maxLength && <MaxLengthPlugin maxLength={maxLength} />}
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                </div>
            </Section>
        </LexicalComposer>
    );
}
