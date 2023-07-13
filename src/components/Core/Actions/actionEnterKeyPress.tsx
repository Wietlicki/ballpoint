import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { addLineBreak } from "../SelectionEditMethods/addLineBreak";
import { addCarriageReturn } from "../SelectionEditMethods/addCarriageReturn";
import { removeRange } from "../SelectionEditMethods/removeRange";

export function actionEnterKeyPress(core: Core, shiftKeyDown: boolean){
    //clone the core state
    let clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //aquire js range
    const jsRange = document.getSelection()?.getRangeAt(0);
    if(!jsRange) return;

    const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode})

    if(selection.isCollapsed){
        clonedState.selectionChange = shiftKeyDown === true ? 
            addLineBreak(clonedState.contentNode, selection.startNode, selection.startTextOffset) :
            addCarriageReturn(clonedState.contentNode, selection.startNode, selection.startTextOffset);
    }
    else {
        //first remove the selected range and aquire temporary selection
        const tempSelection = removeRange(clonedState.contentNode, selection);

        //use temporary selection to add a line break
        clonedState.selectionChange = shiftKeyDown === true ? 
            addLineBreak(clonedState.contentNode, tempSelection.startNode, tempSelection.startTextOffset) :
            addCarriageReturn(clonedState.contentNode, tempSelection.startNode, tempSelection.startTextOffset)
    }
    //update state to cloned state
    core.updateState(clonedState);
}