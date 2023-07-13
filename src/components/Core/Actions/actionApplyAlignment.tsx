import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { alignRange } from "../SelectionEditMethods/alignRange";

export function actionApplyAlignment(core: Core, direction: string){
	//ensure passed direction param is valid for styling
	if(!["right", "left", "center"].includes(direction)) return;
	//clone the core state
	const clonedState = core.cloneState();
	clonedState.selectionChange = null;
	//aquire js range
	const jsRange = document.getSelection()?.getRangeAt(0);
	if(!jsRange) return;

	const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode})
	//apply alignment to range
	clonedState.selectionChange = alignRange(clonedState.contentNode, selection, direction);
	//update state to cloned state
	core.updateState(clonedState);
}