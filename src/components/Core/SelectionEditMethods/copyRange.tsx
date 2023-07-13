import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";
import { splitNode } from "../TreeMethods/splitNode";

export function copyRange(contentNode: BallpointNode, jsRange: Range): BallpointNode{
    //clone the content node and map selection to it using the current jsRange
    const contentNodeCopy = contentNode.clone();
    const selection = new Selection({contentNode: contentNodeCopy, jsRange});
    //if selection is within the same node then we can just extract it along with all of it's parents
    //foreach of it's parents we only consider the one child that is relevant to the selected node
    if(selection.startNode === selection.endNode){
        if(selection.startNode.tagName === "#text") selection.startNode.text = selection.startNode.text.slice(selection.startTextOffset, selection.endTextOffset);
        let node = selection.startNode;
        while(node !== contentNodeCopy && node.parent){
            node.parent.children = [node];
            node = node.parent;
        }
        return contentNodeCopy;
    }

    //split any text nodes before generating flat tree
    if(selection.startNode.tagName === "#text" && selection.startTextOffset > 0 && selection.startTextOffset < selection.startNode.text.length){
        selection.startNode = splitNode(selection.startNode, selection.startTextOffset)[1];
        selection.startTextOffset = 0;
    }
    if(selection.endNode.tagName === "#text" && selection.endTextOffset > 0 && selection.endTextOffset < selection.endNode.text.length){
        selection.endNode = splitNode(selection.endNode, selection.endTextOffset)[0];
        selection.endTextOffset = selection.endNode.text.length;
    }

    const flatNodeTree = contentNodeCopy.toFlatNodeTree();

    //remove all nodes that have a closing tag prior to the opening tag of the selection start node
    const ixStart = flatNodeTree.findIndex(e => e.nodeRef === selection.startNode && e.isNodeStart === true);

    flatNodeTree.slice(0, ixStart)
        .filter(e => e.isNodeEnd === true)
        .forEach(e => e.nodeRef.remove(false));

    //remove all nodes that have a opening tag after the closing tag of the selection end node
    const ixEnd = flatNodeTree.findIndex(e => e.nodeRef === selection.endNode && e.isNodeEnd === true);

    flatNodeTree.slice(ixEnd + 1)
        .filter(e => e.isNodeStart === true)
        .forEach(e => e.nodeRef.remove(false));

    return contentNodeCopy;
}