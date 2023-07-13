import { convertParserRootNode } from "./Converters/convertParserRootNode";
import { Parser } from "./Converters/Parser";
import { ICoreState } from "./Core.types";
import { BallpointNode } from "./Node/BallpointNode";
import { Selection } from "./Selection/Selection";

export class CoreState implements ICoreState {
    selectionChange?: Selection | null;
    contentNode: BallpointNode;
    temporaryTextNodeRefs: Array<BallpointNode>;
    
    constructor(htmlString?: string, plainTextString?: string){
        //create content node
        this.contentNode = new BallpointNode("div", null);
        this.contentNode.className = "content-node";
        //init an empty temp nodes ref array
        this.temporaryTextNodeRefs = [];
        
        if(htmlString && htmlString.length > 0){
            const parser = new Parser();
            const rootNode = convertParserRootNode(parser.parseHtml(htmlString));
            //migrate children from parsed root node to content node
            if(rootNode) rootNode.migrateChildren(this.contentNode, -1);
        }
        else if(plainTextString && plainTextString.length > 0){
            const parser = new Parser();
            const rootNode = convertParserRootNode(parser.parsePlainText(plainTextString));
            //migrate children from parsed root node to content node
            if(rootNode) rootNode.migrateChildren(this.contentNode, -1);
        }

        //if content node is empty at this point then add a paragraph to it
        if(this.contentNode.children.length === 0){
            this.contentNode.children = [new BallpointNode("p", this.contentNode)];
        }
    }
}