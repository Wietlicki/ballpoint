import { ParserConfig, IParser } from "./Parser.types";
import { ParserNode } from "./ParserNode";
export declare class Parser implements IParser {
    #private;
    config: ParserConfig;
    stylePropNameMap: {
        [styleProp: string]: string;
    };
    constructor(config?: ParserConfig);
    parseHtml: (textHtml: string) => ParserNode;
    parsePlainText: (plainText: string) => ParserNode;
}
