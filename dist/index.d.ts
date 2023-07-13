import React, { MouseEventHandler, Component } from 'react';

interface ToolbarButtonProps {
    text?: string;
    highlighted?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

declare class ToolbarButton extends Component<ToolbarButtonProps> {
    render(): React.JSX.Element;
}

export { ToolbarButton };
