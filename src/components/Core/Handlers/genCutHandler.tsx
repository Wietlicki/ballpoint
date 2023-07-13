import { Core } from "../Core";
import { actionCut } from "../Actions/actionCut";
import { ClipboardEvent } from 'react';

export function genCutHandler(core: Core, allowCut?: boolean) : (e: ClipboardEvent) => void {
    return function (e: ClipboardEvent){
        e.preventDefault();
        if(allowCut === true) actionCut(core, e);
    }
}