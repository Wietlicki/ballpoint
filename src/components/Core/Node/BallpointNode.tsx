import { genUUID} from "../UtilityFunctions/genUUID"
import { FlatBallpointNode, IBallpointNode, BallpointNodeProps, TagNames, BallpointStyleRef, BallpointFormatInfo } from "./BallpointNode.types"
import React, { createRef } from "react";

export class BallpointNode implements IBallpointNode {
    id: string;
    tagName: TagNames;
    children: Array<BallpointNode>;
    parent: BallpointNode | null | undefined;
    text: string;
    domRef: any;
    className?: string;
    style?: {[key: string]: string};

    constructor(tagName: TagNames, parent: BallpointNode | null | undefined, insertPosition?: number, props?: BallpointNodeProps){
        //instatiate an empty node given parent and tag name
        this.id = genUUID();
        this.tagName = tagName;
        this.children = [];
        this.parent = parent;
        this.text = "";
        this.domRef = createRef();
        this.style = props?.style;
        this.className = props?.className;
        //insert node into the the node tree if insert position is provided
        if(parent && typeof insertPosition === "number" && insertPosition >= 0){
            parent.children = [...parent.children.slice(0, insertPosition), this, ...parent.children.slice(insertPosition)]
        }
        if(parent && typeof insertPosition === "number" && insertPosition === -1){
            parent.children.push(this);
        }
    }
    /*
        Node tree search functions
    */
    getAllChildrenWithTagNames = (tags: Array<TagNames>): Array<BallpointNode> => {
        if(!Array.isArray(tags)) tags = [tags];
        const nodeArray: Array<BallpointNode> = [];
        this.children.forEach(e => {
            if(tags.includes(e.tagName)) {
                nodeArray.push(e);
            }
            nodeArray.push(...e.getAllChildrenWithTagNames(tags));
        });
        return nodeArray;
    }
    getLastDeepChild = (): BallpointNode | undefined => {
        return this.children.length > 0 ? this.children.at(-1)?.getLastDeepChild() : this;
    }
    //This method effectively gets the previous opening tag
    getPreviousNode = (): BallpointNode | undefined | null => {
        if(!this.parent) return null;
        //get index of node within parent
        const ixNode = this.parent.children.indexOf(this);
        //if there is a previous sibiling we simply return it's last deep child
        if(ixNode > 0){
            return this.parent.children[ixNode - 1].getLastDeepChild();
        }
        //otherwise we need to run the method on the parent level above
        return this.parent;
    }
    getNextNode = (): BallpointNode | null => {
        //return first child if there is one
        if(this.children.length > 0) return this.children[0];
        let node: BallpointNode = this;  
        while(node.parent){
            //get index of node within parent
            const ixNode = node.parent.children.indexOf(node);
            //return next sibling if node has one
            if(ixNode >= 0 && ixNode < node.parent.children.length - 1) {
                return node.parent.children[ixNode + 1];
            }
            //move node up a level to search for sibling again
            node = node.parent;
        }
        //if we reach here that means node was the last opening tag
        return null;
    }
    getNextNodeWithTagName = (tagName: string): BallpointNode | null => {
        let node: BallpointNode | null = this;
        while(node){
            node = node.getNextNode();
            if(node?.tagName === tagName) break;
        }
        return node;
    }
    getFirstChildWithTagName = (tagName: string): BallpointNode | null => {
        //we get a shallow copy of node first so we can modify it's direct properties
        //but children still point to same nodes
        const topNode = {...this};
        //we now remove parent on top node
        topNode.parent = null;
        //with nullfield parent we know that getNextNodeWithTagName will only search within children
        //so we get the 'next' text node after the target node opening tag
        return topNode.getNextNodeWithTagName(tagName);
    }
    isNodeParentOf = (testNode: BallpointNode): boolean => {
        while(testNode.parent){
            if(testNode.parent === this) return true;
            testNode = testNode.parent;
        }
        return false;
    }
    //provides an array of child indexes that describes the tree path between node and deepChild
    //the first array element is the index of the revelant direct child of node
    getChildIndexArray = (deepChild: BallpointNode): number[] => {
        let ixArray = [];
        let isDeepChild = false;
        while(deepChild !== this && deepChild.parent){
            ixArray.unshift(deepChild.parent.children.indexOf(deepChild));
            deepChild = deepChild.parent;
            if(deepChild === this) isDeepChild = true;
        }
        return isDeepChild === true ? ixArray : [];
    }
    findParentWithTagName = (tagNames : Array<TagNames> | TagNames): BallpointNode | undefined => {
        const predicate = Array.isArray(tagNames) ? (node: BallpointNode) => {return tagNames.includes(node.tagName)} : (node: BallpointNode) => {return node.tagName === tagNames};
        let searchNode = this.parent;
        while(searchNode){
            if(predicate(searchNode)) return searchNode;
            searchNode = searchNode.parent;
        }
        return;
    }
    compareTagAndStyle = (comparisonNode: BallpointNode): boolean => {
        if(!this || !comparisonNode) return false;
        if(this.tagName !== comparisonNode.tagName) return false;
        //same styling node, but no actual styles applied
        if(!this.style && !comparisonNode.style) return true;
        //one node has styles while the other one doesn't
        if((this.style && !comparisonNode.style) || (!this.style && comparisonNode.style)) return false;
        //both styling nodes have styles, need to compare
        if(typeof this.style === "object" && typeof comparisonNode.style === "object"){
            const keysA = Object.keys(this.style);
            const keysB = Object.keys(comparisonNode.style);
            //different amount of styles applied
            if(keysA.length !== keysB.length) return false;
            return !keysA.some(e => this.style && comparisonNode.style && this.style[e] !== comparisonNode.style[e]);
        }
        //node styling must've been of the wrong type
        return false;
    }
    findParentWithTagAndStyle = (tagName: TagNames, style: {[key: string]: string} | undefined): BallpointNode | null => {
        //create a dummy node for tag and style comparison purposes only
        const compareNode = new BallpointNode(tagName, null, undefined, {style});
        //start search at parent of node
        let searchNode = this.parent;
        while(searchNode){
            if(searchNode.compareTagAndStyle(compareNode)) return searchNode;
            searchNode = searchNode.parent;
        }
        return null;
    }
    getNodeFormatInfo = (): BallpointFormatInfo => {
        let effectiveStyle : {[key: string]: BallpointStyleRef} = {};
        let effectiveFormatting : {[key: string]: Array<BallpointNode>} = {};
        let node: BallpointNode = this;
        while(node.parent){
            if(node.style){
                for (const [k, v] of Object.entries(node.style)) {
                    //since we are traversing up the node tree, we only add styles to effective style if they are not
                    //already present in the object i.e. because child style takes precedent over parent style
                    if(!effectiveStyle[k]) effectiveStyle = {...effectiveStyle, [k]: {value: v, nodeRef: node}};
                }
            }
            if(["b", "i", "u", "s"].includes(node.tagName)){
                //formatting nodes can be nested and as such all are effective i.e. each formatting tag
                //could have multiple effective nodes at different tree level
                if(!effectiveFormatting[node.tagName]) {
                    effectiveFormatting = {...effectiveFormatting, [node.tagName]: [node]};
                }
                else {
                    effectiveFormatting[node.tagName].push(node);
                }
            }
            node = node.parent;
        }
        return {effectiveFormatting, effectiveStyle};
    }
    nodeHasText = (): boolean => {
        //check if node is a line-break (we treat it like text) or has a non-empty text node
        if(this.tagName === "br") return true;
        if(this.tagName === "#text" && this.text.length > 0 && !this.text.match(/^\u200B+$/gi)) return true;
        //check if any children have a text node
        return this.children.some(e => e.nodeHasText() === true);
    }
    /*
        Node tree modifiers
    */
    wrap = (wrapperTagName: TagNames, style?: {[key: string]: string}) => {
        //save index of target node within current parent
        const ixWithinParent = this.parent?.children.indexOf(this) ?? -1;
        //create wrapper with the same parent as target node
        //then make node it's child
        const wrapperNode = new BallpointNode(wrapperTagName, this.parent);
        wrapperNode.children = [this];
        //add styles to wrapper node if applicable
        if(style && typeof style === "object") wrapperNode.style = style;
        //update parent property on target node
        this.parent = wrapperNode;
        //fix children of parent of wrapper node (replace target node with wrapper node)
        if(wrapperNode.parent){
            wrapperNode.parent.children[ixWithinParent] = wrapperNode;
        }
    }
    remove = (shiftPreserveChildren: boolean = false) => {
        if(!(this?.parent)) return;
        //if we want to remove node, but preserve it's children then we will need to
        //replace the node with it's children
        //by slotting them into the same position within the parent child array as the node occupies
        if(shiftPreserveChildren === true && this.children?.length > 0){
            const ixWithinParent = this.parent.children.indexOf(this);
            this.children.forEach(e => e.parent = this.parent);
            this.parent.children = [
                ...this.parent.children.slice(0, ixWithinParent),
                ...this.children,
                ...this.parent.children.slice(ixWithinParent + 1)
            ];
            return;
        }
        //if we remove the node along with it's children then we can achieve this
        //by simply removing it from it's parent child array
        this.parent.children = this.parent.children.filter(e => e !== this);
    }
    migrateChildren = (toNode: BallpointNode, insertPosition: number) => {
        //create a copy of children
        const children = [...this.children];
        //set new parent on children
        children.forEach(e => e.parent = toNode);
        //insert 'from' node children into 'to' node child array
        toNode.children = [
            ...toNode.children.slice(0, insertPosition),
            ...children,
            ...toNode.children.slice(insertPosition)
        ];
        //clear the child array on 'from' node
        this.children = [];
    }
    /*
        Node tree transforms
    */
    toFlatNodeTree = (): Array<FlatBallpointNode> => {
        if(this.children.length === 0){
            return [{tagName: this.tagName, isNodeStart: true, isNodeEnd: true, nodeRef: this}]
        }
        let flatChildren: Array<FlatBallpointNode> = [];
        this.children.forEach(e => {
            flatChildren = [...flatChildren, ...e.toFlatNodeTree()]
        });
        return [
            {tagName: this.tagName, isNodeStart: true, isNodeEnd: false, nodeRef: this},
            ...flatChildren,
            {tagName: this.tagName, isNodeStart: false, isNodeEnd: true, nodeRef: this}
        ]
    }
    toHtmlText = (fragment: boolean = false): string => {
        const styleToString = (style?: {[key: string]: string}) => {
            if(!style) return "";
            let styleString = "";
            for (const key in style){
                styleString += `${key}:${style[key]};`;
            }
            if(styleString.length > 0) styleString = ` style="${styleString}"`;
            return styleString;
        }
        if(this.tagName === "#text") return this.text;
        if(this.tagName === "br") return "</br>";
        let childrenString = "";
        this.children.forEach(e => childrenString += e.toHtmlText(true));
        let htmlString = `<${this.tagName}${styleToString(this.style)}>${childrenString}</${this.tagName}>`;
        return fragment ? htmlString : `<html><body>${htmlString}</body></html>`;
    }
    toPlainText = (): string => {
        if(this.tagName === "#text") return this.text;
        if(this.tagName === "br") return "\r\n";
        let childrenString = "";
        this.children.forEach(e => childrenString += e.toPlainText());
        if(this.tagName === "p") return childrenString + "\r\n";
        if(this.tagName === "li") return "\u2022\t" + childrenString + "\r\n";
        return childrenString;
    }
    toJSX = (key? : string | number) => {
        //an empty text node will not get rendered by react so we need to render it as an empty span
        if(this.tagName === "#text" && this.text.length === 0){
            return <span key={key} ref={this.domRef}/>
        }
        if(this.tagName === "#text"){
            return <React.Fragment key={key}>{this.text}</React.Fragment>
        }
        if(this.tagName === "br") {
            return <br key={key} className={this.className} data-id={this.id} ref={this.domRef}/>
        }
        const Tag = this.tagName;
        const childrenJSX = this.children.map((e, i) => e.toJSX(i));
        // @ts-ignore
        return <Tag key={key} className={this.className} style={this.style} data-id={this.id} ref={this.domRef}>{childrenJSX}</Tag>
    }
    clone = (refArray?: Array<BallpointNode>, parent?: BallpointNode | null) : BallpointNode => {
        const clone = new BallpointNode(this.tagName, parent);
        
        clone.style = this.style ? {...this.style} : undefined;
        clone.domRef = this.domRef;
        clone.text = this.text;
        clone.className = this.className;
        clone.id = this.id;

        //deep clone children
        clone.children = this.children.map(e => e.clone(refArray, clone));
        //replace reference in refArray with clone   
        if(refArray && refArray.length > 0){
            let ix = refArray.indexOf(this);
            if(ix >= 0) refArray[ix] = clone;
        }
        //return deep cloned node
        return clone;
    }
}