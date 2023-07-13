import { KeyboardEvent } from "react";
import { Core } from "../Core";
import { CoreKeyActionsConfig } from "../Core.types";
export declare function genKeyDownHandler(core: Core, keyActionsConfig?: CoreKeyActionsConfig): (e: KeyboardEvent) => void;
