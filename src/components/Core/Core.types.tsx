import { BallpointNode } from "./Node/BallpointNode";
import { Selection } from "./Selection/Selection";

export interface ICoreState {
    selectionChange?: Selection | null,
    contentNode: BallpointNode,
    temporaryTextNodeRefs: Array<BallpointNode>
}
export interface ICoreProps {
    theme?: "light" | "dark" | "default",
    focusTheme?: "monochrome-light" | "monochrome-dark" | "color" | "default",
    keyActionsConfig?: CoreKeyActionsConfig,
    clipboardActionsConfig?: CoreClipboardActionsConfig,
    controlledCoreState?: ICoreState,
    initCoreState?: ICoreState,
    onChange?: (coreState: ICoreState) => void
}
export type CoreKeyActionsConfig = {
    allowBold?: boolean;
    allowItalic?: boolean;
    allowUnderline?: boolean;
    allowUndo?: boolean;
    allowRedo?: boolean;
}
export type CoreClipboardActionsConfig = {
    allowCopy?: boolean;
    allowCut?: boolean;
    allowPaste?: boolean;
}