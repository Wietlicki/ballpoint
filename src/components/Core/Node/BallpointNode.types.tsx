import { BallpointNode } from "./BallpointNode"

export interface IBallpointNode {
    id: string;
    tagName: TagNames;
    children: Array<IBallpointNode>;
    parent: IBallpointNode | null | undefined;
    text: string;
    domRef: any;
    className?: string;
    style?: {[key: string]: string};
    getAllChildrenWithTagNames(tags: Array<TagNames>): Array<IBallpointNode>;
    getLastDeepChild(): IBallpointNode | undefined;
    getPreviousNode(): IBallpointNode | undefined | null;
    getNextNode(): IBallpointNode | null;
    getNextNodeWithTagName(tagName: TagNames): IBallpointNode | null;
    getFirstChildWithTagName(tagName: TagNames): IBallpointNode | null;
    isNodeParentOf(testNode: IBallpointNode): boolean;
    getChildIndexArray(deepChild: IBallpointNode): number[];
    findParentWithTagName(tagNames : Array<TagNames> | TagNames): IBallpointNode | undefined;
    compareTagAndStyle(comparisonNode: IBallpointNode): boolean
    findParentWithTagAndStyle(tagName: TagNames, style: {[key: string]: string} | undefined): IBallpointNode | null;
    getNodeFormatInfo(): BallpointFormatInfo;
    nodeHasText(): boolean;
    wrap(wrapperTagName: TagNames, style?: {[key: string]: string}): void;
    remove(shiftPreserveChildren: boolean) : void;
    migrateChildren(toNode: IBallpointNode, insertPosition: number): void;
    toFlatNodeTree(): Array<FlatBallpointNode>;
    toHtmlText(fragment: boolean): string;
    toPlainText(): string;
    toJSX(key? : string | number) : JSX.Element;
    clone(refArray?: Array<IBallpointNode>, parent?: IBallpointNode | null) : IBallpointNode;
}
export type BallpointNodeProps = {
    className?: string,
    style?: {[key: string]: string}
}
export type FlatBallpointNode = {
    tagName: TagNames,
    isNodeStart: boolean, 
    isNodeEnd: boolean, 
    nodeRef: IBallpointNode
}
export type BallpointStyleRef = {
    value: string,
    nodeRef: BallpointNode
}
export type BallpointFormatInfo = {
    effectiveFormatting: {[key: string]: Array<BallpointNode>},
    effectiveStyle: {[key: string]: BallpointStyleRef}
}
export type TagNames = keyof JSX.IntrinsicElements | "#text"