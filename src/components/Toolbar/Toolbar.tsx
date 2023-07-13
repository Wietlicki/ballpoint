import { Component, ReactElement} from 'react';
import { ToolbarProps, ToolbarState } from "./Toolbar.types";
import { ToolbarButton } from '../ToolbarButton';
import * as svgs from './svg';
import "./Toolbar.css";
import { ToolbarColorButton } from '../ToolbarColorButton/ToolbarColorButton';

export class Toolbar extends Component<ToolbarProps, ToolbarState>{
    public static defaultProps: Partial<ToolbarProps> = {
        className: "ballpoint-tb",
        toolbarButtonClassName: "ballpoint-tb-bt",
        toolbarColorButtonClassName: "ballpoint-tb-color-bt",
        toolbarStyle: "default",
        toolbarOptions: {
            displayBoldButton: true, 
            displayItalicButton: true,
            displayUnderlineButton: true,
            displayStrikeoutButton: true,
            displayFontSizeButton: true,
            displayFontColorButton: true,
            displayTextAlignLeftButton: true,
            displayTextAlignCenterButton: true,
            displayTextAlignRightButton: true,
            displayParagraphButton: true,
            displayHeaderButton: true,
            displayBulletListButton: true,
            displayNumberListButton: true
        }
    };
    state: ToolbarState = {
        displayMenu: false
    };
    handleFontSizeClick = () => {
        this.setState({
            displayMenu: !(this.state.displayMenu && this.state.currentMenu === "font-size"), 
            currentMenu: "font-size"
        });
    };
    handleFontSizeSelectionClick = (size: string) => {
        return () => {
            this.setState({displayMenu: false}, ()=>{
                if(this.props.onFontSizeChange) this.props.onFontSizeChange(size);
            })
        };
    };
    handleFontColorClick = () => {
        this.setState({
            displayMenu: !(this.state.displayMenu && this.state.currentMenu === "font-color"), 
            currentMenu: "font-color"
        });
    };
    handleFontColorSelectionClick = (color: string) => {
        this.setState({displayMenu: false}, ()=>{
            if(this.props.onFontColorChange) this.props.onFontColorChange(color);
        });
    };
    handleHeaderClick = () => {
        this.setState({
            displayMenu: !(this.state.displayMenu && this.state.currentMenu === "header"), 
            currentMenu: "header"
        });
    };
    handleHeaderSelectionClick = (tag: string) => {
        return () => {
            this.setState({displayMenu: false}, ()=>{
                if(this.props.onHeaderChange) this.props.onHeaderChange(tag);
            })
        };
    };
    render(){
        const toolbarCombinedClassName = `${this.props.className} ${this.props.toolbarStyle}`;
        const toolbarButtonCombinedClassName = `${this.props.toolbarButtonClassName} ${this.props.toolbarStyle}`;
        const toolbarColorbuttonCombinedCalssName = `${this.props.toolbarColorButtonClassName} ${this.props.toolbarStyle}`;

        const boldButton = this.props.toolbarOptions.displayBoldButton ? 
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onBoldClick}>{svgs.svgBold}</ToolbarButton> : null;

