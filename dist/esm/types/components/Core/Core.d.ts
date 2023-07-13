import React, { Component } from 'react';
import { CoreKeyActionsConfig, ICoreProps, ICoreState } from './Core.types';
import "./Core.css";
export declare class Core extends Component<ICoreProps, ICoreState> {
    inputRef: React.RefObject<HTMLDivElement>;
    priorStates: Array<ICoreState>;
    redoStates: Array<ICoreState>;
    constructor(props: ICoreProps);
    fSelectionChangeListener: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    cloneState: () => ICoreState;
    saveStateAsPrior: () => void;
    updateState: (newState: ICoreState, savePriorState?: boolean) => void;
    genDefaultKeyActionsConfig: () => CoreKeyActionsConfig;
    render(): import("react/jsx-runtime").JSX.Element;
}
