import { Component} from 'react';
import { ToolbarButtonProps } from "./ToolbarButton.types";
import "./ToolbarButton.css";

export class ToolbarButton extends Component<ToolbarButtonProps>{
    public static defaultProps: Partial<ToolbarButtonProps> = {
        className: "ballpoint-tb-bt default",
        activeClassName: "active",
    };

    render(){
        return (
            <button
                className={this.props.className} 
                type="button" 
                disabled={this.props.disabled}
                onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}