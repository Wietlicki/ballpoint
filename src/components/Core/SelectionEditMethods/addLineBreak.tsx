import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";
import { splitNode } from "../TreeMethods/splitNode";

export function addLineBreak(contentNode: BallpointNode, node: BallpointNode, textOffset: number): Selection{
    //if selected node is text then we need to split the affected text node into two and insert br in between
    if(node.tagName === "#text"){

        const splitNodes = splitNode(node, textOffset);
        const breakIndex = splitNodes[0].parent ? splitNodes[0].parent.children.indexOf(splitNodes[0]) + 1 : undefined;
        new BallpointNode("br", splitNodes[0].parent, breakIndex);

        return new Selection({contentNode, startNode: splitNodes[1], startTextOffset: 0});
    }
    //if the selected node is not a text node then we just insert br at point of selection
    else {
        //if the selection is on the content node itself then we want to move the selection the beginning of the first paragraph
        //if the content node has no children, then we create a paragraph and add a line break to it
        //if the first child of content node is a paragraph or header then we add a line break to it
        //otherwise the first node will have to be a list node or something spurious and so we just return the same selection
        if(node === contentNode){
            const phTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
            if(node.children.length === 0){
                const firstParagraph = new BallpointNode("p", contentNode, 0);
                return addLineBreak(contentNode, firstParagraph, 0)
            }
            else if (phTags.includes(node.children[0].tagName)){
                return addLineBreak(contentNode, node.children[0], 0);
            }
            return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
        }
        else if(node.parent){
            //get index of selected node within parent
            const ixNode = node.parent.children.indexOf(node);
            //handle special trailing br case
            //we also add a placeholder text after a br to the end of parent node
            //this is because we want to be sure the carret is set to the new line
            if(ixNode === node.parent.children.length - 1){
                new BallpointNode("br", node.parent, -1);
                const placeHolderTextNode = new BallpointNode("br", node.parent, -1);
                placeHolderTextNode.text = '\u200B';
                return new Selection({contentNode, startNode: placeHolderTextNode, startTextOffset: 0});
            }
            const brNode = new BallpointNode("br", node.parent, ixNode + 1);
            return new Selection({contentNode, startNode: brNode, startTextOffset: 0});
        }
        //should never reach here as any other node than the content node should have a parent
        //if we do reach this point then do nothing
        return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
    }
}