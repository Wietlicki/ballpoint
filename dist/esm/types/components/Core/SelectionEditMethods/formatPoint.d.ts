import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
export declare function formatPoint(contentNode: BallpointNode, temporaryTextNodeRefs: Array<BallpointNode>, formatTagName: TagNames, node: BallpointNode, textOffset: number, formatToggle?: boolean): Selection;
