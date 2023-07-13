import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";

type NodeGroup = {
    selectionStartNodeIx?: number,
    selectionEndNodeIx?: number,
    nodes: Array<BallpointNode>
}
export function reduceTextNodes(node: BallpointNode, selection: Selection, shallow?: boolean){
    //text reduction can only happen on a node with at least 2 children
    //skip to the next level in tree otherwise
    if(node.children.length > 1){
        //define a helper function to add text offset of consecutive text nodes
        //to help selection handling in a text node merge scenario
        const reduceTextOffset = (textNodes: Array<BallpointNode>, nodeIx: number, nodeOffset: number) => {
            return nodeOffset + textNodes
                .slice(0, nodeIx)
                .map(x => x.text.length)
                .reduce((a, b) => a + b, 0);
        }
        //define a recursive function to group consecutive text nodes
        const processNext = (nodes: Array<BallpointNode>, nodeGroups?: Array<NodeGroup>, previousNode?: BallpointNode): Array<NodeGroup> =>{
            if(!nodeGroups) nodeGroups = [];
            const currentNode = nodes.shift();
            //if no more nodes to read - return groups
            if(!currentNode) return nodeGroups;
            //add a new node group when the current node is a formatting node, but the previous wasn't
            if(currentNode.tagName === "#text" && previousNode?.tagName !== "#text") nodeGroups.push({nodes:[]});
            //add selection information to node group
            const lastNodeGroup = nodeGroups.at(-1);
            if(lastNodeGroup && currentNode === selection?.startNode) lastNodeGroup.selectionStartNodeIx = lastNodeGroup.nodes.length;
            if(lastNodeGroup && currentNode === selection?.endNode) lastNodeGroup.selectionEndNodeIx = lastNodeGroup.nodes.length;
            //if current node is a text node then add it to last node group
            if(lastNodeGroup && currentNode.tagName === "#text") lastNodeGroup.nodes.push(currentNode);
            //read next node
            //pass current node as previous node to the recursive function
            return processNext(nodes, nodeGroups, currentNode);
        }
        //allocate children into reduceable text node groups
        //we want to clone the child array to avoid modifying it on the target node when processing
        const children = [...node.children];
        const reduceableGroups = processNext(children).filter(e => e.nodes.length > 1);

        //for every reduceable group we copy text of all nodes into the first text node
        reduceableGroups.forEach(e => {
            const nodes = [...e.nodes];
            const firstNode = nodes.shift();
            if(firstNode){
                //we need to modify selection if it falls within one of the merged text nodes
                if(e.selectionStartNodeIx && e.selectionStartNodeIx >= 0){
                    //set selection node to first node
                    selection.startNode = firstNode;
                    //add text length of all previous nodes in mergable group to offset
                    selection.startTextOffset = reduceTextOffset(e.nodes, e.selectionStartNodeIx, selection.startTextOffset);
                }
                if(e.selectionEndNodeIx && e.selectionEndNodeIx >= 0){
                    //set selection node to first node
                    selection.endNode = firstNode;
                    //add text length of all previous nodes in mergable group to offset
                    selection.endTextOffset = reduceTextOffset(e.nodes, e.selectionEndNodeIx, selection.endTextOffset);
                }
                //copy text of each other text node to first node
                //then remove that other node from tree
                nodes.forEach(x => {
                    firstNode.text += x.text;
                    x.remove(false);
                });
            }
        });
    }
    //run reduction on next level in tree, unless we're running a shallow text reduction
    if(shallow !== true) node.children.forEach(e => reduceTextNodes(e, selection));
    //return selection
    return selection;
}