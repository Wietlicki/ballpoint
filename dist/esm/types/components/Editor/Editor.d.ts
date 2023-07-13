import React, { Component } from 'react';
import { Core } from '../Core/Core';
import { IEditorProps, IEditorState } from './Editor.type';
import './Editor.css';
export declare class Editor extends Component<IEditorProps, IEditorState> {
    coreRef: React.RefObject<Core>;
    static defaultProps: Partial<IEditorProps>;
    constructor(props: IEditorProps);
    allowParagraph: () => boolean;
    handleFontSizeChange: (size: string) => void;
    handleHeaderChange: (tag: string) => void;
    handleFontColorChange: (color: string) => void;
    handleBoldClick: () => void;
    handleItalicClick: () => void;
    handleUnderlineClick: () => void;
    handleStrikethroughClick: () => void;
    handleTextAlignLeftClick: () => void;
    handleTextAlignCenterClick: () => void;
    handleTextAlignRightClick: () => void;
    handleParagraphClick: () => void;
    handleBulletListClick: () => void;
    handleNumberListClick: () => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
