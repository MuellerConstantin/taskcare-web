import type { Meta } from "@storybook/react";
import React from "react";
import { Avatar } from "@/components/atoms/Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default = (args: any) => <Avatar {...args} />;

Default.args = {
  src: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  alt: "Avatar",
};

export const Small = (args: any) => <Avatar {...args} />;

Small.args = {
  src: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  alt: "Avatar",
  size: "sm",
};

export const Large = (args: any) => <Avatar {...args} />;

Large.args = {
  src: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  alt: "Avatar",
  size: "lg",
};

export const ExtraSmall = (args: any) => <Avatar {...args} />;

ExtraSmall.args = {
  src: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  alt: "Avatar",
  size: "xs",
};

export const NoImage = (args: any) => <Avatar {...args} />;

NoImage.args = {
  alt: "Avatar",
};

export const NoImageExtraSmall = (args: any) => <Avatar {...args} />;

NoImageExtraSmall.args = {
  alt: "Avatar",
  size: "xs",
};
