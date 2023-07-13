import React, { Component} from 'react';
import { CoreKeyActionsConfig, ICoreProps, ICoreState } from './Core.types';
import { genKeyDownHandler } from './Handlers/genKeyDownHandler';
import { Selection } from './Selection/Selection';
import "./Core.css";
import { actionInputSelectionChange } from './Actions/actionInputSelectionChange';
import { genPasteHandler } from './Handlers/genPasteHandler';
import { genCopyHandler } from './Handlers/genCopyHandler';
import { genCutHandler } from './Handlers/genCutHandler';
import { CoreState } from './CoreState';

export class Core extends Component<ICoreProps, ICoreState> {
    inputRef: React.RefObject<HTMLDivElement>;
    priorStates: Array<ICoreState>;
    redoStates: Array<ICoreState>;
    
    constructor(props: ICoreProps) {
        super(props);
        this.state = props.controlledCoreState ? new CoreState() : (props.initCoreState ?? new CoreState());
        this.inputRef = React.createRef();
        this.priorStates = [];
        this.redoStates = [];
    }
    fSelectionChangeListener = () => {
        if(document.activeElement === this.inputRef.current){
            actionInputSelectionChange(this);
        }
    };
    componentDidMount(){
        document.addEventListener('selectionchange', this.fSelectionChangeListener);
    }
    componentWillUnmount(){
        document.removeEventListener('selectionchange', this.fSelectionChangeListener);
    }
    componentDidUpdate(){
        //if component controlled we use the props state, otherwise we use component state
        const state = this.props.controlledCoreState ?? this.state;
        //check whether there is a selection change
        if(state.selectionChange){
            const jsSelection = document.getSelection();
            const range = state.selectionChange.toJsRange();

            if(jsSelection && range){
                jsSelection.removeAllRanges();
                jsSelection.addRange(range);
            }
            //in the uncontrolled scenario we clear out selection change after js selection has been updated
            if(!this.props.controlledCoreState) {
                this.setState({selectionChange: null});
            }
            if(typeof this.props.onChange === "function") this.props.onChange({...state, selectionChange: null});
        }
    }
    cloneState = () : ICoreState => {
        //if component controlled we clone the props state, otherwise we use component state
        const state = this.props.controlledCoreState ?? this.state;
        //clone temp node reference
        let temporaryTextNodeRefs = [...state.temporaryTextNodeRefs];
        //clone the node tree and replace any temp text references with the clones
        let contentNode = state.contentNode.clone(temporaryTextNodeRefs);
        //need to set selection change to current selection (as this may be null)
        let selectionChange = new Selection({contentNode, jsRange: document.getSelection()?.getRangeAt(0)});
        //return cloned state
        return {...state, contentNode, temporaryTextNodeRefs, selectionChange};
    }
    saveStateAsPrior = () => {
        //add current state as prior - keep max 10 prior states
        this.priorStates = [...this.priorStates.slice(-9), this.cloneState()];
    }
    updateState = (newState: ICoreState, savePriorState: boolean = true) => {
        //save state before it's modified as prior state
        if(savePriorState) this.saveStateAsPrior();
        //save changes directly to state only if component uncontrolled
        if(!this.props.controlledCoreState){
            //set new state as current state
            this.setState({...newState});
        }
        //run props change handler if there is one and pass the new state as param
        if(typeof this.props.onChange === "function") {
            this.props.onChange(newState);
        }
    }
    genDefaultKeyActionsConfig = (): CoreKeyActionsConfig => {
        return {allowBold: true, allowItalic: true, allowUnderline: true, allowUndo: true, allowRedo: true};
    }
    render(){
        //By default allow all key actions
        const keyActionsConfig = this.props.keyActionsConfig ?? this.genDefaultKeyActionsConfig();

        //By default allow all clipboard actions
        const allowPaste = this.props.clipboardActionsConfig?.allowPaste ?? true;
        const allowCopy = this.props.clipboardActionsConfig?.allowCopy ?? true;
        const allowCut = this.props.clipboardActionsConfig?.allowCut ?? true;

        const handleKeyDown = genKeyDownHandler(this, keyActionsConfig);
        const handlePaste = genPasteHandler(this, allowPaste);
        const handleCopy = genCopyHandler(this, allowCopy);
        const handleCut = genCutHandler(this, allowCut);

        let theme = "default";
        if(this.props.theme && ["light", "dark", "default"].includes(this.props.theme)) theme = this.props.theme;

        let focusTheme = "focus-theme-default";
        if(this.props.focusTheme && ["monochrome-dark", "monochrome-light", "color", "default"].includes(this.props.focusTheme)) {
            focusTheme = `focus-theme-${this.props.focusTheme}`;
        }

        const contentNode = this.props.controlledCoreState ? this.props.controlledCoreState.contentNode : this.state.contentNode;
        return (
            <div ref={this.inputRef}
                className={`ballpoint-core-area ${theme} ${focusTheme}`}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onCopy={handleCopy}
                onCut={handleCut}>
                {contentNode.toJSX()}
            </div>
        );
    }
}