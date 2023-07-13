import { Core } from "../Core";

export function actionUndo(core: Core){
    if(core.priorStates.length > 0){
        core.redoStates = [core.cloneState()];
        const coreState = core.priorStates.pop();
        if(coreState){
            //set core state ot the previous state, but do not save current state as prior
            //this will go into the redo stack instead
            core.updateState(coreState, false);
        }
    }  
}