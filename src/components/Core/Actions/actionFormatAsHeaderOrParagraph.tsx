import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { rangeToHeaderOrParagraph } from "../SelectionEditMethods/rangeToHeaderOrParagraph";

export function actionFormatAsHeaderOrParagraph(core: Core, tag: string){
    //ensure passed header tag is valid
    if(!(tag === "p" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6")) return;
    //clone the core state
    const clonedState = core.cloneState();
    clonedState.selectionChange = null;
    //aquire js range
    const jsRange = document.getSelection()?.getRangeAt(0);
    if(!jsRange) return;

    const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode});

    clonedState.selectionChange = rangeToHeaderOrParagraph(clonedState.contentNode, tag, selection);
    //update state to cloned state
    core.updateState(clonedState);
}