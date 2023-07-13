import { Core } from "../Core";
import { actionCopy } from "../Actions/actionCopy";
import { ClipboardEvent } from 'react';

export function genCopyHandler(core: Core, allowCopy?: boolean) : (e: ClipboardEvent) => void {
    return function (e: ClipboardEvent){
        e.preventDefault();
        if(allowCopy === true) actionCopy(core, e);
    }
}