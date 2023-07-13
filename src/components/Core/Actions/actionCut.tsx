import { ClipboardEvent } from "react";
import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { copyRange } from "../SelectionEditMethods/copyRange";
import { removeRange } from "../SelectionEditMethods/removeRange";

export function actionCut(core: Core, e: ClipboardEvent){
    //aquire js selectionAPI range
    const range = document.getSelection()?.getRangeAt(0);
    //terminate early if range is collapsed because there is nothing to cut
    if(!range || range.collapsed) return;

    //create a copy of the range and load into clipboard
    const copiedContentNode = copyRange(core.state.contentNode, range);
    e.clipboardData.setData("text/plain", copiedContentNode.toPlainText());
    //only provide fragment (toHtmlText method) because clipboard method automatically wraps it in html and body tags
    e.clipboardData.setData("text/html", copiedContentNode.toHtmlText(true));

    //clone state
    const clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //remove range on the cloned state
    const selection = new Selection({contentNode: clonedState.contentNode, jsRange: range});
    clonedState.selectionChange = removeRange(clonedState.contentNode, selection);
    //update state to cloned state
    core.updateState(clonedState);
}