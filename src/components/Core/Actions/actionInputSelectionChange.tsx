import { Core } from "../Core";
import { Selection } from "../Selection/Selection";
import { reduceTextNodes } from "../TreeMethods/reduceTextNodes";

export function actionInputSelectionChange(core: Core){
    if(core.state.temporaryTextNodeRefs?.length > 0){
        const clonedState = core.cloneState();
        let stateIsChanged = false;
        clonedState.temporaryTextNodeRefs.forEach(e => {
            //check if the text node is empty
            //remove from temporary nodes list if it has text as only empty text nodes can be temporary
            if(e?.text.length > 0 && !e.text.match(/^\u200B+$/gi)){
                clonedState.temporaryTextNodeRefs = clonedState.temporaryTextNodeRefs.filter(x => x !== e);
                stateIsChanged = true;
                return;
            }
            //get current selection
            //if the temp node is empty then we need to check if it is selected before removing
            const range = document.getSelection()?.getRangeAt(0);
            const selection = new Selection({contentNode: clonedState.contentNode, jsRange: range});
            if(selection.isCollapsed){
                //if the temp node is selected we do nothing - it's still a temp node, but may become permanent if text is added
                if(selection.startNode === e) return;
            }
            //if we reach here that means we've got an unselected empty temp node
            //we need to remove the node
            //and hence a state change is definitely going to take place
            let nodeToRemove = e;
            stateIsChanged = true;
            //it may be the case that the temp node has exclusive formatting/ styling applied to it
            //in this instance the formatting/ styling becomes redundant so we delete the top exclusive formatting/ styling node 
            const tagNames = ["b", "i", "u", "s", "span"];
            while(nodeToRemove.parent?.children.length === 1 && tagNames.indexOf(nodeToRemove.parent?.tagName) >= 0){
                nodeToRemove = nodeToRemove.parent;
            }
            //save reference to the parent of removed node before we actually remove it
            const parent = nodeToRemove.parent;
            //if we want to preserve selection then we need to save it before node removal
            //this is because the JS selection api does not always behave predictably when DOM is modified
            clonedState.selectionChange = new Selection({contentNode: clonedState.contentNode, jsRange: range});
            //remove node
            nodeToRemove.remove(false);
            //node is removed hence we can also remove it's temporary reference
            clonedState.temporaryTextNodeRefs = clonedState.temporaryTextNodeRefs.filter(x => x !== e);
            //finally, by removing a text (or parent formatting) node we may have left unnecessairly fragmented text nodes
            //run text node reduction algorithm on parent to fix issue
            if(parent) clonedState.selectionChange = reduceTextNodes(parent, clonedState.selectionChange);
        });
        //only commit the state changes if there was a change, otherwise the cloning of state itself will cause an infinite loop
        if(stateIsChanged){
            //we commit the updated temp node ref array and any clean-up changes to state
            //but this state change is not saved to priorState stack as it is a background task
            core.updateState(clonedState, false);
        }
    }
}