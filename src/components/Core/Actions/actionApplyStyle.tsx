import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { stylePoint } from "../SelectionEditMethods/stylePoint";
import { styleRange } from "../SelectionEditMethods/styleRange";

export function actionApplyStyle(core: Core, stylePropName: string, stylePropValue: string){
    if(!stylePropName || !stylePropValue) return;
    //check style prop name is allowed
    const allowedStyles = ["color", "fontSize"];
    if(!allowedStyles.includes(stylePropName)) return;

    //clone the core state
    const clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //aquire js range
    const jsRange = document.getSelection()?.getRangeAt(0);
    if(!jsRange) return;

    const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode});
    //apply style to range
    if(jsRange.collapsed){
        clonedState.selectionChange = stylePoint(clonedState.contentNode, clonedState.temporaryTextNodeRefs, stylePropName, stylePropValue, selection.startNode, selection.startTextOffset, false);
    }
    else {
        clonedState.selectionChange = styleRange(clonedState.contentNode, selection, stylePropName, stylePropValue);
    }
    //update state to cloned state
    core.updateState(clonedState);
}