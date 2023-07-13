import { Component } from 'react';
import { ToolbarColorButtonProps } from "./ToolbarColorButton.types";
import "./ToolbarColorButton.css";
export declare class ToolbarColorButton extends Component<ToolbarColorButtonProps> {
    static defaultProps: Partial<ToolbarColorButtonProps>;
    handleClick: (e: React.MouseEvent) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
