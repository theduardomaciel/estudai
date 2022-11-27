// Editor
import { useEditor, EditorContent } from '@tiptap/react'
import { Editor } from '@tiptap/core';

// Components
import Section from '../Section';
import FormatToolbar from '../FormatToolbar';

// Stylesheets
import styles from "./editor.module.css";
import inputStyles from "../Input/label.module.css";


//const CustomEditorContent = ({ editor }: { editor: any }) => <EditorContent className={`${inputStyles.input} ${styles.input}`} editor={editor} />;

interface Props {
    editor: Editor | null;
    title?: string;
    inError?: boolean;
}

export default function CustomEditor({ editor, title, inError }: Props) {
    return <div className={styles.column}>
        <div className={'header'}>
            <Section classes={styles.descriptionHeader} title={title ? title : "Descrição"} />
            <FormatToolbar editor={editor as Editor} />
        </div>
        <div className={styles.input}>
            <EditorContent style={{ borderColor: inError ? "var(--red-01)" : "var(--primary-03)" }} className={`${inputStyles.input} ${styles.input}`} editor={editor as any} />
        </div>
    </div>
}