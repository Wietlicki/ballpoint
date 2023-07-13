import { Core } from "../Core";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { formatPoint } from "../SelectionEditMethods/formatPoint";
import { formatRange } from "../SelectionEditMethods/formatRange";

export function actionApplyFormatting(core: Core, formatTag: TagNames){
    //clone the core state
    const clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //aquire js range
    const jsRange = document.getSelection()?.getRangeAt(0);
    if(!jsRange) return;

    const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode});
    //apply formatting to range
    if(jsRange.collapsed){
        clonedState.selectionChange = formatPoint(clonedState.contentNode, clonedState.temporaryTextNodeRefs, formatTag, selection.startNode, selection.startTextOffset);
    }
    else {
        clonedState.selectionChange = formatRange(clonedState.contentNode, selection, formatTag, undefined);
    }
    //update state to cloned state
    core.updateState(clonedState);
}