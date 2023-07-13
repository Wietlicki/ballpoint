import { ICoreState } from "../Core/Core.types";
export interface IEditorState {
}
export interface IEditorProps {
    theme?: "light" | "dark" | "default";
    initHtml?: string;
    initPlainText?: string;
    controlledCoreState?: ICoreState;
    onChange?: (coreState: ICoreState) => void;
    editorActionsConfig: EditorActionsConfig;
    editorClipboardActionsConfig: EditorClipboardActionsConfig;
}
export type EditorActionsConfig = {
    allowBold?: boolean;
    allowItalic?: boolean;
    allowUnderline?: boolean;
    allowStrikeOut?: boolean;
    allowFontSizeSelect?: boolean;
    allowFontColorSelect?: boolean;
    allowTextAlign?: boolean;
    allowHeader?: boolean;
    allowBulletList?: boolean;
    allowNumberedList?: boolean;
    allowUndo?: boolean;
    allowRedo?: boolean;
};
export type EditorClipboardActionsConfig = {
    allowCopy?: boolean;
    allowPaste?: boolean;
    allowCut?: boolean;
};
