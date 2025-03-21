import type { Meta } from "@storybook/react";
import React from "react";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Organisms/Navbar",
  component: Navbar,
};

export default meta;

export const Default = (args: any) => <Navbar {...args} />;

Default.args = {};
