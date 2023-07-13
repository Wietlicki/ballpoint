import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";

const keySubstitution = (key: string) => {
    const map : {[key:string]: string} = {
        " ": "\xA0"
    };
    return map[key] ? map[key] : key;
}
const cleanAndSelectTextNode = (contentNode: BallpointNode, node: BallpointNode, offset: number): Selection | null => {
    if(node.tagName !== "#text") return null;
    //regex for placeholder character
    const rgx = /\u200B/gi;
    const charsFound = node.text.match(rgx)?.length ?? 0;

    if(charsFound === 0) {
        //don't need to do anything
        return new Selection({contentNode: contentNode, startNode: node, startTextOffset: offset});
    }
    else {
        //to find out the number by which we need to reduce offset need to search
        //the part of the node text that is before offset for the placeholder char
        const offsetDecrease = node.text.slice(0, offset).match(rgx)?.length ?? 0;
        //remove all placeholder chars
        node.text = node.text.replace(rgx,"");
        //return modified selection
        return new Selection({contentNode: contentNode, startNode: node, startTextOffset: offset - offsetDecrease});
    }
}
export function addChar(contentNode: BallpointNode, node: BallpointNode, offset: number, char: string): Selection | null {
    if(node.tagName === "#text"){
        node.text = node.text.slice(0, offset) + keySubstitution(char) + node.text.slice(offset);
        //increase end offset after character is added
        return cleanAndSelectTextNode(contentNode, node, offset + 1);
    }
    else {
        //if the selection is on the content node itself then we want to move the selection the beginning of the first paragraph or first list item
        //if that paragraph or list does not exist, then we create a paragraph
        //in the scenario where a list is at the start of the content we also need to a add a list item
        if(node === contentNode){
            let firstNode = ["p", "ul"].includes(contentNode.children[0]?.tagName) ? contentNode.children[0] : null;
            if(!firstNode){
                firstNode = new BallpointNode("p", contentNode, 0);
            }
            else if(firstNode.tagName === "ul"){
                const firstItem = firstNode.getFirstChildWithTagName("li");
                firstNode = firstItem ?? new BallpointNode("li", firstNode, 0);
            }
            return addChar(contentNode, firstNode, 0, char);
        }
        //since we're looking at a char being added, this requires a text node at the 
        //start of the children array for the selected node
        //if that text node exists, we can modify it then select it. Otherwise the text node needs to be created
        if(node !== contentNode && node?.tagName !== "br"){
            let affectedTextNode = node.children[0]?.tagName === "#text" ? node.children[0] : null;
            //if there isn't a text node at start of children array then create it and select it
            if(!affectedTextNode){
                affectedTextNode = new BallpointNode("#text", node, 0);
            }
            affectedTextNode.text = keySubstitution(char) + affectedTextNode.text;
            //increase end offset after character is added
            return new Selection({contentNode: contentNode, startNode: affectedTextNode, startTextOffset: 1});
        }
        //if the selected node is a br then because it is a closed node it cannot have a child text node.
        //if there is a text node right after the br then we can just prepend text to it
        //otherwise we have to create a text node after the br
        const nodeIx = node.parent?.children.indexOf(node) ?? -1;
        if(node.parent && nodeIx > -1 && node?.tagName === "br"){
            if(nodeIx > 0 && node.parent.children[nodeIx - 1].tagName === "#text"){
                const affectedTextNode = node.parent.children[nodeIx - 1];
                affectedTextNode.text = keySubstitution(char) + affectedTextNode.text;

                return cleanAndSelectTextNode(contentNode, affectedTextNode, 1);
            }
            else {
                const newTextNode = new BallpointNode("#text", node.parent, nodeIx + 1);
                newTextNode.text = keySubstitution(char);

                return new Selection({contentNode: contentNode, startNode: newTextNode, startTextOffset: 1});
            }
        }
        //Should never reach here
        return null;
    }
}