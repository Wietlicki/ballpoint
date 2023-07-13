import { ClipboardEvent } from "react";
import { Core } from "../Core";
import { copyRange } from "../SelectionEditMethods/copyRange";

export function actionCopy(core: Core, e: ClipboardEvent){
    //aquire js selectionAPI range
    const range = document.getSelection()?.getRangeAt(0);
    //terminate early if there is no range or range is collapsed because there is nothing to copy
    if(!range || range.collapsed) return;
    //create a copy of the range and load into clipboard
    const copiedContentNode = copyRange(core.state.contentNode, range);
    e.clipboardData.setData("text/plain", copiedContentNode.toPlainText());
    //only provide fragment (toHtmlText method) because clipboard method automatically wraps it in html and body tags
    e.clipboardData.setData("text/html", copiedContentNode.toHtmlText(true));
}