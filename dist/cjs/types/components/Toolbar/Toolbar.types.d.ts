type ToolbarOptions = {
    displayBoldButton?: boolean;
    displayItalicButton?: boolean;
    displayUnderlineButton?: boolean;
    displayStrikeoutButton?: boolean;
    displayFontSizeButton?: boolean;
    displayFontColorButton?: boolean;
    displayTextAlignLeftButton?: boolean;
    displayTextAlignCenterButton?: boolean;
    displayTextAlignRightButton?: boolean;
    displayParagraphButton?: boolean;
    displayHeaderButton?: boolean;
    displayBulletListButton?: boolean;
    displayNumberListButton?: boolean;
};
export interface ToolbarProps {
    onBoldClick?: () => void;
    onItalicClick?: () => void;
    onUnderlineClick?: () => void;
    onStrikeoutClick?: () => void;
    onFontSizeChange?: (fontSizeCategory: string) => void;
    onFontColorChange?: (color: string) => void;
    onTextAlignLeftClick?: () => void;
    onTextAlignCenterClick?: () => void;
    onTextAlignRightClick?: () => void;
    onParagraphClick?: () => void;
    onHeaderChange?: (tag: string) => void;
    onBulletListClick?: () => void;
    onNumberListClick?: () => void;
    className: string;
    toolbarButtonClassName: string;
    toolbarColorButtonClassName: string;
    toolbarStyle: "light" | "dark" | "default";
    toolbarOptions: ToolbarOptions;
}
export interface ToolbarState {
    displayMenu: boolean;
    currentMenu?: string;
}
export {};
