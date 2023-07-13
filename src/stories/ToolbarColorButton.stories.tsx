import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ToolbarColorButton } from "../components/ToolbarColorButton";

const meta: Meta<typeof ToolbarColorButton> = {
  component: ToolbarColorButton,
  title: "Ballpoint/ToolbarColorButton",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ToolbarColorButton>;

export const Default: Story = (args) => (
    <ToolbarColorButton data-testId="InputField-id" {...args}/>
);
Default.args = {
};
  
export const Light: Story = (args) => (
    <ToolbarColorButton data-testId="InputField-id" {...args}/>
);
Light.args = {
    className: "ballpoint-tb-color-bt light"
};

export const Dark: Story = (args) => (
    <ToolbarColorButton data-testId="InputField-id" {...args}/>
);
Dark.args = {
    className: "ballpoint-tb-color-bt dark"
};

export const DefaultWithRedColor: Story = (args) => (
    <ToolbarColorButton data-testId="InputField-id" {...args}/>
);
DefaultWithRedColor.args = {
    color: "red"
};