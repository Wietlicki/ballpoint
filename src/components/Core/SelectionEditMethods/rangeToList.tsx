import { BallpointNode } from "../Node/BallpointNode";
import { TagNames } from "../Node/BallpointNode.types";
import { Selection } from "../Selection/Selection";
import { reduceFormatting } from "../TreeMethods/reduceFormatting";

export function rangeToList(contentNode: BallpointNode, selection: Selection, listType: string): Selection {
    //error selection - do nothing
    if(!selection.startNode || !selection.endNode) return selection;
    //establish target list tag
    let targetListTag: TagNames = "ul";
    //the default is ul, but an ordered list can be applied through listType
    if(listType === "ol" || listType === "ordered-list") targetListTag = "ol";

    const selectionStartIxArray = contentNode.getChildIndexArray(selection.startNode);
    const selectionEndIxArray = contentNode.getChildIndexArray(selection.endNode);

    //wrap with a paragraph any node that is
    //within the selection at the top level (i.e. level below content node)
    //that is not already a paragraphs, header or list
    const phTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    const selectedTopLevelNodes = contentNode.children.slice(selectionStartIxArray[0], selectionEndIxArray[0] + 1);
    selectedTopLevelNodes
        .filter(e => ![...phTags, "ul", "ol"].includes(e.tagName))
        .forEach(e => e.wrap("p"));

    //for our selection
    //we create a special array of nodes where all the lists are flattened across their direct child items
    //and position with other nodes at the 'paragraph level'
    //if selection end or start falls within a list then we also slice away unselected list items
    let affectedNodes: Array<BallpointNode> = [];
    selectedTopLevelNodes.forEach((e, i) => {
        if(e.tagName === "ul" || e.tagName === "ol"){
            if(i === 0 || i === selectedTopLevelNodes.length - 1){
                if(i === 0 && selectedTopLevelNodes.length === 1){
                    affectedNodes = [...affectedNodes, ...e.children.slice(selectionStartIxArray[1], selectionEndIxArray[1] + 1)];
                }
                if(i === 0 && i < selectedTopLevelNodes.length - 1) {
                    affectedNodes = [...affectedNodes, ...e.children.slice(selectionStartIxArray[1])];
                }
                if(i > 0 && i === selectedTopLevelNodes.length - 1) {
                    affectedNodes = [...affectedNodes, ...e.children.slice(0, selectionEndIxArray[1] + 1)];
                }
            }
            else {
                affectedNodes = [...affectedNodes, ...e.children];
            }
        }
        else affectedNodes.push(e);
    });

    //if there are lists or list items (not paragraphs or headers) within sequence then we will need to edit them
    if(affectedNodes.some(e => !phTags.includes(e.tagName))){
        //if all nodes in sequence belong to the target list type tag then we need to format the list(s) as paragraph(s)
        if(affectedNodes.every(e => e.parent && e.tagName === "li" && e.parent.tagName === targetListTag)){
            //we identify lists with modified list items and morph all selected list items into paragraphs
            const listNodes: Array<BallpointNode> = [];
            affectedNodes
                .forEach(e => {
                    if(e.parent && !listNodes.includes(e.parent)) listNodes.push(e.parent);
                    e.tagName = "p";
                    if(e.children.length === 0){
                        const textNode = new BallpointNode("#text", e, 0);
                        textNode.text = "\u200B";
                    }
                });
            //any list item that hasn't been morphed into a paragraph should be wrapped 
            //in a new list with same list tag as parent, so we can remove it's original parent list
            //for the unaffected items we also save the unique list types of their parent lists
            const listNodeTags: Array<TagNames> = [];
            listNodes.forEach(e => e.children.filter(x => x.tagName === "li").forEach(x => {
                if(!listNodeTags.includes(e.tagName)) listNodeTags.push(e.tagName);
                x.wrap(e.tagName)
            }));           
            //we remove each of the affected list nodes, but preserve children
            //this will effectively lift-up the new "p"s and "lists" to the paragraph level
            listNodes.forEach(e => {
                e.remove(true);
            });
            //finally we run a formatting reduction to consolidate the fragmented lists
            //this has to be done per each unique list type that was recorded from the set of remaining affected lists
            listNodeTags.forEach(e => reduceFormatting(contentNode, e, undefined, true))
        }
        //if sequence has paragraphs, headers or lists of non-target type then we need to format all of those nodes as the target list
        else {
            //first we ensure all selected list items are wrapped in the target list type
            //we also take note of all the original lists with items affected by this change
            const listNodes: Array<BallpointNode> = [];
            affectedNodes
                .filter(e => e.tagName === "li")
                .forEach(e => {
                    if(e.parent && !listNodes.includes(e.parent)) listNodes.push(e.parent);
                    e.wrap(targetListTag);
            });
            //for every original list node affected by this change we wrap the remaining (non-selected) list items
            //in a list with the original tag type, so we can remove the original lists
            //also take note of the unique list types that are produced by this change 
            const listNodeTags: Array<TagNames> = [targetListTag]
            listNodes.forEach(e => e.children.filter(x => x.tagName === "li").forEach(x => {
                if(!listNodeTags.includes(e.tagName)) listNodeTags.push(e.tagName);
                x.wrap(e.tagName);
            }));
            //we remove each of the affected list nodes, but preserve children
            //this will effectively lift-up the new "p"s and "lists" to the paragraph level
            listNodes.forEach(e => {
                e.remove(true);
            });
            //morph all paragraphs and headers into list items and wrap them in the target list type
            affectedNodes.filter(e => phTags.includes(e.tagName)).forEach(e => {
                //morph paragraph or header into a list item      
                e.tagName = "li";
                //wrap list item in a list
                e.wrap(targetListTag);
                //if necessary add placeholder text nodes to each
                if(e.children.length === 0){
                    const textNode = new BallpointNode("#text", e, 0);
                    textNode.text = "\u200B";
                }
            });
            //finally we run a formatting reduction to consolidate the fragmented lists
            //this has to be done per each unique list type that was recorded from the set of affected lists
            listNodeTags.forEach(e => reduceFormatting(contentNode, e, undefined, true))
        }
    }
    //if all selected nodes in sequence are paragraphs then we simply change them to list items and wrap them in a list
    else {
        affectedNodes.forEach(e => {
            e.tagName = "li";
            e.wrap(targetListTag);
            //if necessary add placeholder text nodes to each
            if(e.children.length === 0){
                const textNode = new BallpointNode("#text", e, 0);
                textNode.text = "\u200B";
            }
        });
        //finally we run a formatting reduction to consolidate the fragmented lists
        reduceFormatting(contentNode, targetListTag, undefined, true);
    }
    return selection;
}