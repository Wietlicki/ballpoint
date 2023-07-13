import { ICoreState } from "./Core.types";
import { BallpointNode } from "./Node/BallpointNode";
import { Selection } from "./Selection/Selection";
export declare class CoreState implements ICoreState {
    selectionChange?: Selection | null;
    contentNode: BallpointNode;
    temporaryTextNodeRefs: Array<BallpointNode>;
    constructor(htmlString?: string, plainTextString?: string);
}
