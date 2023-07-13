import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { ParserNode } from "./ParserNode";

export function convertParserRootNode(rootNode: ParserNode): BallpointNode | undefined {
    //define supported tag lists
    const allowedTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul", "li", "b", "i", "u", "span", "br", "#text"];
    const allowedTopLevelTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul"];
    const allowedParagraphOrHeaderChildTags = ["b", "i", "u", "span", "br", "#text"];
    const allowedListItemChildTags = ["b", "i", "u", "span", "br", "#text"];
    //define a function that will recursively remove all unsupported node types in a paragraph 
    const cleanseChildren = (node: ParserNode, supportedTags: Array<string>) => {
        if(!Array.isArray(node.children)) return;
        //find the children that do not fit the supported tag list
        const problemChildren = node.children.filter(e => !supportedTags.includes(e.tagName));
        //if those problem child nodes have children of their own, then remove them, but shift preserve their children
        problemChildren.forEach(e => {
            e.remove(e.children.length > 0);
        });
        //the child array for the evaluated node could be modified by this point
        //we run the method on the new set of children
        node.children.forEach(e => cleanseChildren(e, supportedTags));
    }
    //define a dumb function that recursively creates BallpointNodes from ParserNodes
    //does this preserve order?
    const parserToBallpointNode = (parserNode: ParserNode, ballpointParent?: BallpointNode): BallpointNode => {
        //convert parser to ballpoint node. TagNames are simply cast and so should be validated elsewhere
        const returnNode = new BallpointNode(parserNode.tagName as TagNames, ballpointParent, -1);
        //at the moment only text and style prop are copied over to the ballpoint node
        returnNode.text = parserNode.text;
        if(typeof parserNode.props?.style === "object") returnNode.style =  parserNode.props?.style;
        //run function on all children
        parserNode.children.forEach(e => parserToBallpointNode(e, returnNode));
        return returnNode;
    };
    //find the html node first
    const htmlNode = rootNode.children.find(e => e.tagName.toLowerCase() === "html");
    //throw an error if there is no html node
    if(!htmlNode) throw new Error("Cannot convert parsed root node because there is no 'html' node child");
    //then find the body node (must be a child of html)
    const bodyNode = htmlNode.children.find(e => e.tagName.toLowerCase() === "body");
    //return nothing - because if there is no body node then effectively there is no content within the parsed html
    if(!bodyNode) return undefined;

    //we run a general recursive cleanse on children of body
    //this should unwrap the content from within for example divs or articles
    cleanseChildren(bodyNode, allowedTags);
    //nodes created directly under the body that aren't a paragraph or a list can usually be wrapped in a paragraph
    //if they can't then we need to remove them
    bodyNode.children.filter(e => !allowedTopLevelTags.includes(e.tagName)).forEach(e => {
        if(allowedParagraphOrHeaderChildTags.includes(e.tagName)){
            e.wrap("p");
        }
        else {
            e.remove(false);
        }
    });
    //for each paragraph or header we filter out unspported children
    const phTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    bodyNode.children.filter(e => phTags.includes(e.tagName)).forEach(e => cleanseChildren(e, allowedParagraphOrHeaderChildTags));

    //for lists, ensure that only child list items are present
    //if there is a child that is not a list item then try to wrap it in a list item or remove if not possible
    bodyNode.children.filter(e => ["ol", "ul"].includes(e.tagName)).forEach(e => {
        e.children.filter(x => x.tagName !== "li").forEach(x => {
            if(allowedListItemChildTags.includes(x.tagName)){
                e.wrap("li");
            }
            else {
                e.remove(false);
            }
        })
    });
    //return body content as a div ballpoint node
    return parserToBallpointNode(bodyNode);
}