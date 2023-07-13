import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";

export function alignRange(contentNode: BallpointNode, selection: Selection, alignment: string){
    const phTags: Array<TagNames> = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    const lTags: Array<TagNames> = ["ul", "ol"];
    const phlTags: Array<TagNames> = [...phTags, ...lTags];
    //short-circuit if the range is collapsed
    if(selection.isCollapsed){
        const alignedNode = phlTags.includes(selection.startNode.tagName) ? selection.startNode : selection.startNode.findParentWithTagName(phlTags);
        if(alignedNode) alignedNode.style = {...alignedNode.style, textAlign: alignment};

        return selection;
    }
    //we create a special array of nodes where all the lists are flattened across their direct child items
    //we need this as text alignment is applied either at paragraph level or list item level
    let sequencedNodes: Array<BallpointNode> = [];
    contentNode.children.forEach(e => {
        if(lTags.includes(e.tagName)){
            sequencedNodes = [...sequencedNodes, e, ...e.children];
        }
        else sequencedNodes.push(e);
    });
    
    const selectionStartIxArray = contentNode.getChildIndexArray(selection.startNode);
    const selectionEndIxArray = contentNode.getChildIndexArray(selection.endNode);

    const startNodeInSequence = lTags.includes(contentNode.children[selectionStartIxArray[0]].tagName) ? 
        contentNode.children[selectionStartIxArray[0]].children[selectionStartIxArray[1]] :
        contentNode.children[selectionStartIxArray[0]];

    const endNodeInSequence = lTags.includes(contentNode.children[selectionEndIxArray[0]].tagName) ? 
        contentNode.children[selectionEndIxArray[0]].children[selectionEndIxArray[1]] :
        contentNode.children[selectionEndIxArray[0]];

    const ixStartNodeInSequence = sequencedNodes.indexOf(startNodeInSequence);
    const ixEndNodeInSequence = sequencedNodes.indexOf(endNodeInSequence);

    //apply text align styling against paragraphs, headers and list items within selection
    const alignedNodes = sequencedNodes
        .slice(ixStartNodeInSequence, ixEndNodeInSequence + 1)
        .filter(e => [...phTags, "li"].includes(e.tagName)); //do not align ul, ol nodes themselves or any other node that shouldn't be at that level

    alignedNodes.forEach(e => e.style = {...e.style, textAlign: alignment});

    return selection;
}