import React, { Component} from 'react';
import { CoreClipboardActionsConfig, CoreKeyActionsConfig, CoreState, ICoreState, Toolbar } from '..';
import { actionApplyAlignment } from '../Core/Actions/actionApplyAlignment';
import { actionApplyFormatting } from '../Core/Actions/actionApplyFormatting';
import { actionApplyStyle } from '../Core/Actions/actionApplyStyle';
import { actionFormatAsHeaderOrParagraph } from '../Core/Actions/actionFormatAsHeaderOrParagraph';
import { actionFormatAsList } from '../Core/Actions/actionFormatAsList';
import { Core } from '../Core/Core';
import { IEditorProps, IEditorState } from './Editor.type';
import './Editor.css';

export class Editor extends Component<IEditorProps, IEditorState> {
    coreRef: React.RefObject<Core>;
    public static defaultProps: Partial<IEditorProps> = {
        editorActionsConfig: {
            allowBold: true,
            allowItalic: true,
            allowUnderline: true,
            allowStrikeOut: true,
            allowFontSizeSelect: true,
            allowFontColorSelect: true,
            allowTextAlign: true,
            allowHeader: true,
            allowBulletList: true,
            allowNumberedList: true,
            allowUndo: true,
            allowRedo: true
        },
        editorClipboardActionsConfig: {
            allowCopy: true,
            allowCut: true,
            allowPaste: true
        }
    };
    constructor(props: IEditorProps){
        super(props);
        this.coreRef = React.createRef<Core>();
    }

    allowParagraph = (): boolean => {
        return this.props.editorActionsConfig.allowHeader === true ||
            this.props.editorActionsConfig.allowBulletList === true ||
            this.props.editorActionsConfig.allowNumberedList === true;
    }
    handleFontSizeChange = (size: string) => {
        if(!this.coreRef.current) return;
        switch(size){
            case "xl": actionApplyStyle(this.coreRef.current, "fontSize", "36px");
            break;
            case "l": actionApplyStyle(this.coreRef.current, "fontSize", "24px");
            break;
            case "m": actionApplyStyle(this.coreRef.current, "fontSize", "16px");
            break;
            case "s": actionApplyStyle(this.coreRef.current, "fontSize", "10px");
            break;
        }
    }
    handleHeaderChange = (tag: string) => {
        if(this.props.editorActionsConfig.allowHeader === true && this.coreRef.current) actionFormatAsHeaderOrParagraph(this.coreRef.current, tag);
    }
    handleFontColorChange = (color: string) => {
        if(this.props.editorActionsConfig.allowFontColorSelect === true && this.coreRef.current) actionApplyStyle(this.coreRef.current, "color", color);
    }
    handleBoldClick = () => {
        if(this.props.editorActionsConfig.allowBold === true && this.coreRef.current) actionApplyFormatting(this.coreRef.current, "b");
    }
    handleItalicClick = () => {
        if(this.props.editorActionsConfig.allowItalic === true && this.coreRef.current) actionApplyFormatting(this.coreRef.current, "i");
    }
    handleUnderlineClick = () => {
        if(this.props.editorActionsConfig.allowUnderline === true && this.coreRef.current) actionApplyFormatting(this.coreRef.current, "u");
    }
    handleStrikethroughClick = () => {
        if(this.props.editorActionsConfig.allowStrikeOut === true && this.coreRef.current) actionApplyFormatting(this.coreRef.current, "s");
    }
    handleTextAlignLeftClick = () => {
        if(this.props.editorActionsConfig.allowTextAlign === true && this.coreRef.current) actionApplyAlignment(this.coreRef.current, "left");
    }
    handleTextAlignCenterClick = () => {
        if(this.props.editorActionsConfig.allowTextAlign === true && this.coreRef.current) actionApplyAlignment(this.coreRef.current, "center");
    }
    handleTextAlignRightClick = () => {
        if(this.props.editorActionsConfig.allowTextAlign === true && this.coreRef.current) actionApplyAlignment(this.coreRef.current, "right");
    }
    handleParagraphClick = () => {
        if(this.allowParagraph() && this.coreRef.current) actionFormatAsHeaderOrParagraph(this.coreRef.current, "p");
    }
    handleBulletListClick = () => {
        if(this.props.editorActionsConfig.allowBulletList === true && this.coreRef.current) actionFormatAsList(this.coreRef.current, "ul");
    }
    handleNumberListClick = () => {
        if(this.props.editorActionsConfig.allowNumberedList === true && this.coreRef.current) actionFormatAsList(this.coreRef.current, "ol");
    }

