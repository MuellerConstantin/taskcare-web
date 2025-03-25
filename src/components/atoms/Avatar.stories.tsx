import type { Meta, StoryObj } from "@storybook/react";
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

export const Default: StoryObj<typeof Avatar> = {
  args: {
    src: "https://placehold.co/600x400.png",
    alt: "Avatar",
  },
};

export const Small: StoryObj<typeof Avatar> = {
  args: {
    src: "https://placehold.co/600x400.png",
    alt: "Avatar",
    size: "sm",
  },
};

export const Large: StoryObj<typeof Avatar> = {
  args: {
    src: "https://placehold.co/600x400.png",
    alt: "Avatar",
    size: "lg",
  },
};

export const ExtraSmall: StoryObj<typeof Avatar> = {
  args: {
    src: "https://placehold.co/600x400.png",
    alt: "Avatar",
    size: "xs",
  },
};

export const NoImage: StoryObj<typeof Avatar> = {
  args: {
    alt: "Avatar",
  },
};

export const NoImageExtraSmall: StoryObj<typeof Avatar> = {
  args: {
    alt: "Avatar",
    size: "xs",
  },
};

export const Icon: StoryObj<typeof Avatar> = {
  args: {
    alt: "Avatar",
    icon: <User className="h-full w-full" />,
  },
};

export const IconFailed: StoryObj<typeof Avatar> = {
  args: {
    alt: "Avatar",
    failed: true,
    icon: <User className="h-full w-full" />,
  },
};
