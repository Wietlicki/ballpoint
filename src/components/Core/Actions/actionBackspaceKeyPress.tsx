import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { removeRange } from "../SelectionEditMethods/removeRange";
import { removeSingle } from "../SelectionEditMethods/removeSingle";

export function actionBackspaceKeyPress(core: Core){
    //clone the core state
    let clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //aquire js range
    const jsRange = document.getSelection()?.getRangeAt(0);
    if(!jsRange) return;

    const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode});

    if(selection.isCollapsed){
        clonedState.selectionChange = removeSingle(clonedState.contentNode, selection.startNode, selection.startTextOffset);
    }
    else {
        clonedState.selectionChange = removeRange(clonedState.contentNode, selection);
    }
    //update state to cloned state
    core.updateState(clonedState);
}