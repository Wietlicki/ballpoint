import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { Component, ClipboardEvent } from 'react';

type ToolbarOptions = {
    displayBoldButton?: boolean;
    displayItalicButton?: boolean;
    displayUnderlineButton?: boolean;
    displayStrikeoutButton?: boolean;
    displayFontSizeButton?: boolean;
    displayFontColorButton?: boolean;
    displayTextAlignLeftButton?: boolean;
    displayTextAlignCenterButton?: boolean;
    displayTextAlignRightButton?: boolean;
    displayParagraphButton?: boolean;
    displayHeaderButton?: boolean;
    displayBulletListButton?: boolean;
    displayNumberListButton?: boolean;
};
interface ToolbarProps {
    onBoldClick?: () => void;
    onItalicClick?: () => void;
    onUnderlineClick?: () => void;
    onStrikeoutClick?: () => void;
    onFontSizeChange?: (fontSizeCategory: string) => void;
    onFontColorChange?: (color: string) => void;
    onTextAlignLeftClick?: () => void;
    onTextAlignCenterClick?: () => void;
    onTextAlignRightClick?: () => void;
    onParagraphClick?: () => void;
    onHeaderChange?: (tag: string) => void;
    onBulletListClick?: () => void;
    onNumberListClick?: () => void;
    className: string;
    toolbarButtonClassName: string;
    toolbarColorButtonClassName: string;
    toolbarStyle: "light" | "dark" | "default";
    toolbarOptions: ToolbarOptions;
}
interface ToolbarState {
    displayMenu: boolean;
    currentMenu?: string;
}

declare class Toolbar extends Component<ToolbarProps, ToolbarState> {
    static defaultProps: Partial<ToolbarProps>;
    state: ToolbarState;
    handleFontSizeClick: () => void;
    handleFontSizeSelectionClick: (size: string) => () => void;
    handleFontColorClick: () => void;
    handleFontColorSelectionClick: (color: string) => void;
    handleHeaderClick: () => void;
    handleHeaderSelectionClick: (tag: string) => () => void;
    render(): react_jsx_runtime.JSX.Element;
}

interface IBallpointNode {
    id: string;
    tagName: TagNames;
    children: Array<IBallpointNode>;
    parent: IBallpointNode | null | undefined;
    text: string;
    domRef: any;
    className?: string;
    style?: {
        [key: string]: string;
    };
    getAllChildrenWithTagNames(tags: Array<TagNames>): Array<IBallpointNode>;
    getLastDeepChild(): IBallpointNode | undefined;
    getPreviousNode(): IBallpointNode | undefined | null;
    getNextNode(): IBallpointNode | null;
    getNextNodeWithTagName(tagName: TagNames): IBallpointNode | null;
    getFirstChildWithTagName(tagName: TagNames): IBallpointNode | null;
    isNodeParentOf(testNode: IBallpointNode): boolean;
    getChildIndexArray(deepChild: IBallpointNode): number[];
    findParentWithTagName(tagNames: Array<TagNames> | TagNames): IBallpointNode | undefined;
    compareTagAndStyle(comparisonNode: IBallpointNode): boolean;
    findParentWithTagAndStyle(tagName: TagNames, style: {
        [key: string]: string;
    } | undefined): IBallpointNode | null;
    getNodeFormatInfo(): BallpointFormatInfo;
    nodeHasText(): boolean;
    wrap(wrapperTagName: TagNames, style?: {
        [key: string]: string;
    }): void;
    remove(shiftPreserveChildren: boolean): void;
    migrateChildren(toNode: IBallpointNode, insertPosition: number): void;
    toFlatNodeTree(): Array<FlatBallpointNode>;
    toHtmlText(fragment: boolean): string;
    toPlainText(): string;
    toJSX(key?: string | number): JSX.Element;
    clone(refArray?: Array<IBallpointNode>, parent?: IBallpointNode | null): IBallpointNode;
}
type BallpointNodeProps = {
    className?: string;
    style?: {
        [key: string]: string;
    };
};
type FlatBallpointNode = {
    tagName: TagNames;
    isNodeStart: boolean;
    isNodeEnd: boolean;
    nodeRef: IBallpointNode;
};
type BallpointStyleRef = {
    value: string;
    nodeRef: BallpointNode;
};
type BallpointFormatInfo = {
    effectiveFormatting: {
        [key: string]: Array<BallpointNode>;
    };
    effectiveStyle: {
        [key: string]: BallpointStyleRef;
    };
};
type TagNames = keyof JSX.IntrinsicElements | "#text";

