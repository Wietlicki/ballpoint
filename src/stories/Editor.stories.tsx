import React, { Component} from 'react';
import { Meta, StoryObj } from "@storybook/react";
import { Editor } from "../index"

const meta: Meta<typeof Editor> = {
    component: Editor,
    title: "Ballpoint/Editor",
    argTypes: {}
};
export default meta;

type Story = StoryObj<typeof Editor>;

export const Default: Story = (args) => (
    <Editor {...args}/>
);
Default.args = {
};

export const Light: Story = (args) => (
    <Editor {...args}/>
);
Light.args = {
    theme: "light"
};

export const Dark: Story = (args) => (
    <Editor {...args}/>
);
Dark.parameters = {
    backgrounds: {
        default: "dark",
        values: [{ name: "dark", value: "rgb(40, 40, 40)"}]
    }
}
Dark.args = {
    theme: "dark"
};

export const WithActionsConfig: Story = (args) => (
    <Editor {...args}/>
);
WithActionsConfig.args = {
    editorActionsConfig: {
        allowBold: true,
        allowItalic: true,
        allowStrikeOut: true,
        allowHeader: true,
        allowBulletList: true,
        allowUndo: true
    },
    theme: "light"
}

export const WithInitHtml: Story = (args) => (
    <Editor {...args}/>
);
WithInitHtml.args = {
    theme: "light",
    initHtml: `
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
    </html>`
}
/*
Perhaps we need an editor state class, which can initiate from a html string
- or it can initiate without anything passed and it will just create a content node

- in the uncontrolled scenario we'd check in the Editor constructor if valid state is passed and construct that state ourselves if needed
*/