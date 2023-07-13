import { BallpointNode } from "../Node/BallpointNode";

export function removeRedundantStyling(node: BallpointNode, stylePropName: string) {
    const getStylingNodes = (node: BallpointNode, stylePropName: string, bottomNodes: Array<BallpointNode>) => {
        if(node.children.length === 0) bottomNodes.push(node);
        let current = node.style && node.style[stylePropName] !== undefined ? [node]: [];
        node.children.forEach(e => {
            current = [...current, ...getStylingNodes(e, stylePropName, bottomNodes)];
        });
        return current;
    }
    const getEffectiveStyleNode = (node: BallpointNode, stylePropName: string) => {
        while(node.parent){
            if(node.style && node.style[stylePropName]) return node;
            node = node.parent;
        }
        return null;
    }
    let bottomNodes: Array<BallpointNode> = [];
    const stylingNodes = getStylingNodes(node, stylePropName, bottomNodes);

    //get all unique styled nodes that are effective given the array of bottom nodes
    let effectiveStyleNodes = bottomNodes.map(e => getEffectiveStyleNode(e, stylePropName));
    effectiveStyleNodes = [...new Set(effectiveStyleNodes)];

    //detect and remove redundant styling props by filtering out effective style nodes from the list of styling nodes
    //A whole styling node is redundant if it has only a single style prop and that prop is redundant
    stylingNodes.filter(e => !effectiveStyleNodes.includes(e)).forEach(e => {
        if(e.style){
            //delete style prop from style object
            if(Object.keys(e.style).includes(stylePropName)) delete e.style[stylePropName];
            //if style object ends up being empty and the node is a span then remove, but shift preserve children
            if(e.tagName === "span" && Object.keys(e.style).length < 1) e.remove(true);
        }
    });
}