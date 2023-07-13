import { BallpointNode } from "../Node/BallpointNode";
import { splitNode } from "../TreeMethods/splitNode";
import { Selection } from "../Selection/Selection";

export function addParagraphOrHeader(contentNode: BallpointNode, node: BallpointNode, textOffset: number): Selection {
    const phTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    let selection;
    let fallbackSelection = new Selection({contentNode, startNode: node, startTextOffset: textOffset});
    //if an empty paragraph or header is selected then we split it and add placeholder text nodes to both
    if(phTags.includes(node.tagName) && node.children.length === 0){
        let splitNodes = splitNode(node, 0);
        splitNodes.forEach(e => {
            const placeholderTextNode = new BallpointNode("#text", e, 0);
            placeholderTextNode.text = '\u200B';
        });
        return new Selection({contentNode, startNode: splitNodes[1].children[0], startTextOffset: 0});
    }
    //now split the node tree into two paragraphs or headers starting with the selected node
    //if the selected node is not a text node then we want to effectively split the parent after that node
    //the loop will effectively keep splitting the tree until it arrives at the content node level
    //because the paragraph/header level is just below that we should see a new paragraph or header underneath it with the correct subtree
    let offset = textOffset;
    if(node.tagName !== "#text" && node.parent){
        node = node.parent;
        offset = node.parent ? node.parent.children.indexOf(node) + 1 : 0;
    }
    while(node && node !== contentNode && node.parent){
        //obtain new offset and new node before tree is modified
        let newOffset = node.parent.children.indexOf(node) + 1;
        let newNode = node.parent;
        //split node
        let splitNodes = splitNode(node, offset);
        //setup selection
        //this should really happen after the very first split
        if(!selection && splitNodes){
            selection = new Selection({contentNode, startNode: splitNodes[1], startTextOffset: 0});
        }
        //update node and offset
        node = newNode;
        offset = newOffset;
    }
    return selection ?? fallbackSelection;
}