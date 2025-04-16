import React from "react";
import { Breadcrumb, Breadcrumbs } from "./Breadcrumbs";

import type { Meta } from "@storybook/react";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Atoms/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default = (args: any) => (
  <Breadcrumbs {...args}>
    <Breadcrumb href="/">Home</Breadcrumb>
    <Breadcrumb href="/react-aria">Boards</Breadcrumb>
    <Breadcrumb>Lorem Ipsum</Breadcrumb>
  </Breadcrumbs>
);
