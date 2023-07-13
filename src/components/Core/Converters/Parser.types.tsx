export type ParserNodeStyle = {[key: string]: string};
export type ParserNodeProps = {[key: string]: string | ParserNodeStyle};
export type ParserConfig = {
    allowedStyleProps: Array<string>;
    allowedProps: Array<string>;
}
export interface IParserNode {
    tagName: string;
    children: Array<IParserNode>;
    parent?: IParserNode;
    text: string;
    props?: ParserNodeProps;
    remove(shiftPreserveChildren: boolean): void;
    wrap(wrapperTagName: string): void;
}
export interface IParser {
    config: ParserConfig;
    parseHtml(textHtml: string) : IParserNode;
    parsePlainText(plainText: string): IParserNode;
}