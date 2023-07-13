import { Component } from 'react';
import { ToolbarProps, ToolbarState } from "./Toolbar.types";
import "./Toolbar.css";
export declare class Toolbar extends Component<ToolbarProps, ToolbarState> {
    static defaultProps: Partial<ToolbarProps>;
    state: ToolbarState;
    handleFontSizeClick: () => void;
    handleFontSizeSelectionClick: (size: string) => () => void;
    handleFontColorClick: () => void;
    handleFontColorSelectionClick: (color: string) => void;
    handleHeaderClick: () => void;
    handleHeaderSelectionClick: (tag: string) => () => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
