import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";

//styling nodes can be linearly combined
export function reduceFormatting(node: BallpointNode, tagName: TagNames, style: {[key: string]: string} | undefined, shallow: boolean = false){
    //define a fake template styling node to compare nodes against
    const templateNode = new BallpointNode(tagName, null, undefined, { style });
    //styling reduction can only happen on a node with at least 2 children
    //otherwise we can skip straight to the next level in the tree
    if(node.children.length > 1){
        const processNext = (nodes: Array<BallpointNode>, nodeGroups?: Array<Array<BallpointNode>>, previousNode?: BallpointNode): Array<Array<BallpointNode>> =>{
            if(!nodeGroups) nodeGroups = [];
            const currentNode = nodes.shift();
            //if no more nodes to read - return groups
            if(!currentNode) return nodeGroups;
            //add a new node group when the current node is a styling node, but the previous wasn't
            if(currentNode.compareTagAndStyle(templateNode) && !previousNode?.compareTagAndStyle(templateNode)) nodeGroups.push([]);
            //if current node is a styling node then add it to last node group
            if(currentNode.compareTagAndStyle(templateNode)) nodeGroups.at(-1)?.push(currentNode);
            //read next node
            //pass current node as previous node to the recursive function
            return processNext(nodes, nodeGroups, currentNode);
        }
        //allocate children into reduceable styling node groups
        //we want to clone the child array to avoid modifying it on the target node when processing
        const children = [...node.children];
        const reduceableGroups = processNext(children).filter(e => e.length > 0);

        //for every reduceable group we will move children of all nodes in the group into the first node
        //then we will remove those nodes without preserving children 
        reduceableGroups.forEach(e => {
            const nodes = e;
            const firstNode = nodes.shift();
            if(firstNode){
                //copy children of other nodes in group to first node
                //then remove that node from tree
                nodes.forEach(x => {
                    firstNode.children = [...firstNode.children, ...x.children];
                    x.remove(false);
                });
                //correct parent within child nodes
                //as copied children would have the wrong parent
                firstNode.children.forEach(x => x.parent = firstNode);
            }
        });
    }
    //run reduction on next level in tree unless reduction is shallow
    if(shallow !== true) node.children.forEach(e => reduceFormatting(e, tagName, style));
}