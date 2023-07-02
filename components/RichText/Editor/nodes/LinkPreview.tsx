import { ElementNode, LexicalNode, ParagraphNode } from "lexical";

export class CustomParagraph extends ElementNode {
    static getType(): string {
        return "custom-paragraph";
    }

    static clone(node: ParagraphNode): ParagraphNode {
        return new CustomParagraph(node.__key);
    }

    createDOM(): HTMLElement {
        // Define the DOM element here
        const dom = document.createElement("p");
        return dom;
    }

    updateDOM(prevNode: CustomParagraph, dom: HTMLElement): boolean {
        // Returning false tells Lexical that this node does not need its
        // DOM element replacing with a new copy from createDOM.
        return false;
    }
}

export function $createCustomParagraphNode(): ParagraphNode {
    return new CustomParagraph();
}

export function $isCustomParagraphNode(
    node: LexicalNode | null | undefined
): node is CustomParagraph {
    return node instanceof CustomParagraph;
}
