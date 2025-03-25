import React from "react";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { BoardCardSkeleton } from "./BoardCardSkeleton";

const meta: Meta<typeof BoardCardSkeleton> = {
  title: "Organisms/Board/BoardCardSkeleton",
  component: BoardCardSkeleton,
};

export default meta;

export const Default: StoryObj<typeof BoardCardSkeleton> = {};

export const Errored: StoryObj<typeof BoardCardSkeleton> = {
  args: {
    error: true,
  },
};
