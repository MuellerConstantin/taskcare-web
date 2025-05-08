import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Molecules/Footer",
  component: Footer,
};

export default meta;

export const Default: StoryObj<typeof Footer> = () => <Footer />;

Default.args = {};
