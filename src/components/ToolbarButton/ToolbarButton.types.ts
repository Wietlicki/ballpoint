import { MouseEventHandler } from "react";

export interface ToolbarButtonProps {
  text?: string;
  className?: string;
  activeClassName?: string;
  active?: boolean;
  disabled?: boolean;
  children?: string | JSX.Element;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
