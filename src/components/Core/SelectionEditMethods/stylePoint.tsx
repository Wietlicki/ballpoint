import { BallpointNode } from "../Node/BallpointNode";
import { Selection } from "../Selection/Selection";
import { reduceFormatting } from "../TreeMethods/reduceFormatting";
import { splitNode } from "../TreeMethods/splitNode";

export function stylePoint(
    contentNode: BallpointNode, 
    temporaryTextNodeRefs: Array<BallpointNode>, 
    stylePropName: string,
    stylePropValue: string, 
    node: BallpointNode, 
    textOffset: number, 
    toggle: boolean = true) : Selection
{ 
    //define fallback selection in case something goes wrong
    const fallbackSelection =  new Selection({contentNode, startNode: node, startTextOffset: textOffset});
    //start of container node scenario
    if(node?.tagName !== "#text" && node?.tagName !== "br"){
        //if the selection is on the content node, then select the first child
        //this should always be the first paragraph
        //the next if statement will ensure we then move the selection to a valid text node
        if(node === contentNode){
            node = contentNode.children[0];
        }
        //if the first child node of the selected container is a text node then select it and proceed as normal
        //otherwise if the start of a container node is selected, but the first child is not a text node
        //then we need to preprend a new text node and select it
        if(node.children[0]?.tagName === "#text"){
            node = node.children[0];
            textOffset = 0;
        }
        else {
            const textNode = new BallpointNode("#text", node);
            node.children = [textNode, ...node.children];
            node = textNode;
            textOffset = 0;
        }
    }
    //run deep format reduction on the highest of the removed format nodes
    if(node?.tagName === "#text"){
        //we check the current styling for the node
        const formatInfo = node.getNodeFormatInfo();
        const isAlreadyStyled = formatInfo && formatInfo.effectiveStyle[stylePropName]?.value.toLowerCase() === stylePropValue.toLowerCase();
        //if text node is already styled and toggle is off then we can 'do nothing' and exit early
        if(isAlreadyStyled && toggle === false){
            return new Selection({contentNode, startNode: node, startTextOffset: textOffset});
        }
        //we need to split the text node for styling purposes
        let textNode: BallpointNode | null = null;
        //if selection is within an empty or placeholder text node then all we have to do is style that text node
        if(node.text.length === 0 || node.text.match(/^\u200B+$/gi)){
            textNode = node;
        }
        else {
            //otherwise we split the text node with an empty new text node
            let splitNodes = splitNode(node, textOffset, new BallpointNode("#text", node.parent));
            textNode = splitNodes[1];
            //remove the end or start text node after the split if they are empty as they are redundant
            if(splitNodes[0].text.length === 0 || splitNodes[0].text.match(/^\u200B+$/gi)) splitNodes[0].remove(false);
            if(splitNodes[2].text.length === 0 || splitNodes[2].text.match(/^\u200B+$/gi)) splitNodes[2].remove(false);
        }
        //if we end up with an empty text node then we need to add temporary reference for it
        //this way the component can clean it up if selection changes before text is added and it becomes redundant
        if(textNode?.text?.length === 0 && temporaryTextNodeRefs.indexOf(textNode) === -1){
            temporaryTextNodeRefs.push(textNode);
        }
        //if we reached here then a point formatting operation needs to be carried out
        if(isAlreadyStyled){
            const effectiveStyleNode = formatInfo.effectiveStyle[stylePropName]?.nodeRef;
            //get all child text nodes in the formatting subtree
            const formatSubtreeTextNodes = effectiveStyleNode.getAllChildrenWithTagNames(["#text", "br"]);
            //wrap each text node, other than the new point selection text node, in the formatting subtree with a format tag
            formatSubtreeTextNodes.filter(e => e !== textNode).forEach(e => {
                e.wrap("span", {[stylePropName]: stylePropValue});
            });
            //save reference to parent of effective formatting node as that will be the common ancestor to all the new formatting nodes
            const formattingAncestor = effectiveStyleNode.parent;
            //remove the effective formatting node, but preserve the children
            //this will lift them to the parent level and as a result the only unformatted node will be the new text node
            effectiveStyleNode.remove(true);
            //we want to reduce the formatting on the common ancestor as we have potentially wrapped several other text nodes
            //in formatting tags
            if(formattingAncestor) reduceFormatting(formattingAncestor, "span", {[stylePropName]: stylePropValue});
            //return selection to unformatted text node
            return new Selection({contentNode, startNode: textNode, startTextOffset: 0});
        }
        else {
            //if the text node was unstyled we apply styling
            //by simply wrapping it with a span with the requested styling
            textNode.wrap("span", {[stylePropName]: stylePropValue});
            return new Selection({contentNode, startNode: textNode, startTextOffset: 0});
        }
    }
    //we should never reach here, but return original selection in case we face an odd unhandled scenario
    return fallbackSelection;
}