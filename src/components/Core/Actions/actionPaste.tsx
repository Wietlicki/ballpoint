import { Core } from "../Core";
import { convertParserRootNode } from "../Converters/convertParserRootNode";
import { Parser } from "../Converters/Parser";
import { Selection } from "../Selection/Selection";
import { pasteAtPoint } from "../SelectionEditMethods/pasteAtPoint";
import { removeRange } from "../SelectionEditMethods/removeRange";

export function actionPaste(core: Core, htmlString?: string, plainTextString?: string){
    let pastableContent;
    if(htmlString && htmlString.length > 0){
        const parser = new Parser();
        const parserRootNode = parser.parseHtml(htmlString);
        pastableContent = convertParserRootNode(parserRootNode);
    }
    else if(plainTextString && plainTextString.length > 0){
        const parser = new Parser();
        const parserRootNode = parser.parsePlainText(plainTextString);
        pastableContent = convertParserRootNode(parserRootNode);
    }
    if(!pastableContent) return;

    const clonedState = core.cloneState();
    clonedState.selectionChange = null;

    const range = document.getSelection()?.getRangeAt(0);
    const selection = new Selection({contentNode: clonedState.contentNode, jsRange: range});

    if(selection.isCollapsed){
        clonedState.selectionChange = pasteAtPoint(clonedState.contentNode, pastableContent, selection.startNode, selection.startTextOffset);
    }
    else {
        //first remove the selected range and aquire temporary selection
        const tempSelection = removeRange(clonedState.contentNode, selection);

        clonedState.selectionChange = pasteAtPoint(clonedState.contentNode, pastableContent, tempSelection.startNode, tempSelection.startTextOffset);
    }
    //update state to cloned state
    core.updateState(clonedState);
}