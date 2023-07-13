export interface ToolbarColorButtonProps {
    className?: string;
    activeClassName?: string;
    active?: boolean;
    color: string;
    onClick?: (color: string) => void;
}