    render(){
        //set general theme
        let theme = "default";
        if(this.props.theme && ["light", "dark", "default"].includes(this.props.theme)) theme = this.props.theme;
        //translate editor theme to core focus theme
        let coreFocusTheme: "monochrome-light" | "monochrome-dark" | "color" | "default" = "default";
        switch(theme){
            case "light": coreFocusTheme = "monochrome-light"; break;
            case "dark": coreFocusTheme = "monochrome-dark"; break;
            case "default": coreFocusTheme = "color"; break;
        }       
        //align config for toolbar and core using editor props
        const toolbarOptions = {
            displayBoldButton: this.props.editorActionsConfig.allowBold === true, 
            displayItalicButton: this.props.editorActionsConfig.allowItalic === true,
            displayUnderlineButton: this.props.editorActionsConfig.allowUnderline === true,
            displayStrikeoutButton: this.props.editorActionsConfig.allowStrikeOut === true,
            displayFontSizeButton: this.props.editorActionsConfig.allowFontSizeSelect === true,
            displayFontColorButton: this.props.editorActionsConfig.allowFontColorSelect === true,
            displayTextAlignLeftButton: this.props.editorActionsConfig.allowTextAlign === true,
            displayTextAlignCenterButton: this.props.editorActionsConfig.allowTextAlign === true,
            displayTextAlignRightButton: this.props.editorActionsConfig.allowTextAlign === true,
            displayParagraphButton: this.props.editorActionsConfig.allowHeader === true,
            displayHeaderButton: this.allowParagraph(),
            displayBulletListButton: this.props.editorActionsConfig.allowBulletList === true,
            displayNumberListButton: this.props.editorActionsConfig.allowNumberedList === true
        }
        const coreKeyActionsConfig: CoreKeyActionsConfig = {
            allowBold: this.props.editorActionsConfig.allowBold === true,
            allowItalic: this.props.editorActionsConfig.allowItalic === true,
            allowUnderline: this.props.editorActionsConfig.allowUnderline === true,
            allowUndo: this.props.editorActionsConfig.allowUndo === true,
            allowRedo: this.props.editorActionsConfig.allowRedo === true
        }
        const coreClipboardActionsConfig: CoreClipboardActionsConfig = {
            allowCopy: this.props.editorClipboardActionsConfig.allowCopy === true,
            allowCut: this.props.editorClipboardActionsConfig.allowCut === true,
            allowPaste: this.props.editorClipboardActionsConfig.allowPaste === true
        }
        //create init core state for the uncontrolled component scenario
        const initCoreState: ICoreState | undefined = this.props.initHtml || this.props.initPlainText ? 
            new CoreState(this.props.initHtml, this.props.initPlainText) :
            undefined;
            
        return (
            <div className={`ballpoint-editor ${theme}`}>
                <Toolbar 
                    toolbarStyle={this.props.theme}
                    toolbarOptions={toolbarOptions}
                    onFontSizeChange={this.handleFontSizeChange}
                    onFontColorChange={this.handleFontColorChange}
                    onBoldClick={this.handleBoldClick}
                    onItalicClick={this.handleItalicClick}
                    onUnderlineClick={this.handleUnderlineClick}
                    onStrikeoutClick={this.handleStrikethroughClick}
                    onTextAlignLeftClick={this.handleTextAlignLeftClick}
                    onTextAlignCenterClick={this.handleTextAlignCenterClick}
                    onTextAlignRightClick={this.handleTextAlignRightClick}
                    onParagraphClick={this.handleParagraphClick}
                    onBulletListClick={this.handleBulletListClick}
                    onNumberListClick={this.handleNumberListClick}
                    onHeaderChange={this.handleHeaderChange}/>
                <Core 
                    ref={this.coreRef}
                    theme={this.props.theme}
                    keyActionsConfig={coreKeyActionsConfig}
                    clipboardActionsConfig={coreClipboardActionsConfig}
                    focusTheme={coreFocusTheme}
                    initCoreState={initCoreState}
                    controlledCoreState={this.props.controlledCoreState}
                    onChange={this.props.onChange}/>
            </div>
        );
    }
}