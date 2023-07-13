import { ParserConfig, ParserNodeProps, ParserNodeStyle, IParser } from "./Parser.types";
import { ParserNode } from "./ParserNode";

export class Parser implements IParser {
    config: ParserConfig;
    //declare a special map for style prop names to allow translations to react names
    stylePropNameMap: {[styleProp: string]: string} = {
        "text-align": "textAlign",
        "font-size": "fontSize",
        "color": "color",
        "font-family": "fontFamily"
    }

    constructor(config: ParserConfig = {
        allowedProps: ["style"], 
        allowedStyleProps: ["text-align", "font-size", "color"]
    }){
        this.config = config;
    }

    #filterAndTranslateStyles = (styleProps: ParserNodeStyle) => {
        const translatedStyleProps: ParserNodeStyle = {};
        Object.entries(styleProps).forEach(([k, v]) => {
            if(this.config.allowedStyleProps.includes(k) && this.stylePropNameMap[k]) {
                //style prop is translated to it's react name
                translatedStyleProps[this.stylePropNameMap[k]] = v;
            }
        });
        return translatedStyleProps;
    }
    #filterUnusableProps = (props: ParserNodeProps) => {
        const filteredProps: ParserNodeProps = {};
        Object.entries(props).forEach(([k, v]) => {
            if(this.config.allowedProps.includes(k)) {
                filteredProps[k] = k.toLowerCase() === "style" ? this.#filterAndTranslateStyles(v as ParserNodeStyle) : v;
            }
        });
        return filteredProps;
    }
    #parseProps = (textProps: string | undefined | null) : ParserNodeProps => {
        const props: ParserNodeProps = {};
        if(!textProps) return props;

        //run the double quote format regex globally to find all matches
        const mDoubleQuoteFormat = textProps.match(/(?<=\s|^)([A-Za-z][\w:.-_]+)\s*=\s*"([^"]*)"(?=\s|$)/g);
        if(mDoubleQuoteFormat){
            //now run the regex again on the matched string to extract attribute name and value
            mDoubleQuoteFormat.forEach(e => {
                const m = e.match(/(?<=\s|^)(?<attrName>[A-Za-z][\w:.-_]+)\s*=\s*"(?<attrValue>[^"]*)"(?=\s|$)/);
                if(m?.groups) props[m.groups?.attrName] = m.groups?.attrName === "style" ? this.#parseStyle(m.groups?.attrValue) : m.groups?.attrValue;
            });
        }
    
        //run the single quote format regex globally to find all matches
        const mSingleQuoteFormat = textProps.match(/(?<=\s|^)([A-Za-z][\w:.-_]+)\s*=\s*('[^']*')(?=\s|$)/g);
        if(mSingleQuoteFormat){
            //now run the regex again on the matched string to extract attribute name and value
            mSingleQuoteFormat.forEach(e => {
                const m = e.match(/(?<=\s|^)(?<attrName>[A-Za-z][\w:.-_]+)\s*=\s*(?<attrValue>'[^']*')(?=\s|$)/);
                if(m?.groups) props[m.groups?.attrName] = m.groups?.attrName === "style" ? this.#parseStyle(m.groups?.attrValue) : m.groups?.attrValue;
            });
        }
    
        //run the unqoted format regex globally to find all matches
        const mUnqotedFormat = textProps.match(/(?<=\s|^)([A-Za-z][\w:.-_]+)\s*=\s*([^\s"'=<>`]+)(?=\s|$)/g);
        if(mUnqotedFormat){
            //now run the regex again on the matched string to extract attribute name and value
            mUnqotedFormat.forEach(e => {
                const m = e.match(/(?<=\s|^)(?<attrName>[A-Za-z][\w:.-_]+)\s*=\s*(?<attrValue>[^\s"'=<>`]+)(?=\s|$)/);
                if(m?.groups) props[m.groups?.attrName] = m.groups?.attrName === "style" ? this.#parseStyle(m.groups?.attrValue) : m.groups?.attrValue;
            });
        }
        return props;
    }
    #parseStyle = (stylePropText: string, styleProps?: {[key: string]: string}): {[key: string]: string} => {
        if(!styleProps) styleProps = {};
        //use regex to find the next prop in the inline-style string
        const rgxStyleProp = /((?<prop>(?:[-\w])+)\s*:\s*(?<value>(?:(?:[#\w.-])|(?:".*?")|(?:'.*?'))+))/;
        const m = stylePropText.match(rgxStyleProp);

        //terminate if no more props found in string
        if(!m || !m.groups || m.index === undefined) return styleProps; 
        else {
            //add parsed style prop to style object
            styleProps[m.groups.prop] = m.groups.value;
            //the text up to and including next prop has been parsed so we slice that part away
            stylePropText = stylePropText.slice(m.index + m[0].length);
        }
        return this.#parseStyle(stylePropText, styleProps);
    }
    #replaceTextSpecialChars = (text: string) => {
        //remove line feeds and line breaks as these should be controlled with br tags
        let cleanText = text.replace(/[\n\r\f]/g, "");
        //fix non-breaking spaces
        return cleanText.replace(/&nbsp;/g, "\xA0");
    }
    #removeHtmlComments = (textHtml: string) => {
        const rgxComment = /<!--([\s\S]*?)-->/g;
        const rgxIf = /<!\[if\s+[\s\S]*?\]>[\s\S]*?<!\[endif\]>/g;
        return textHtml.replace(rgxComment, "").replace(rgxIf, "");
    }
    parseHtml = (textHtml: string) : ParserNode => {
        return this.#parseHtml(this.#removeHtmlComments(textHtml));
    }
    #parseHtml = (textHtml: string, parserNode?: ParserNode) : ParserNode => {
        //if no node passed we assume this is the start of parsing and create the root node
        if(!parserNode) parserNode = new ParserNode("root");
    
        //use regex to look for the next tag in the parsed html string
        const rgxTag = /<\/?(?<tagName>[\w:]*)(\b(?<tagProps>[^>]*))?\/?>/;
        const m = textHtml.match(rgxTag);
    
        //if no match then we return node
        if(!m){
            //the returned node should always be the root node if the html was correctly formulated
            if(parserNode.tagName !== "root"){
                throw new Error('Parsing Error - Incorrectly formulated html. Parsed html is not closed correctly.')
            }
            return parserNode;
        }
        if(m.index === undefined) throw new Error("Parsing Error - Tag match has failed due null index");
        if(!m.groups?.tagName) throw new Error("Parsing Error - Failed to extract tag name from match");
    
        const closeAtBeginning = m[0].startsWith("</");
        const closeAtEnd = m[0].endsWith("/>");
        //if the tag was a void tag with close at end then the match group for props text will capture the '/'
        //this character is not actually part of the props text and needs to be sliced away
        if(closeAtEnd && m.groups?.tagProps && m.groups?.tagProps?.length > 0){
            m.groups.tagProps = m.groups.tagProps.slice(0, -1); 
        }
        
        //text before matched tag is converted into a text node for the evaluated node
        if(m.index > 0){
            //extract text before the matched tag
            const text = textHtml.slice(0, m.index);
            //add text node as long as text was not pure whitespace 
            if(text.trim().length > 0){
                const textParserNode = new ParserNode("#text", parserNode, -1);
                //any carriage return, line feed or form feed should be managed with tags and are removed from text
                textParserNode.text = this.#replaceTextSpecialChars(text);
            }
        }
        //the text up to and including next tag has been parsed so we slice that part away
        textHtml = textHtml.slice(m.index + m[0].length);
    
        //if match is a void tag then convert it into a child node of the evaluated node
        //but the parse function is ran on the evaluated node as a closed node cannot have any content
        const htmlVoidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        if(htmlVoidTags.includes(m.groups?.tagName ?? "") || (!closeAtBeginning && closeAtEnd)){
            new ParserNode(
                m.groups?.tagName,
                parserNode,
                -1,
                this.#filterUnusableProps(this.#parseProps(m.groups?.tagProps))
            );
            return this.#parseHtml(textHtml, parserNode);
        }
        //if match is an opening tag then convert it into a child node of the evaluated node
        if(!closeAtBeginning && !closeAtEnd){
            const newParserNode = new ParserNode(
                m.groups?.tagName,
                parserNode,
                -1,
                this.#filterUnusableProps(this.#parseProps(m.groups?.tagProps))
            );
            return this.#parseHtml(textHtml, newParserNode);
        }
        //if match is a close tag then simply continue parsing the parent
        if(closeAtBeginning && !closeAtEnd){
            if(parserNode.tagName !== m.groups?.tagName){
                throw new Error(`Parsing Error - Incorrectly formulated html. ${parserNode.tagName} cannot be closed by ${m.groups?.tagName}`);
            }
            return this.#parseHtml(textHtml, parserNode.parent);
        }
        throw new Error('Parsing Error - Incorrectly formulated html: Corrupt tag.');
    }
    parsePlainText = (plainText: string): ParserNode => {
        return this.#parsePlainText(plainText);
    }
    #parsePlainText = (plainText: string, parserNode?: ParserNode): ParserNode => {
        //if no node passed we assume this is the start of parsing and create the root node
        if(!parserNode) parserNode = new ParserNode("root");

        //we use regex to find line breaks
        const rgxLineBreak = /[\n\r\f]/;
        const m = plainText.match(rgxLineBreak);

        //if no match then we translate content into a paragraph and text node (if non-empty), then return node
        if(!m){
            //check if the plain text is non-empty and add a paragraph with this text
            if(plainText.length > 0){
                const paragraphParserNode = new ParserNode("p", parserNode, -1);
                const textParserNode = new ParserNode("#text", paragraphParserNode, -1);
                textParserNode.text = plainText;
            }
            return parserNode;
        }
        if(!m.index) throw new Error("Parsing Error - line break match is missing an index");
        //text before line break is converted into a text node
        //the next node is wrapped in a paragraph
        if(m.index > 0){
            const paragraphParserNode = new ParserNode("p", parserNode, -1);
            //extract text before the matched tag
            const text = plainText.slice(0, m.index);
            //add text node as long as text was not pure whitespace 
            if(text.trim().length > 0){
                const textParserNode = new ParserNode("#text", paragraphParserNode, -1);
                textParserNode.text = text;
            }
        }
        //the text up to and including next line break has been parsed so we slice that part away
        plainText = plainText.slice(m.index + m[0].length);

        return this.#parsePlainText(plainText, parserNode);
    }
}

