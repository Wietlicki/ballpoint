import { KeyboardEvent } from "react";
import { Core } from "../Core";
import { actionApplyFormatting } from "../Actions/actionApplyFormatting";
import { actionBackspaceKeyPress } from "../Actions/actionBackspaceKeyPress";
import { actionCharKeyPress } from "../Actions/actionCharKeyPress";
import { actionEnterKeyPress } from "../Actions/actionEnterKeyPress";
import { actionRedo } from "../Actions/actionRedo";
import { actionUndo } from "../Actions/actionUndo";
import { CoreKeyActionsConfig } from "../Core.types";

export function genKeyDownHandler(core: Core, keyActionsConfig?: CoreKeyActionsConfig) : (e: KeyboardEvent) => void {
    return function(e: KeyboardEvent){
        switch(true){
            //explicitly allow copying from content editable
            case e.key.toLowerCase() === "c" && e.ctrlKey === true:
                break;
            //explicitly allow the ctrl+v event, that will then trigger a paste event, which has a handler
            case e.key.toLowerCase() === "v" && e.ctrlKey === true:
                break;
            //explicitly allow the ctrl+x event, that will then trigger a cut event, which has a handler
            case e.key.toLowerCase() === "x" && e.ctrlKey === true:
                break;
            case e.key === "Backspace":
                e.preventDefault();
                actionBackspaceKeyPress(core);
                break;
            case e.key === "Enter" && e.shiftKey === true:
                e.preventDefault();
                actionEnterKeyPress(core, true);
                break;
            case e.key.toLowerCase() === "b" && e.ctrlKey === true:
                e.preventDefault();
                if(keyActionsConfig?.allowBold === true) actionApplyFormatting(core, "b");
                break;
            case e.key.toLowerCase() === "i" && e.ctrlKey === true:
                e.preventDefault();
                if(keyActionsConfig?.allowItalic === true) actionApplyFormatting(core, "i");
                break;
            case e.key.toLowerCase() === "u" && e.ctrlKey === true:
                e.preventDefault();
                if(keyActionsConfig?.allowUnderline === true) actionApplyFormatting(core, "u");
                break;
            case e.key.toLowerCase() === "z" && e.ctrlKey === true:
                e.preventDefault();
                if(keyActionsConfig?.allowUndo === true) actionUndo(core);
                break;
            case e.key.toLowerCase() === "y" && e.ctrlKey === true:
                e.preventDefault();
                if(keyActionsConfig?.allowRedo === true) actionRedo(core);
                break;
            case e.key === "Enter":
                e.preventDefault();
                actionEnterKeyPress(core, false);
                break;
            case e.key.length === 1:
                e.preventDefault();
                actionCharKeyPress(core, e.key);
                break;
            default:
                //if the user input is not handled above then
                //control over selection is handed over to the browser
                let clonedState = core.cloneState();
                //we set selectionChange to null as
                //otherwise react will interfere with selection control
                clonedState.selectionChange = null;
                core.setState({...clonedState});
        }
    }
}