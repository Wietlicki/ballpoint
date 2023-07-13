import { BallpointNode } from "../Node/BallpointNode";

export function splitNode(node: BallpointNode, offset: number, insertNodes?: Array<BallpointNode> | BallpointNode) : Array<BallpointNode> {
    //cannot split a node without a parent
    if(!node.parent) return [node];
    //ensure insert nodes are an array and set their parent to parent of target node
    if(!insertNodes) insertNodes = [];
    else {
        if(!Array.isArray(insertNodes)) insertNodes = [insertNodes];
        insertNodes.forEach(e => e.parent = node.parent);
    }
    //start splitting
    if(node.tagName === "#text"){
        let breakIndex = node.parent.children.indexOf(node);
        let beforeText = node.text.slice(0, offset);
        let afterText = node.text.slice(offset);
        //in case the text split results in an empty text node
        //insert a zero-width placeholder character to avoid br issues
        if(beforeText.length === 0){
            beforeText = '\u200B';
        }
        if(afterText.length === 0){
            afterText = '\u200B';
        }
        //update text on node to 'before' text
        node.text = beforeText;
        //add an 'after' node and set it's text to 'after' text
        let afterNode = new BallpointNode("#text", node.parent);
        afterNode.text = afterText;
        //modify parent to reflect the split in it's child array
        node.parent.children = [
            ...node.parent.children.slice(0, breakIndex + 1), //include selected node
            ...insertNodes,
            afterNode, //insert the after node
            ...node.parent.children.slice(breakIndex + 1)
        ];
        //return the two nodes created as a result of the split
        return[node, ...insertNodes, afterNode];
    }
    else if(node.tagName !== "br"){ //br's are unsplittable as they cannot have children
        let breakIndex = node.parent.children.indexOf(node);
        let beforeChildren = node.children.slice(0, offset);
        let afterChildren = node.children.slice(offset);
        //update children on node to 'before' child nodes
        node.children = beforeChildren;
        //add an 'after' node with the same tag and style as node and assign 'after' children to it
        let afterNode = new BallpointNode(node.tagName, node.parent);
        afterNode.style = node.style;
        //transfer the 'after' children to the new 'after' node
        afterChildren.forEach(e => e.parent = afterNode);
        afterNode.children = afterChildren;
        //modify parent to reflect the split in it's child array
        node.parent.children = [
            ...node.parent.children.slice(0, breakIndex + 1), //include selected node
            ...insertNodes,
            afterNode, //insert the after node
            ...node.parent.children.slice(breakIndex + 1)
        ]
        //return the two nodes created as a result of the split
        return[node, ...insertNodes, afterNode];
    }
    //if the script reached here then the considered node must be a br, which is unsplittable
    return [node];
}