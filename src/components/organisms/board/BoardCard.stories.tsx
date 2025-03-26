import React from "react";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { BoardCard } from "./BoardCard";

const SUCCESS_ID = "55b8dec2-a09f-42e3-8a89-969a89ebaa59";
const MISSING_ID = "f02b8620-b4e5-4c37-863c-f655bbb6a892";
const ERROR_ID = "1b9a31b4-6817-48c8-b687-a22bb35fbafc";
const LOADING_ID = "7076b879-ef55-4824-975d-5a57402f73b5";

const meta: Meta<typeof BoardCard> = {
  title: "Organisms/Board/BoardCard",
  component: BoardCard,
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

export const Default: StoryObj<typeof BoardCard> = {
  args: {
    board: {
      id: SUCCESS_ID,
      name: "Board #1",
      description:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
    },
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const Errored: StoryObj<typeof BoardCard> = {
  args: {
    board: {
      id: ERROR_ID,
      name: "Lorem ipsum",
      description:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
    },
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};

export const Loading: StoryObj<typeof BoardCard> = {
  args: {
    board: {
      id: LOADING_ID,
      name: "Lorem ipsum",
      description:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
    },
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {Story()}
      </SWRConfig>
    ),
  ],
};
