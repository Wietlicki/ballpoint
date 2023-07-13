import { ParserNodeProps, IParserNode } from "./Parser.types";
export declare class ParserNode implements IParserNode {
    tagName: string;
    children: Array<ParserNode>;
    parent?: ParserNode;
    text: string;
    props?: ParserNodeProps;
    constructor(tagName: string, parent?: ParserNode, insertPosition?: number, props?: ParserNodeProps);
    remove: (shiftPreserveChildren?: boolean) => void;
    wrap: (wrapperTagName: string) => void;
}
