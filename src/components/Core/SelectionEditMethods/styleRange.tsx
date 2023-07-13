import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";
import { reduceFormatting } from "../TreeMethods/reduceFormatting";
import { reduceTextNodes } from "../TreeMethods/reduceTextNodes";
import { removeRedundantStyling } from "../TreeMethods/removeRedundantStyling";
import { splitNode } from "../TreeMethods/splitNode";

export function styleRange(
    contentNode: BallpointNode, 
    selection: Selection, 
    stylePropName: string, 
    stylePropValue: string) : Selection 
{
    //split end and start nodes of range if they are text nodes
    //this is necessary to apply formatting inline with selection
    //there is a special case here if the selection is within one text node and we will need a 3-way split
    if(selection.startNode === selection.endNode && selection.startNode?.tagName === "#text"){
        let textParts = [
            selection.startNode.text.slice(0, selection.startTextOffset), 
            selection.startNode.text.slice(selection.startTextOffset, selection.endTextOffset),
            selection.startNode.text.slice(selection.endTextOffset)
        ];
        const middleTextNode = new BallpointNode("#text", selection.startNode.parent);
        middleTextNode.text = textParts[1];

        const splitNodes = splitNode(selection.startNode, selection.startTextOffset, middleTextNode);
        splitNodes[2].text = textParts[2];

        //by definition the middle text node needs to have some text in it (as range not collapsed), but remove the before and after nodes if empty
        if(splitNodes[0].text.length === 0 || splitNodes[0].text === '\u200B') splitNodes[0].remove(false);
        if(splitNodes[2].text.length === 0 || splitNodes[2].text === '\u200B') splitNodes[2].remove(false);    

        //set selection as entire range of middle text node
        selection = new Selection({contentNode, startNode: middleTextNode, endNode: middleTextNode, startTextOffset: 0, endTextOffset: middleTextNode.text.length});
    }
    else {
        //only split start text node if offset is greater 0 as otherwise the whole node is being formatted
        if(selection.startNode?.tagName === "#text" && selection.startTextOffset > 0){
            const newStartNode = splitNode(selection.startNode, selection.startTextOffset)[1];
            selection = new Selection({contentNode, startNode: newStartNode, endNode: selection.endNode, startTextOffset: 0, endTextOffset: selection.endTextOffset});
        }
        //only split end text node if the offset is smaller than the length of text as otherwise the whole node is being formatted
        if(selection.endNode?.tagName === "#text" && selection.endTextOffset < selection.endNode.text.length){
            const newEndNode = splitNode(selection.endNode, selection.endTextOffset)[0];
            selection = new Selection({contentNode, startNode: selection.startNode, endNode: newEndNode, startTextOffset: selection.startTextOffset, endTextOffset: newEndNode.text.length});
        }
    }
    //if there is a selection error and it doesn't have a common ancestor - do nothing
    if(!selection.commonAncestorNode) return selection;
    //get common ancestor subtree in flat nodes format
    const flatNodeTree = selection.commonAncestorNode.toFlatNodeTree();
    const ixFlatStartNode = flatNodeTree.findIndex(e => e.nodeRef === selection.startNode);
    const ixFlatEndNode = flatNodeTree.findIndex(e => e.nodeRef === selection.endNode);

    //get all text nodes within selection
    const selectedTextNodes = flatNodeTree
        .slice(ixFlatStartNode, ixFlatEndNode + 1)
        .filter(e => e.tagName === "#text" || e.tagName === "br")
        .map(e => e.nodeRef);

    selectedTextNodes.forEach(e => {
        const formatInfo = e.getNodeFormatInfo();
        if(formatInfo.effectiveStyle[stylePropName]?.value !== stylePropValue){
            e.wrap("span", {[stylePropName]: stylePropValue});
        }
    });
    //because we wrapped text nodes with new styling spans we also likely made some existing
    //styling properties and/or nodes redundant and we want to remove them
    removeRedundantStyling(contentNode, stylePropName);

    //because we've likely wrapped at least some text and br nodes with the styling span nodes
    //we are going to end up with an unnecessairly high number of the same styling span nodes
    //we can run the formatting reduction algorithm with a style param on the selection common ancestor to clean this up
    reduceFormatting(contentNode, "span", {[stylePropName]: stylePropValue});

    //once formatting has been reduced, we may now have unnecessairly fragmented text nodes
    //we can run the text node reduction algorithm to clean this up
    //since this will affect tree and possibly the selection we want to pass the new selection to the algorithm
    return reduceTextNodes(contentNode, selection);
}