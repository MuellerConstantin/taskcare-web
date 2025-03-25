import React from "react";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { BoardLogo } from "./BoardLogo";

const SUCCESS_ID = "55b8dec2-a09f-42e3-8a89-969a89ebaa59";
const MISSING_ID = "f02b8620-b4e5-4c37-863c-f655bbb6a892";
const ERROR_ID = "1b9a31b4-6817-48c8-b687-a22bb35fbafc";
const LOADING_ID = "7076b879-ef55-4824-975d-5a57402f73b5";

const meta: Meta<typeof BoardLogo> = {
  title: "Organisms/Board/BoardLogo",
  component: BoardLogo,
  parameters: {
    msw: {
      handlers: [
        http.get(
          "/api/proxy/boards/:boardId/logo-image",
          async ({ params }) => {
            switch (params.boardId) {
              case SUCCESS_ID: {
                const buffer = await fetch(
                  "https://placehold.co/600x400/f59e0b/ffffff/png",
                ).then((response) => response.arrayBuffer());

                return HttpResponse.arrayBuffer(buffer, {
                  headers: {
                    "Content-Type": "image/png",
                  },
                });
              }
              case MISSING_ID:
                return new HttpResponse(null, {
                  status: 404,
                });
              case ERROR_ID:
                return new HttpResponse(null, {
                  status: 500,
                });
              case LOADING_ID:
                return new Promise(() => {});
            }
          },
        ),
      ],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: SUCCESS_ID,
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const Errored: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: ERROR_ID,
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const Missing: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: MISSING_ID,
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const Loading: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: LOADING_ID,
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const Filled: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: SUCCESS_ID,
    className: "!w-full !h-full",
  },
  render: (args) => (
    <div className="h-24 w-63">
      <BoardLogo {...args} />
    </div>
  ),
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const FilledErrored: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: ERROR_ID,
    className: "!w-full !h-full",
  },
  render: (args) => (
    <div className="h-24 w-63">
      <BoardLogo {...args} />
    </div>
  ),
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const FilledMissing: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: MISSING_ID,
    className: "!w-full !h-full",
  },
  render: (args) => (
    <div className="h-24 w-63">
      <BoardLogo {...args} />
    </div>
  ),
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const FilledLoading: StoryObj<typeof BoardLogo> = {
  args: {
    boardId: LOADING_ID,
    className: "!w-full !h-full",
  },
  render: (args) => (
    <div className="h-24 w-63">
      <BoardLogo {...args} />
    </div>
  ),
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};
