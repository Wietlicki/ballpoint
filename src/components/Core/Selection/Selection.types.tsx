import { BallpointNode } from "../Node/BallpointNode";

export interface ISelection {
    contentNode: BallpointNode,
    isCollapsed: boolean,
    startNode: BallpointNode,
    startTextOffset: number,
    endNode: BallpointNode,
    endTextOffset: number,
    commonAncestorNode: BallpointNode,
    translateRangeNode(node: BallpointNode, offset: number): {node: BallpointNode, textOffset: number},
    getDOMNodeFromNode(node: BallpointNode): Node | null
    findCommonAncestor(nodeOne: BallpointNode, nodeTwo: BallpointNode) : BallpointNode | null,
    toJsRange(): Range | null
}

export type SelectionConstructorProps = {
    contentNode: BallpointNode;
    jsRange?: Range;
    startNode?: BallpointNode | null; 
    startTextOffset?: number;
    endNode?: BallpointNode | null;
    endTextOffset?: number;
}