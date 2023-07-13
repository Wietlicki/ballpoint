import { Core } from "../Core";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { rangeToList } from "../SelectionEditMethods/rangeToList";

export function actionFormatAsList(core: Core, listTag: TagNames){
	//ensure passed list tag is valid for styling
	if(!["ol", "ul"].includes(listTag)) return;
	//clone the core state
	const clonedState = core.cloneState();
	clonedState.selectionChange = null;
	//aquire js range
	const jsRange = document.getSelection()?.getRangeAt(0);
	if(!jsRange) return;

	const selection = new Selection({jsRange: jsRange, contentNode: clonedState.contentNode});

	clonedState.selectionChange = rangeToList(clonedState.contentNode, selection, listTag);
	//update state to cloned state
	core.updateState(clonedState);
}