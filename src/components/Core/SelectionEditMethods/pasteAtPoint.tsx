import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { splitNode } from "../TreeMethods/splitNode";
import { addParagraphOrHeader } from "./addParagraphOrHeader";

export function pasteAtPoint(contentNode: BallpointNode, pasteContainerNode: BallpointNode, node: BallpointNode, textOffset: number){
    const phTags: Array<TagNames> = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];

    //prepend children from pastable content when paste is at the beginning of the content node
    if(node === contentNode){
        pasteContainerNode.migrateChildren(contentNode, 0);
        return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
    }
    //when selection is directly below the content node then we insert pastable content at the point of selection
    if(contentNode.children.includes(node)){
        pasteContainerNode.migrateChildren(contentNode, contentNode.children.indexOf(node));
        //if selection is on an empty list - morph it into a paragraph (the next step will add a placeholder node to it)
        if(["ul", "ol"].includes(node.tagName) && node.children.length === 0){
            node.tagName = "p";
        }
        //if selected node is an empty paragraph or header then add a placeholder node and return a selction for it
        if(phTags.includes(node.tagName) && node.children.length === 0){
            const placeholderNode = new BallpointNode("#text", node, 0);
            placeholderNode.text = "\u200B";
            return new Selection({contentNode, startNode: placeholderNode, startTextOffset: 0});
        }
        //return the same selection
        return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
    }
    if(pasteContainerNode.children.length > 0) {
        const selectionIxArray = contentNode.getChildIndexArray(node);

        if(phTags.includes(contentNode.children[selectionIxArray[0]].tagName)){
            //add new paragraph or header and find its index within the content node
            const newSelection = addParagraphOrHeader(contentNode, node, textOffset);
            const newPH = newSelection.startNode.findParentWithTagName(phTags);
            const ixNewPH = newPH ? contentNode.children.indexOf(newPH) : 0;
            //insert pasted content in-between the split paragraph or header
            pasteContainerNode.migrateChildren(contentNode, ixNewPH);
            return newSelection;
        }
        if(["ul", "ol"].includes(contentNode.children[selectionIxArray[0]].tagName)){
            const splitList = splitNode(contentNode.children[selectionIxArray[0]], selectionIxArray[1] + 1, pasteContainerNode.children);
            //if the first part of the split list is empty then remove it
            if(splitList[0].children.length === 0) splitList[0].remove(false);
            //if the second part of the split list (after pasted content) is empty then convert into a paragraph
            //also add a placeholder node for selection purposes
            const splitListAfter = splitList.at(-1);
            if(splitListAfter && splitListAfter.children.length === 0) {
                splitListAfter.tagName = "p";
                const placeholderNode = new BallpointNode("#text", splitListAfter, 0);
                placeholderNode.text = "\u200B";
                return new Selection({contentNode, startNode: placeholderNode, startTextOffset: 0});
            }
            return new Selection({contentNode, startNode: splitList.at(-1), startTextOffset: 0});
        }
    }
    return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
}