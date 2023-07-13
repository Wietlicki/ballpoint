import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";
import { reduceTextNodes } from "../TreeMethods/reduceTextNodes";

export function removeSingle(contentNode: BallpointNode, node: BallpointNode, textOffset: number): Selection | null {
    //if selection is at the very start of content - do nothing
    if(node === contentNode){
        return new Selection({contentNode, startNode: node, startTextOffset: 0});
    }
    if(node.tagName === "#text"){
        //if the text node is just a placeholder node then we cleanse it before modifying and update the offset
        const match = node.text.match(/^\u200B+$/gi);
        if(match){
            node.text = "";
            textOffset = 0;
        }
        //if the affected node is a non-empty text node and offset after the beginning of that node
        //then we can simply remove a character and short-circuit
        if(node.text.length > 0 && textOffset > 0){
            //slice text according offset
            node.text = node.text.slice(0, textOffset - 1) + node.text.slice(textOffset);
            //if after the text has been modified we end up with an empty text node
            //then we may need to add a placeholder character to keep the cursor on the same line
            if(node.text.length === 0){
                node.text = "\u200B";
            }
            return new Selection({contentNode, startNode: node, startTextOffset: textOffset - 1});
        }
        //if we selected the beginning of a non-empty text node then we should remove previous
        if(node.text.length > 0 && textOffset === 0){
            const previousNode = node.getPreviousNode();
            //if there is a previous node then we run remove single on it
            //otherwise the text node must be at the start of content so we do nothing
            if(previousNode && previousNode.parent){
                return removeSingle(contentNode, previousNode, previousNode.tagName === "#text" ? previousNode.text.length : 0);
            }
            return new Selection({contentNode, startNode: node, startTextOffset: 0});
        }
        //when the selected is an empty text node then we need to remove it as well as previous
        if(node.text.length === 0){
            const previousNode = node.getPreviousNode();
            //remove empty text node
            node.remove(false);
            //if there is a previous node then we run remove single on it
            //otherwise the text node must be at the start of content so we select the content node
            if(previousNode && previousNode.parent){
                return removeSingle(contentNode, previousNode, previousNode.tagName === "#text" ? previousNode.text.length : 0);
            }
            return new Selection({contentNode, startNode: contentNode, startTextOffset: 0});
        }
    }
    if(node.tagName === "br" && node.parent){
        let previousNode = node.getPreviousNode();
        //we will run a shallow text reduction if the br has a text sibling directly before and after it
        //this is because after we remove the br we will have two text node siblings next to each other
        const nodeIx = node.parent?.children.indexOf(node);
        const runTextReduction = nodeIx > 0 && 
            node.parent.children[nodeIx - 1]?.tagName === "#text" && 
            node.parent.children[nodeIx + 1]?.tagName === "#text";
        const textReductionAncestor = node.parent;
        //remove the br
        node.remove(false);
        //ensure we don't leave an empty paragraph
        if(previousNode?.tagName === "p" && previousNode.children.length === 0){
            const textNode = new BallpointNode("#text", previousNode, 0);
            textNode.text = "\u200B";
            previousNode = textNode;
        }
        //return the selection on the end of the previous node
        //select content node, if there isn't a previous node or it's the content node (i.e. doesn't have a parent)
        let selection = (previousNode && previousNode.parent) ? 
            new Selection({contentNode, startNode: previousNode, startTextOffset: previousNode.tagName === "#text" ? previousNode.text.length : 0}) :
            new Selection({contentNode, startNode: contentNode, startTextOffset: 0});
        //run a shallow text reduction if necessary
        return runTextReduction ? reduceTextNodes(textReductionAncestor, selection, true) : selection;
    }
    //the functionality of removing a paragraph or header is as follows:
    //option 1: if there is a p or h directly before it, we transfer the children over to previous p or h, then delete p or h
    //option 2: if there isn't a p or h before it, we remove p or h, but lift the children up to parent level
    //given that we are blocking deletion of first p in content node, option 2 should never be triggered
    const phTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    if(phTags.includes(node.tagName)){
        //if selection set to the beginning of first paragraph or header - do nothing as we want to block deletion of first p
        if(contentNode.children.indexOf(node) === 0){
            if(node.children.length === 0){
                const textNode = new BallpointNode("#text", node, 0);
                textNode.text = "\u200B";
            }
            return new Selection({contentNode, startNode: node, startTextOffset: 0});
        }
        const previousNode = node.getPreviousNode();

        //we need to check if there is a paragraph or header directly before the removed paragraph or header
        const ixNode = node.parent?.children.indexOf(node) ?? -1;
        if(ixNode > 0 && node.parent &&  phTags.includes(node.parent.children[ixNode - 1].tagName)){
            const previousPH = node.parent.children[ixNode - 1];
            //migrate children of removed paragraph or header to end of previous paragraph or header
            node.migrateChildren(previousPH, previousPH.children.length);
            //remove paragraph or header
            node.remove(false);
        }
        else {
            //otherwise we remove the paragraph or header, but preserve children
            node.remove(true);
        }
        //return the selection on the previous node
        //select content node, if there isn't a previous node or it's the content node (i.e. doesn't have a parent)
        return (previousNode && previousNode.parent) ? 
            new Selection({contentNode, startNode: previousNode, startTextOffset: previousNode.tagName === "#text" ? previousNode.text.length : 0}) : 
            new Selection({contentNode, startNode: contentNode, startTextOffset: 0});
    }
    //the functionality of removing a list item is as follows:
    //option 1: if there is a li directly before it, we transfer the children over to previous li, then delete li
    //option 2: if there isn't a li before it, we remove li, insert a p before the ul, then transfer the children to the p
    //after item is removed any empty ul's need to be also removed
    if(node.tagName === "li"){    
        //select the previous node if possible
        let selection = null 
        //check if there is a list item directly before the removed list item
        const ixNode = node.parent?.children.indexOf(node) ?? -1;
        //if there is a preceding list item then we the children to it, then delete current item
        if(ixNode > 0 && node.parent && node.parent.children[ixNode - 1].tagName === "li"){
            //set selection to previous node, that will be some child of previous li or that li itself
            const previousNode = node.getPreviousNode();
            selection = (previousNode && previousNode.parent) ? 
                new Selection({contentNode, startNode: previousNode, startTextOffset: previousNode.tagName === "#text" ? previousNode.text.length : 0}) :
                new Selection({contentNode, startNode: contentNode, startTextOffset: 0});
            //get the previous li
            const previousItem = node.parent.children[ixNode - 1];
            //migrate children of removed list item to end of previous list item
            node.migrateChildren(previousItem, previousItem.children.length);
            //remove list item
            node.remove(false);
        }
        else if(ixNode === 0){
            const listNode = node.findParentWithTagName(["ul", "ol"]);
            if(listNode && listNode.parent){
                //we migrate list item's children to a new paragraph
                const ixListNode = listNode.parent.children.indexOf(listNode);
                //we create a new paragraph directly before list
                const newParagraph = new BallpointNode("p", listNode.parent, ixListNode);
                //now we migrate list item children to that paragraph
                node.migrateChildren(newParagraph, newParagraph.children.length);
                //if paragraph is empty we create a child placeholder text node
                //this will ensure predictable behaviour
                if(newParagraph.children.length === 0){
                    const placeholderNode = new BallpointNode("#text", newParagraph, 0);
                    placeholderNode.text = "\u200B";
                }
                //finally search for the first text node in new paragraph
                const firstTextNode = newParagraph.getFirstChildWithTagName("#text");
                //we selected the beginning of the first text node within paragraph or the paragraph itself
                //if the paragraph does not have a child text node
                selection = firstTextNode ? 
                    new Selection({contentNode, startNode: firstTextNode, startTextOffset: 0}) :
                    new Selection({contentNode, startNode: newParagraph, startTextOffset: 0});

                //we remove the list item in all cases
                node.remove(false);
                //and now we also remove parent list if that has made it empty
                if(listNode.children.length === 0){
                    listNode.remove(false);
                }
            }
        }
        return selection;
    }
    //when 'backspacing' over formatting and styling nodes we need to skip over it and remove the next node
    //BUT if the node has no children then it is redundant so we should also delete it along the way.
    //This caters for the scenario where the initial 'backspace' removed the only child text node of the styling/ formatting node
    if(["b", "i", "u", "span"].indexOf(node.tagName) >= 0){
        const previousNode = node.getPreviousNode();
        //select the previous node if possible
        let selection = (previousNode && previousNode.parent) ? 
            new Selection({contentNode, startNode: previousNode, startTextOffset: previousNode.tagName === "#text" ? previousNode.text.length : 0}) :
            new Selection({contentNode, startNode: contentNode, startTextOffset: 0});
        //remove inline container node if it's redundant
        if(node.children.length === 0){
            //save parent of styling/ formatting node first for text reduction
            const textReductionAncestor = node.parent;
            //remove styling/ formatting node
            node.remove(false);
            //run the text reduction algorithm to fix text node fragmentation
            //this will also update the previous node selection if necessary due to text reduction
            if(textReductionAncestor) selection = reduceTextNodes(textReductionAncestor, selection);
        }
        //run remove single on the previous node selection
        return selection.startNode ? removeSingle(contentNode, selection.startNode, selection.startTextOffset) : null;
    }

    const previousNode = node.getPreviousNode();
    if(previousNode && previousNode.parent){
        return removeSingle(contentNode, previousNode, previousNode.tagName === "#text" ? previousNode.text.length : 0);
    }
    return new Selection({contentNode, startNode: contentNode, startTextOffset: 0});
}