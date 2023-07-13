import { ISelection, SelectionConstructorProps } from "./Selection.types";
import { BallpointNode } from "../Node/BallpointNode";

export class Selection implements ISelection {
    contentNode: BallpointNode;
    isCollapsed: boolean;
    startNode: BallpointNode;
    startTextOffset: number;
    endNode: BallpointNode;
    endTextOffset: number;
    commonAncestorNode: BallpointNode;

    constructor(constructorProps: SelectionConstructorProps){
        this.contentNode = constructorProps.contentNode;

        if(constructorProps.jsRange){
            const rangeStartNode = this.getNodeFromDOMNode(constructorProps.contentNode, constructorProps.jsRange.startContainer);
            const rangeEndNode = this.getNodeFromDOMNode(constructorProps.contentNode, constructorProps.jsRange.endContainer);
            const selectionCommonAncestorNode = this.getNodeFromDOMNode(constructorProps.contentNode, constructorProps.jsRange.commonAncestorContainer);

            //map jsRange to relevant children of contentNode
            //js range by definition should have a start container and end container so if rangeStartNode or rangeEndNode came up as null
            //something went wrong with the mapping between DOM and contentNode
            if(rangeStartNode && rangeEndNode){
                const selectionStart = this.translateRangeNode(rangeStartNode, constructorProps.jsRange.startOffset);
                const selectionEnd = this.translateRangeNode(rangeEndNode, constructorProps.jsRange.endOffset);

                this.startNode = selectionStart.node;
                this.startTextOffset = selectionStart.textOffset;
                this.endNode = selectionEnd.node;
                this.endTextOffset = selectionEnd.textOffset;
                this.commonAncestorNode = selectionCommonAncestorNode ?? this.findCommonAncestor(this.startNode, this.endNode) ?? constructorProps.contentNode;
                this.isCollapsed = constructorProps.jsRange.collapsed;
            }
            else {
                this.startNode = constructorProps.contentNode;
                this.startTextOffset = 0;
                this.endNode = constructorProps.contentNode;
                this.endTextOffset = 0;
                this.commonAncestorNode = constructorProps.contentNode;
                this.isCollapsed = true;
            }
        }
        else {
            //if passed end node is null, but start is a node - assume range is collapsed to start node
            if(!constructorProps.endNode && constructorProps.startNode){
                constructorProps.endNode = constructorProps.startNode;
                constructorProps.endTextOffset = constructorProps.startTextOffset;
            }
            //if passed start node is null, but end is a node - assume range is collapsed to end node
            if(!constructorProps.startNode && constructorProps.endNode){
                constructorProps.startNode = constructorProps.endNode;
                constructorProps.startTextOffset = constructorProps.endTextOffset;
            }
            //if by this point either start or end nodes are null then a selection cannot be constructed
            //and the selection will be set to the content node
            if(!constructorProps.startNode || !constructorProps.endNode){
                this.startNode = constructorProps.contentNode;
                this.startTextOffset = 0;
                this.endNode = constructorProps.contentNode;
                this.endTextOffset = 0;
                this.commonAncestorNode = constructorProps.contentNode;
                this.isCollapsed = true;
            }
            else{
                this.isCollapsed = (
                    constructorProps.startNode && 
                    constructorProps.startNode === constructorProps.endNode && 
                    constructorProps.startTextOffset === constructorProps.endTextOffset) || 
                    !constructorProps.endNode || !constructorProps.startNode;
    
                this.startNode = constructorProps.startNode;
                this.startTextOffset = constructorProps.startNode && constructorProps.startNode.tagName === "#text" ? constructorProps.startTextOffset?? 0 : 0,
                this.endNode = constructorProps.endNode;
                this.endTextOffset = constructorProps.endNode && constructorProps.endNode.tagName === "#text" ? constructorProps.endTextOffset?? 0 : 0,
                this.commonAncestorNode = this.findCommonAncestor(constructorProps.startNode, constructorProps.endNode) ?? constructorProps.contentNode;
            }
        }
    }
    translateRangeNode = (node: BallpointNode, offset: number): {node: BallpointNode, textOffset: number} => {
        if(node?.tagName === "#text") return { node, textOffset: offset };
        if(!(node?.children?.length > 0)) return {node, textOffset: 0};
        const ix = Math.max(offset - 1, 0);
        node = node.children[ix];
        if(node?.tagName === "#text") return {node, textOffset: node.text.length};
        return {node, textOffset: 0};
    }
    getDOMNodeFromNode = (node: BallpointNode): Node | null => {
        if(node.tagName !== "#text") return node.domRef.current;
        //if the node is a text node then there is only a react reference for its parent
        //retrieve the relevant DOM text node using the parent and child index
        if(!node.parent) return null;

        const ixNode = node.parent.children.indexOf(node);
        return node.parent.domRef.current.childNodes[ixNode];
    }
    getNodeFromDOMNode = (contentNode: BallpointNode, domNode: Node): BallpointNode | null => {
        const findNodeFromDOMElement = (node: BallpointNode, element: Node): BallpointNode | null => {
            if(node.domRef.current === element) {
                return node;
            }
            for(let ix = 0; ix < node.children.length; ++ix){
                const testNode = findNodeFromDOMElement(node.children[ix], element);
                if(testNode) return testNode;
            }
            return null;
        }
        if(domNode.nodeType === 3 && domNode.parentNode){
            //dom text nodes don't have a react element hence they will not have a ref
            //we therefore need to find the parent of the text node and use child index to find the right node
            const parent = findNodeFromDOMElement(contentNode, domNode.parentNode);
            const ixNode = Array.from(domNode.parentNode.childNodes).indexOf(domNode as ChildNode);

            return parent ? parent?.children[ixNode] : null;
        }
        return findNodeFromDOMElement(contentNode, domNode);
    }
    findCommonAncestor = (nodeOne: BallpointNode, nodeTwo: BallpointNode): BallpointNode | null => {
        const nodeOneBranch = [nodeOne];
        while(nodeOne.parent){
            nodeOneBranch.push(nodeOne.parent);
            nodeOne = nodeOne.parent;
        }
        const nodeTwoBranch = [nodeTwo];
        while(nodeTwo.parent){
            nodeTwoBranch.push(nodeTwo.parent)
            nodeTwo = nodeTwo.parent;
        }
        //start with the shallower node in the tree and test each node in it's branch against nodes in the deeper branch
        //the algorithm moves along the shallow branch from the deepest to shallowest level, which will find the 1st common ancestor
        let shallowBranch = nodeOneBranch.length <= nodeTwoBranch.length ? nodeOneBranch : nodeTwoBranch;
        let deepBranch = nodeOneBranch === shallowBranch ? nodeTwoBranch : nodeOneBranch;
        while(shallowBranch.length > 0){
            let testAncestor = shallowBranch.shift();
            if(testAncestor && deepBranch.includes(testAncestor)) return testAncestor;
        }
        //if the function reached here then something's wrong with the nodes as they should always have a common ancestor i.e. at least the top node
        return null;
    }
    toJsRange = (): Range | null => {
        //translate selection to JS Selection API range vars, which uses offsets and indirect node selections for non-text nodes.
        let rangeStartNode, rangeStartOffset, rangeEndNode, rangeEndOffset;
        if(!this.startNode?.parent){
            //if selection start node doesn't have a parent we set range start to content node
            //if everything worked correctly then only the content node should have a null parent
            rangeStartNode = this.contentNode;
            rangeStartOffset = 0;
        }
        else {
            rangeStartNode = this.startNode?.tagName === "#text" ? this.startNode : this.startNode.parent;
            rangeStartOffset = this.startNode?.tagName === "#text" ? this.startTextOffset : this.startNode.parent.children.indexOf(this.startNode);
        }
        if(!this.endNode?.parent){
            //if selection end node doesnt have a parent we collapse range to start
            rangeEndNode = rangeStartNode;
            rangeEndOffset = rangeStartOffset;
        }
        else {
            rangeEndNode = this.endNode?.tagName === "#text" ? this.endNode : this.endNode.parent;
            rangeEndOffset = this.endNode?.tagName === "#text" ? this.endTextOffset : this.endNode.parent.children.indexOf(this.endNode);
        }
        //get DOM node equivalents of target nodes in selection
        const rangeStartDOMNode = this.getDOMNodeFromNode(rangeStartNode);
        const rangeEndDOMNode = this.getDOMNodeFromNode(rangeEndNode);
        //construct js range
        if(rangeStartDOMNode && rangeEndDOMNode){
            let range = new Range();
            range.setStart(rangeStartDOMNode, rangeStartOffset);
            range.setEnd(rangeEndDOMNode, rangeEndOffset);
            return range;
        }
        return null;
    }
}