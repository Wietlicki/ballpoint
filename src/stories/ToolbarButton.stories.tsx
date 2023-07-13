import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ToolbarButton } from "../components/ToolbarButton";
import { svgBold } from "../components/Toolbar/svg/bold";

const meta: Meta<typeof ToolbarButton> = {
  component: ToolbarButton,
  title: "Ballpoint/ToolbarButton",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ToolbarButton>;

export const DefaultWithText: Story = (args) => (
  <ToolbarButton data-testId="InputField-id" {...args}>ButtonText</ToolbarButton>
);
DefaultWithText.args = {
};

export const DefaultWithSvg: Story = (args) => (
  <ToolbarButton data-testId="InputField-id" {...args}>{svgBold}</ToolbarButton>
);
DefaultWithSvg.args = {
};

export const LightWithText: Story = (args) => (
  <ToolbarButton data-testId="InputField-id" {...args}>ButtonText</ToolbarButton>
);
LightWithText.args = {
  className: "ballpoint-tb-bt light"
};

export const LightWithSvg: Story = (args) => (
  <ToolbarButton data-testId="InputField-id" {...args}>{svgBold}</ToolbarButton>
);
LightWithSvg.args = {
  className: "ballpoint-tb-bt light"
};

export const DarkWithText: Story = (args) => (
  <ToolbarButton data-testId="InputField-id" {...args}>ButtonText</ToolbarButton>
);
DarkWithText.args = {
  className: "ballpoint-tb-bt dark"
};

export const DarkWithSvg: Story = (args) => (
  <ToolbarButton data-testId="InputField-id" {...args}>{svgBold}</ToolbarButton>
);
DarkWithSvg.args = {
  className: "ballpoint-tb-bt dark"
};
