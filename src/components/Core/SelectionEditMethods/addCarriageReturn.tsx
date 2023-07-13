import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { addListCarriageReturn } from "./addListCarriageReturn";
import { addParagraphOrHeader } from "./addParagraphOrHeader";

export function addCarriageReturn(contentNode: BallpointNode, node: BallpointNode, textOffset: number){
    const phTags: Array<TagNames> = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    const phlTags: Array<TagNames> = [...phTags, "ul", "ol"];
    //first check if there already is a paragraph / list structure
    //if content is created directly under the content node then wrap it in a paragraph
    if(contentNode.children.findIndex(e => phlTags.includes(e.tagName)) === -1){
        let firstParagraph = new BallpointNode("p", contentNode);
        //set children of content node as children of new paragraph
        //this also involves changing the parent property of each child
        contentNode.children.forEach(e => { e.parent = firstParagraph });
        firstParagraph.children = contentNode.children;
        //modify content node children to a singleton array with the first paragraph
        contentNode.children = [firstParagraph];
    }
    //the choice node will be the paragraph/ header/ list just below the content node
    //this will either be the selected node or a parent of it
    const choiceNode = phlTags.includes(node.tagName) ? node : node.findParentWithTagName(phlTags);
    //add paragraph to content node if we don't have a header, list or paragraph
    if(!choiceNode) return addParagraphOrHeader(contentNode, contentNode, 0);
    //carriage return results in a new paragraph or header
    if(phTags.includes(choiceNode?.tagName)) return addParagraphOrHeader(contentNode, node, textOffset);
    //carriage return results in a new list item
    if(choiceNode?.tagName === "ul" || choiceNode?.tagName === "ol") return addListCarriageReturn(contentNode, node, textOffset);
    //this should never happen, but if we don't have a choice node - do nothing
    return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
}