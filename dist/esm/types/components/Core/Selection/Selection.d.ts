import { ISelection, SelectionConstructorProps } from "./Selection.types";
import { BallpointNode } from "../Node/BallpointNode";
export declare class Selection implements ISelection {
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