declare class BallpointNode implements IBallpointNode {
    id: string;
    tagName: TagNames;
    children: Array<BallpointNode>;
    parent: BallpointNode | null | undefined;
    text: string;
    domRef: any;
    className?: string;
    style?: {
        [key: string]: string;
    };
    constructor(tagName: TagNames, parent: BallpointNode | null | undefined, insertPosition?: number, props?: BallpointNodeProps);
    getAllChildrenWithTagNames: (tags: Array<TagNames>) => Array<BallpointNode>;
    getLastDeepChild: () => BallpointNode | undefined;
    getPreviousNode: () => BallpointNode | undefined | null;
    getNextNode: () => BallpointNode | null;
    getNextNodeWithTagName: (tagName: string) => BallpointNode | null;
    getFirstChildWithTagName: (tagName: string) => BallpointNode | null;
    isNodeParentOf: (testNode: BallpointNode) => boolean;
    getChildIndexArray: (deepChild: BallpointNode) => number[];
    findParentWithTagName: (tagNames: Array<TagNames> | TagNames) => BallpointNode | undefined;
    compareTagAndStyle: (comparisonNode: BallpointNode) => boolean;
    findParentWithTagAndStyle: (tagName: TagNames, style: {
        [key: string]: string;
    } | undefined) => BallpointNode | null;
    getNodeFormatInfo: () => BallpointFormatInfo;
    nodeHasText: () => boolean;
    wrap: (wrapperTagName: TagNames, style?: {
        [key: string]: string;
    } | undefined) => void;
    remove: (shiftPreserveChildren?: boolean) => void;
    migrateChildren: (toNode: BallpointNode, insertPosition: number) => void;
    toFlatNodeTree: () => Array<FlatBallpointNode>;
    toHtmlText: (fragment?: boolean) => string;
    toPlainText: () => string;
    toJSX: (key?: string | number) => react_jsx_runtime.JSX.Element;
    clone: (refArray?: Array<BallpointNode>, parent?: BallpointNode | null) => BallpointNode;
}

interface ISelection {
    contentNode: BallpointNode;
    isCollapsed: boolean;
    startNode: BallpointNode;
    startTextOffset: number;
    endNode: BallpointNode;
    endTextOffset: number;
    commonAncestorNode: BallpointNode;
    translateRangeNode(node: BallpointNode, offset: number): {
        node: BallpointNode;
        textOffset: number;
    };
    getDOMNodeFromNode(node: BallpointNode): Node | null;
    findCommonAncestor(nodeOne: BallpointNode, nodeTwo: BallpointNode): BallpointNode | null;
    toJsRange(): Range | null;
}
type SelectionConstructorProps = {
    contentNode: BallpointNode;
    jsRange?: Range;
    startNode?: BallpointNode | null;
    startTextOffset?: number;
    endNode?: BallpointNode | null;
    endTextOffset?: number;
};

declare class Selection implements ISelection {
    contentNode: BallpointNode;
    isCollapsed: boolean;
    startNode: BallpointNode;
    startTextOffset: number;
    endNode: BallpointNode;
    endTextOffset: number;
    commonAncestorNode: BallpointNode;
    constructor(constructorProps: SelectionConstructorProps);
    translateRangeNode: (node: BallpointNode, offset: number) => {
        node: BallpointNode;
        textOffset: number;
    };
    getDOMNodeFromNode: (node: BallpointNode) => Node | null;
    getNodeFromDOMNode: (contentNode: BallpointNode, domNode: Node) => BallpointNode | null;
    findCommonAncestor: (nodeOne: BallpointNode, nodeTwo: BallpointNode) => BallpointNode | null;
    toJsRange: () => Range | null;
}

