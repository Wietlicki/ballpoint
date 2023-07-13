import React, { Component} from 'react';
import { Meta, StoryObj } from "@storybook/react";
import { Core } from '../index';
import { actionApplyFormatting } from '../index';
import { actionApplyStyle } from '../index';

export class CustomEditor extends Component {
    coreRef: React.RefObject<Core>;

    constructor(props: {initHtmlString?: string}){
        super(props);
        this.coreRef = React.createRef<Core>();
    }
    handleBoldClick = () => { actionApplyFormatting(this.coreRef.current, "b") };
    handleBigFontClick = () => { actionApplyStyle(this.coreRef.current, "fontSize", "28px") }
    render() {
        return <div>
            <button onClick={this.handleBoldClick}>Make Text Bold</button>
            <button onClick={this.handleBigFontClick}>Make Text Big</button>
            <Core 
                ref={this.coreRef}
                keyActionsConfig={{allowBold: true, allowRedo: true, allowUndo: true}}/>
        </div>
    }
}

const meta: Meta<typeof CustomEditor> = {
    component: CustomEditor,
    title: "Ballpoint/CustomEditor",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof CustomEditor>;

export const Default: Story = (args) => (
    <CustomEditor {...args}/>
);
Default.args = {
};