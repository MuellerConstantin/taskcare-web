import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Link } from "@/components/atoms/Link";

const meta: Meta<typeof Link> = {
  title: "Atoms/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Primary: StoryObj<typeof Link> = {
  render: (args) => <Link {...args}>Link</Link>,
};

Primary.args = {
  href: "/",
  variant: "primary",
};

export const Secondary: StoryObj<typeof Link> = {
  render: (args) => <Link {...args}>Link</Link>,
};

Secondary.args = {
  href: "/",
  variant: "secondary",
};

export const Disabled: StoryObj<typeof Link> = {
  render: (args) => <Link {...args}>Link</Link>,
};

Disabled.args = {
  href: "/",
  isDisabled: true,
};