interface ICoreState {
    selectionChange?: Selection | null;
    contentNode: BallpointNode;
    temporaryTextNodeRefs: Array<BallpointNode>;
}
interface ICoreProps {
    theme?: "light" | "dark" | "default";
    focusTheme?: "monochrome-light" | "monochrome-dark" | "color" | "default";
    keyActionsConfig?: CoreKeyActionsConfig;
    clipboardActionsConfig?: CoreClipboardActionsConfig;
    controlledCoreState?: ICoreState;
    initCoreState?: ICoreState;
    onChange?: (coreState: ICoreState) => void;
}
type CoreKeyActionsConfig = {
    allowBold?: boolean;
    allowItalic?: boolean;
    allowUnderline?: boolean;
    allowUndo?: boolean;
    allowRedo?: boolean;
};
type CoreClipboardActionsConfig = {
    allowCopy?: boolean;
    allowCut?: boolean;
    allowPaste?: boolean;
};

declare class Core extends Component<ICoreProps, ICoreState> {
    inputRef: React.RefObject<HTMLDivElement>;
    priorStates: Array<ICoreState>;
    redoStates: Array<ICoreState>;
    constructor(props: ICoreProps);
    fSelectionChangeListener: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    cloneState: () => ICoreState;
    saveStateAsPrior: () => void;
    updateState: (newState: ICoreState, savePriorState?: boolean) => void;
    genDefaultKeyActionsConfig: () => CoreKeyActionsConfig;
    render(): react_jsx_runtime.JSX.Element;
}

interface IEditorState {
}
interface IEditorProps {
    theme?: "light" | "dark" | "default";
    initHtml?: string;
    initPlainText?: string;
    controlledCoreState?: ICoreState;
    onChange?: (coreState: ICoreState) => void;
    editorActionsConfig: EditorActionsConfig;
    editorClipboardActionsConfig: EditorClipboardActionsConfig;
}
type EditorActionsConfig = {
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
type EditorClipboardActionsConfig = {
    allowCopy?: boolean;
    allowPaste?: boolean;
    allowCut?: boolean;
};

declare class Editor extends Component<IEditorProps, IEditorState> {
    coreRef: React.RefObject<Core>;
    static defaultProps: Partial<IEditorProps>;
    constructor(props: IEditorProps);
    allowParagraph: () => boolean;
    handleFontSizeChange: (size: string) => void;
    handleHeaderChange: (tag: string) => void;
    handleFontColorChange: (color: string) => void;
    handleBoldClick: () => void;
    handleItalicClick: () => void;
    handleUnderlineClick: () => void;
    handleStrikethroughClick: () => void;
    handleTextAlignLeftClick: () => void;
    handleTextAlignCenterClick: () => void;
    handleTextAlignRightClick: () => void;
    handleParagraphClick: () => void;
    handleBulletListClick: () => void;
    handleNumberListClick: () => void;
    render(): react_jsx_runtime.JSX.Element;
}

declare class CoreState implements ICoreState {
    selectionChange?: Selection | null;
    contentNode: BallpointNode;
    temporaryTextNodeRefs: Array<BallpointNode>;
    constructor(htmlString?: string, plainTextString?: string);
}

declare function actionApplyAlignment(core: Core, direction: string): void;

declare function actionApplyFormatting(core: Core, formatTag: TagNames): void;

declare function actionApplyStyle(core: Core, stylePropName: string, stylePropValue: string): void;

declare function actionCopy(core: Core, e: ClipboardEvent): void;

declare function actionCut(core: Core, e: ClipboardEvent): void;

declare function actionFormatAsHeaderOrParagraph(core: Core, tag: string): void;

declare function actionFormatAsList(core: Core, listTag: TagNames): void;

declare function actionPaste(core: Core, htmlString?: string, plainTextString?: string): void;

declare function actionRedo(core: Core): void;

declare function actionUndo(core: Core): void;

export { Core, CoreClipboardActionsConfig, CoreKeyActionsConfig, CoreState, Editor, ICoreProps, ICoreState, Toolbar, actionApplyAlignment, actionApplyFormatting, actionApplyStyle, actionCopy, actionCut, actionFormatAsHeaderOrParagraph, actionFormatAsList, actionPaste, actionRedo, actionUndo };