        const italicButton = this.props.toolbarOptions.displayItalicButton ? 
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onItalicClick}>{svgs.svgItalic}</ToolbarButton> : null;

        const underlineButton = this.props.toolbarOptions.displayUnderlineButton ? 
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onUnderlineClick}>{svgs.svgUnderline}</ToolbarButton> : null;

        const strikeoutButton = this.props.toolbarOptions.displayStrikeoutButton ? 
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onStrikeoutClick}>{svgs.svgStrikeout}</ToolbarButton> : null;

        const fontSizeButton = this.props.toolbarOptions.displayFontSizeButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleFontSizeClick}>{svgs.svgFontSize}</ToolbarButton> : null;

        const fontColorButton = this.props.toolbarOptions.displayFontColorButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleFontColorClick}>{svgs.svgFontColor}</ToolbarButton> : null;

        const textAlignLeftButton = this.props.toolbarOptions.displayTextAlignLeftButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onTextAlignLeftClick}>{svgs.svgTextAlignLeft}</ToolbarButton> : null;

        const textAlignCenterButton = this.props.toolbarOptions.displayTextAlignCenterButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onTextAlignCenterClick}>{svgs.svgTextAlignCenter}</ToolbarButton> : null;

        const textAlignRightButton = this.props.toolbarOptions.displayTextAlignRightButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onTextAlignRightClick}>{svgs.svgTextAlignRight}</ToolbarButton> : null;

        const paragraphButton = this.props.toolbarOptions.displayParagraphButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onParagraphClick}>{svgs.svgParagraph}</ToolbarButton> : null;

        const headerButton = this.props.toolbarOptions.displayHeaderButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderClick}>{svgs.svgHeader}</ToolbarButton> : null;

        const bulletListButton = this.props.toolbarOptions.displayBulletListButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onBulletListClick}>{svgs.svgBulletList}</ToolbarButton> : null;

        const numberListButton = this.props.toolbarOptions.displayNumberListButton ?
            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.props.onNumberListClick}>{svgs.svgNumberList}</ToolbarButton> : null;

        let menu: JSX.Element | null = null; 

        if(this.state.displayMenu){
            switch(this.state.currentMenu){
                case "font-size":
                    menu = <div className={"menu"}>
                        {fontSizeButton}
                        <div className="buttons">
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleFontSizeSelectionClick("xl")}>{svgs.svgExtraLarge}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleFontSizeSelectionClick("l")}>{svgs.svgLarge}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleFontSizeSelectionClick("m")}>{svgs.svgMedium}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleFontSizeSelectionClick("s")}>{svgs.svgSmall}</ToolbarButton>
                        </div>
                    </div>
                    break;
                case "font-color":
                    menu = <div className={"menu"}>
                        {fontColorButton}
                        <div className="buttons">
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#696969" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#ff0000" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#b22222" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#ffa500" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#008000" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#2e8b57" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#0000ff" onClick={this.handleFontColorSelectionClick}/>
                            <ToolbarColorButton className = {toolbarColorbuttonCombinedCalssName} color="#4169e1" onClick={this.handleFontColorSelectionClick}/>
                        </div>
                    </div>
                    break;
                case "header":
                    menu = <div className={"menu"}>
                        {headerButton}
                        <div className="buttons">
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderSelectionClick("h1")}>{svgs.svgHeaderOne}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderSelectionClick("h2")}>{svgs.svgHeaderTwo}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderSelectionClick("h3")}>{svgs.svgHeaderThree}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderSelectionClick("h4")}>{svgs.svgHeaderFour}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderSelectionClick("h5")}>{svgs.svgHeaderFive}</ToolbarButton>
                            <ToolbarButton className={toolbarButtonCombinedClassName} onClick={this.handleHeaderSelectionClick("h6")}>{svgs.svgHeaderSix}</ToolbarButton>
                        </div>
                    </div>
                    break;
            }
        }

        const mainButtonsClassName = this.state.displayMenu ? "buttons hidden" : "buttons"; 
        const basicFormatButtons = this.props.toolbarOptions.displayBoldButton || 
            this.props.toolbarOptions.displayItalicButton || 
            this.props.toolbarOptions.displayUnderlineButton ||
            this.props.toolbarOptions.displayStrikeoutButton ?
            <div className={mainButtonsClassName}>
                {boldButton}
                {italicButton}
                {underlineButton}
                {strikeoutButton}
            </div> : null;


        const fontStyleButtons = this.props.toolbarOptions.displayFontSizeButton || this.props.toolbarOptions.displayFontColorButton ?
            <div className={mainButtonsClassName}>
                {fontSizeButton}
                {fontColorButton}
            </div> : null;

        const textAlignButtons = this.props.toolbarOptions.displayTextAlignLeftButton ||
            this.props.toolbarOptions.displayTextAlignCenterButton ||
            this.props.toolbarOptions.displayTextAlignRightButton ?
            <div className={mainButtonsClassName}>
                {textAlignLeftButton}
                {textAlignCenterButton}
                {textAlignRightButton}
            </div> : null;

        const formatButtons = this.props.toolbarOptions.displayParagraphButton ||
            this.props.toolbarOptions.displayHeaderButton ||
            this.props.toolbarOptions.displayBulletListButton ||
            this.props.toolbarOptions.displayNumberListButton ?
            <div className={mainButtonsClassName}>
                {paragraphButton}
                {headerButton}
                {bulletListButton}
                {numberListButton}
            </div> : null;

        return (
            <div className={toolbarCombinedClassName}>
                {basicFormatButtons}
                {fontStyleButtons}
                {textAlignButtons}
                {formatButtons}
                {menu}
            </div>
        );
    }
}