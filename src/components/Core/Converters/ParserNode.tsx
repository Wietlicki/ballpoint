import { ParserNodeProps, IParserNode } from "./Parser.types";

export class ParserNode implements IParserNode {
    tagName: string;
    children: Array<ParserNode>;
    parent?: ParserNode;
    text: string;
    props?: ParserNodeProps;

    constructor(tagName: string, parent?: ParserNode, insertPosition?: number, props?: ParserNodeProps){
        //instatiate an empty node given parent and tag name
        this.tagName = tagName;
        this.children = [];
        this.parent = parent;
        this.text = "";
        this.props = props
        //insert node into the the node tree if insert position is provided
        if(parent && typeof insertPosition === "number" && insertPosition >= 0){
            parent.children = [...parent.children.slice(0, insertPosition), this, ...parent.children.slice(insertPosition)]
        }
        if(parent && typeof insertPosition === "number" && insertPosition === -1){
            parent.children.push(this);
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
    wrap = (wrapperTagName: string) => {
        //save index of target node within current parent
        const ixWithinParent = this.parent?.children.indexOf(this) ?? -1;
        //create wrapper with the same parent as target node
        //then make node it's child
        const wrapperNode = new ParserNode(wrapperTagName, this.parent);
        wrapperNode.children = [this];
        //update parent property on target node
        this.parent = wrapperNode;
        //fix children of parent of wrapper node (replace target node with wrapper node)
        if(wrapperNode.parent){
            wrapperNode.parent.children[ixWithinParent] = wrapperNode;
        }
    }
}