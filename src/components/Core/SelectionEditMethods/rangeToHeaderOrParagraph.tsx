import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { splitNode } from "../TreeMethods/splitNode";

export function rangeToHeaderOrParagraph(contentNode: BallpointNode, tag: TagNames, selection: Selection) : Selection {
    //get selection as child arrays of content node
    const selectionStartIxArray = contentNode.getChildIndexArray(selection.startNode);
    const selectionEndIxArray = contentNode.getChildIndexArray(selection.endNode);

    //what if selection directly on content node?
    if(selectionStartIxArray.length === 0 || selectionEndIxArray.length === 0){
        return selection;
    }
    const formattedNodes = contentNode.children.slice(selectionStartIxArray[0], selectionEndIxArray[0] + 1);

    formattedNodes.forEach((e, i) => {
        if(["p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(e.tagName)) e.tagName = tag;
        if(["ul", "ol"].includes(e.tagName)){
            //selection starts before list and ends after list
            if(i > 0 && i < formattedNodes.length - 1){
                //convert all list items belonging to this list into paragraphs or headers
                e.children.forEach(x => x.tagName === "li" ? x.tagName = tag : x.tagName);
                //remove the list node, but preserve the children
                e.remove(true);
            }
            //selection starts and ends within list
            if(i === 0 && formattedNodes.length === 1){
                //split list at selection start
                let startIx = selectionStartIxArray[1];
                let splitOne = splitNode(e, startIx);
                //split list again factoring in the end index change due to previous split
                let endIx = selectionEndIxArray[1] - startIx;
                let splitTwo = splitNode(splitOne[1], endIx + 1);
                //convert list items of the middle of the split list into paragraphs or headers
                splitTwo[0].children.forEach(x => x.tagName === "li" ? x.tagName = tag : x.tagName);
                //remove the middle list node, but preserve the children
                splitTwo[0].remove(true);
                //remove the first part of the first split if it ends up being an empty list
                if(splitOne[0].children.length === 0) splitOne[0].remove(false);
                //remove the second part of the second split if it ends up being an empty list
                if(splitTwo[1].children.length === 0) splitTwo[1].remove(false);
            }
            //selection starts within list, but does not end within list
            if(i === 0 && formattedNodes.length > 1){
                //split list at selection start
                let startIx = selectionStartIxArray[1];
                let splitOne = splitNode(e, startIx);
                //convert list items of the second part of the split list into paragraphs or headers
                splitOne[1].children.forEach(x => x.tagName === "li" ? x.tagName = tag : x.tagName);
                //remove the second list node, but preserve the children
                splitOne[1].remove(true);
                //remove the first part of the split if it ends up being an empty list
                if(splitOne[0].children.length === 0) splitOne[0].remove(false);
            }
            //selection does not start within list, but ends within list
            if(i > 0 && i === formattedNodes.length - 1){
                //split list at selection end
                let endIx = selectionEndIxArray[1];
                let splitOne = splitNode(e, endIx + 1);
                //convert list items of the first part of the split list into paragraphs or headers
                splitOne[0].children.forEach(x => x.tagName === "li" ? x.tagName = tag : x.tagName);
                //remove the first list node, but preserve the children
                splitOne[0].remove(true);
                //remove the second part of the split if it ends up being an empty list
                if(splitOne[1].children.length === 0) splitOne[1].remove(false);
            }
        }
    });
    return selection;
}