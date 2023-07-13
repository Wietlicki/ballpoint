import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
export declare function reduceFormatting(node: BallpointNode, tagName: TagNames, style: {
    [key: string]: string;
} | undefined, shallow?: boolean): void;
