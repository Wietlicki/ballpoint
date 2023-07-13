import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Toolbar } from "../index";

const meta: Meta<typeof Toolbar> = {
    component: Toolbar,
    title: "Ballpoint/Toolbar",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = (args) => (
    <Toolbar data-testId="toolbar-meh" onBoldClick={()=>{console.log("bold is clicked!")}}{...args}/>
);
Default.args = {
};

export const Light: Story = (args) => (
    <Toolbar data-testId="toolbar-meh" toolbarStyle="light" onBoldClick={()=>{console.log("bold is clicked!")}}{...args}/>
);
Light.args = {
};

export const Dark: Story = (args) => (
    <Toolbar data-testId="toolbar-meh" toolbarStyle="dark" onBoldClick={()=>{console.log("bold is clicked!")}}{...args}/>
);
Dark.args = {
};
