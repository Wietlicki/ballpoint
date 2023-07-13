import { Component} from 'react';
import { ToolbarColorButtonProps } from "./ToolbarColorButton.types";
import "./ToolbarColorButton.css";

export class ToolbarColorButton extends Component<ToolbarColorButtonProps>{
    public static defaultProps: Partial<ToolbarColorButtonProps> = {
        className: "ballpoint-tb-color-bt default",
        activeClassName: "active",
        color: "#000000"
    };
    handleClick = (e: React.MouseEvent): void => {
        if(this.props.onClick) this.props.onClick(this.props.color);
    }
    render(){
        return (
            <button
                className={this.props.className} 
                type="button"
                onClick={this.handleClick}>
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" fill={this.props.color}/>
                </svg>
            </button>
        );
    }
}