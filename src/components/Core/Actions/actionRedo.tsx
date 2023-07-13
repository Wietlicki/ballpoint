import { Core } from "../Core";

export function actionRedo(core: Core){
    if(core.redoStates.length > 0){
        const coreState = core.redoStates.pop();
        if(coreState){
            core.updateState(coreState);
        }
    }
}