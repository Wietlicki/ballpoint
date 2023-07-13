import { Core } from "../Core";
import { actionPaste } from "../Actions/actionPaste";
import { ClipboardEvent } from 'react';

export function genPasteHandler(core: Core, allowPaste?: boolean) : (e: ClipboardEvent) => void {
    return function (e: ClipboardEvent){
        e.preventDefault();
        if(allowPaste === true) actionPaste(core, e.clipboardData?.getData("text/html"), e.clipboardData?.getData("text/plain"));
    }
}