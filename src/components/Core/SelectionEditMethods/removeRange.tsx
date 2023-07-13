import { BallpointNode } from "../Node/BallpointNode";
import { IBallpointNode } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { reduceTextNodes } from "../TreeMethods/reduceTextNodes";

export function removeRange(contentNode: BallpointNode, selection: Selection) : Selection {
    //handle special case when range is contained within a single text node
    //in this case can short-circuit the method early as this is a simple slicing of text
    if(selection.startNode === selection.endNode && selection.startNode?.tagName === "#text"){
        selection.startNode.text = selection.startNode.text.slice(0, selection.startTextOffset) +  selection.startNode.text.slice(selection.endTextOffset);
        //if slicing of start node text results in a empty text node
        //we add a special placeholder character to avoid unwanted caret behaviour
        if(selection.startNode.text.length === 0) {
            selection.startNode.text = '\u200B';
            return new Selection({contentNode, startNode: selection.startNode, startTextOffset: 1});
        }
        //we return a collapsed selection, which points to the start of the orignal range selection
        return new Selection({contentNode, startNode: selection.startNode, startTextOffset: selection.startTextOffset});
    }
    //get common ancestor subtree in flat nodes format
    const flatNodeTree = selection.commonAncestorNode.toFlatNodeTree();
    const ixFlatStartNode = flatNodeTree.findIndex(e => e.nodeRef === selection.startNode);
    const ixFlatEndNode = flatNodeTree.findIndex(e => e.nodeRef === selection.endNode);

    //slice away flat node tree to in-between start and end node
    const flatInBetweenTree = flatNodeTree.slice(ixFlatStartNode + 1, ixFlatEndNode);
    //split nodes in flat tree between fully encapsulated nodes and partially affected nodes
    //we exclude partially affected nodes that haven't got a start tag as they will include the effective start node (so we can't delete them later)
    const fullyEncapsulatedNodes: Array<IBallpointNode> = [];
    const partiallyAffactedNodes: Array<IBallpointNode> = [];
    flatInBetweenTree.forEach(e => {
        const nodeId = e.nodeRef.id;
        const hasStartTag = flatInBetweenTree.findIndex(x => x.nodeRef.id === nodeId && x.isNodeStart === true) >= 0;
        const hasEndTag = flatInBetweenTree.findIndex(x => x.nodeRef.id === nodeId && x.isNodeEnd === true) >= 0;

        if(hasStartTag && hasEndTag){
            fullyEncapsulatedNodes.push(e.nodeRef);
        }
        else if(hasStartTag) {
            partiallyAffactedNodes.push(e.nodeRef);
        }
    });
    //remove fully encapsulated nodes from tree
    fullyEncapsulatedNodes.forEach(e => {
        e.remove(false);
    });
    //end node handling - we slice text nodes according to offset and remove all other nodes
    if(selection.endNode.tagName === "#text"){
        //we add a placeholder char if slicing results in an empty text node
        selection.endNode.text = selection.endTextOffset >= selection.endNode.text.length ? '\u200B' : selection.endNode.text.slice(selection.endTextOffset);
    }
    else {
        selection.endNode.remove(false);
    }
    //start node handling - we slice text nodes according to offset and do nothing for all other nodes because caret is in front of those nodes
    if(selection.startNode.tagName === "#text"){
        //we add a placeholder char if slicing results in an empty text node
        selection.startNode.text = selection.startTextOffset === 0 ? '\u200B' : selection.startNode.text.slice(0, selection.startTextOffset);
    }
    //check any of the partially affected nodes for emptiness after the fully encapsulated nodes were removed and end/start nodes were modified
    //if they are empty - remove them
    partiallyAffactedNodes.forEach(e => {
        if(!e.nodeHasText()){
            e.remove(false);
        }
    });
    //generate a new collapsed selection once tree editing operations were finished
    let newSelection = new Selection({contentNode, startNode: selection.startNode, startTextOffset: selection.startTextOffset});
    //we want to consolidate fragmented text nodes before we return
    //we pass the new selection to the text reduction function as it may need to be transferred to a different consolidated node
    return reduceTextNodes(selection.commonAncestorNode, newSelection);
}