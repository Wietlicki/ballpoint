import { MouseEventHandler } from "react";
export interface ToolbarButtonProps {
    text?: string;
    highlighted?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}
