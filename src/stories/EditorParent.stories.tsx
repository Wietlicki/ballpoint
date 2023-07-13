import React, { Component} from 'react';
import { Meta, StoryObj } from "@storybook/react";
import { ICoreState } from "../index";
import { CoreState } from '../index';
import { Editor } from '../index';

export class EditorParent extends Component<{initHtmlString?: string}, {editorControlledState: ICoreState}> {
    constructor(props: {initHtmlString?: string}){
        super(props);
        this.state = {editorControlledState: new CoreState(props.initHtmlString)};
    }
    handleChange = (state: ICoreState) => {
        this.setState({editorControlledState: state});
    }
    render() {
        return <Editor controlledCoreState = {this.state.editorControlledState} onChange={this.handleChange}/>
    }
}

const meta: Meta<typeof EditorParent> = {
    component: EditorParent,
    title: "Ballpoint/EditorParent",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof EditorParent>;

export const Default: Story = (args) => (
    <EditorParent {...args}/>
);
Default.args = {
};

const someHtml = `
<html>
    <body>
        <h1>Who Am I? What Am I?</h1>
        <p><i>Am I a real piece of text or just some gibberish written to illustrate functionality?</i></p>
        <p><i>If I help build your understanding then does that make me more than just a text blob?</i></p>
        <p><i>I would hope so... but there is little appreciation in the world for the likes of me.</i></p>
        <p><i>I'll be lucky if I attract a glance or two.</i></p>
        <p><i>It's not easy being a text blob.</i></p>
        <p><b><span style={color:#595959}>Written By Text Blob</span></b></p>
    </body>
</html>`;

export const WithInit: Story = (args) => (
    <EditorParent {...args}/>
);
WithInit.args = {
    initHtmlString: someHtml 
}