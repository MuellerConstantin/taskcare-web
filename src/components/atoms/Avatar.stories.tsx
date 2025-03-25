import type { Meta } from "@storybook/react";
import React from "react";
import { User } from "lucide-react";
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
  src: "https://placehold.co/600x400.png",
  alt: "Avatar",
};

export const Small = (args: any) => <Avatar {...args} />;

Small.args = {
  src: "https://placehold.co/600x400.png",
  alt: "Avatar",
  size: "sm",
};

export const Large = (args: any) => <Avatar {...args} />;

Large.args = {
  src: "https://placehold.co/600x400.png",
  alt: "Avatar",
  size: "lg",
};

export const ExtraSmall = (args: any) => <Avatar {...args} />;

ExtraSmall.args = {
  src: "https://placehold.co/600x400.png",
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

export const Icon = (args: any) => <Avatar {...args} />;

Icon.args = {
  alt: "Avatar",
  icon: <User className="h-full w-full" />,
};

export const IconFailed = (args: any) => <Avatar {...args} />;

IconFailed.args = {
  alt: "Avatar",
  failed: true,
  icon: <User className="h-full w-full" />,
};

export const IconLoading = (args: any) => (
  <Avatar {...args} className="animate-pulse" />
);

IconLoading.args = {
  alt: "Avatar",
  icon: <User className="h-full w-full" />,
};
