import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { addChar } from "../SelectionEditMethods/addChar";
import { removeRange } from "../SelectionEditMethods/removeRange";

export function actionCharKeyPress(core: Core, key: string){
    //clone the core state
    let clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //aquire js range
    const jsRange = document.getSelection()?.getRangeAt(0);
    if(!jsRange) return;

    const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode});

    if(selection.isCollapsed){
        clonedState.selectionChange = addChar(clonedState.contentNode, selection.startNode, selection.startTextOffset, key);
    }
    else {
        //first remove the selected range and aquire temporary selection
        const tempSelection = removeRange(clonedState.contentNode, selection);
        //use temporary selection to add a new char
        clonedState.selectionChange = addChar(clonedState.contentNode, tempSelection.startNode, tempSelection.startTextOffset, key);
    }
    //update state to cloned state
    core.updateState(clonedState);
}