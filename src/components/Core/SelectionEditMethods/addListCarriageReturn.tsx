import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";
import { splitNode } from "../TreeMethods/splitNode";

export function addListCarriageReturn(contentNode: BallpointNode, node: BallpointNode, textOffset: number): Selection{
    if(node.tagName === "ul" || node.tagName === "ol"){
        //if we select an empty list, then carriage return converts it into a paragraph
        if(node.children.length === 0){
            node.tagName = "p";
            //add placaholder text node
            const textNode = new BallpointNode("#text", node, 0);
            textNode.text = '\u200B';
            //select the placeholder text node
            return new Selection({contentNode, startNode: textNode, startTextOffset: 0});
        }
        //otherwise we change selection to first list item and proceed as normal
        else {
            //there may be a spurious case where the list has a child that is not a list item
            //but doesn't have any list items. We add a list item at the start in that case and move selection to it
            node = node.getFirstChildWithTagName("li") ?? new BallpointNode("li", node, 0);
        }
    }
    let listItem = node.tagName === "li" ? node : node.findParentWithTagName("li");
    //if the affected list item is empty then we replace it with a paragraph
    //this means we will effectively need to split the parent list with a paragraph
    if(listItem && (listItem.children.length === 0 || !listItem.nodeHasText()) && listItem.parent){
        //split the parent list at list item index
        let splitLists = splitNode(listItem.parent, listItem.parent.children.indexOf(listItem));
        //remove list item
        listItem.remove(false);
        //insert paragraph between lists
        const ixParagraph = splitLists[0].parent ? splitLists[0].parent.children.indexOf(splitLists[0]) + 1 : undefined;
        const paragraph = new BallpointNode("p", splitLists[0].parent, ixParagraph);
        const textNode = new BallpointNode("#text", paragraph, 0);
        textNode.text = '\u200B';
        //remove the split lists if they are empty
        splitLists.forEach(e => { if(e.children.length === 0) e.remove(false);});
        //select the paragraph text node
        return new Selection({contentNode, startNode: textNode, startTextOffset: 0});
    }
    //set a null selection
    let selection = null;
    const fallbackSelection = new Selection({contentNode, startNode: node, startTextOffset: textOffset});
    //split the node tree into two list items starting with the selected node
    //the loop will effectively keep splitting the tree until it arrives at the list node level
    let offset = textOffset;
    if(node.tagName !== "#text" && node.parent){
        node = node.parent;
        offset = node.parent ? node.parent.children.indexOf(node) + 1 : 0;
    }
    while(node && node !== contentNode && node.parent && node.tagName !== "ul" && node.tagName !== "ol"){
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