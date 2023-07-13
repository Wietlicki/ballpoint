import { FlatBallpointNode, IBallpointNode, BallpointNodeProps, TagNames, BallpointFormatInfo } from "./BallpointNode.types";
export declare class BallpointNode implements IBallpointNode {
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
    toJSX: (key?: string | number) => import("react/jsx-runtime").JSX.Element;
    clone: (refArray?: Array<BallpointNode>, parent?: BallpointNode | null) => BallpointNode;
}
