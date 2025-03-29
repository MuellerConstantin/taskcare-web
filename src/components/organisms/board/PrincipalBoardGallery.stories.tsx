import React from "react";
import { v4 as uuid } from "uuid";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse, PathParams } from "msw";
import { PrincipalBoardGallery } from "./PrincipalBoardGallery";

const meta: Meta<typeof PrincipalBoardGallery> = {
  title: "Organisms/Board/PrincipalBoardGallery",
  component: PrincipalBoardGallery,
};

export default meta;

const mockBoards = Array.from(Array(75).keys()).map((index) => ({
  id: uuid(),
  name: `Board #${index + 1}`,
  description:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
}));

export const Default: StoryObj<typeof PrincipalBoardGallery> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me/boards", async ({ request }) => {
          const url = new URL(request.url);
          const page = url.searchParams.get("page")
            ? Number(url.searchParams.get("page"))
            : 0;
          const perPage = url.searchParams.get("perPage")
            ? Number(url.searchParams.get("perPage"))
            : 25;

          const totalElements = mockBoards.length;
          const totalPages = Math.ceil(totalElements / perPage);

          if (page >= totalPages) {
            return HttpResponse.json({
              info: {
                page,
                perPage,
                totalPages,
                totalElements,
              },
              content: [],
            });
          }

          return HttpResponse.json({
            info: {
              page,
              perPage,
              totalPages,
              totalElements,
            },
            content: mockBoards.slice(page * perPage, page * perPage + perPage),
          });
        }),
        http.post<
          PathParams,
          { name: string; description: string },
          HttpResponse
        >("/api/proxy/boards", async ({ request }) => {
          const board = await request.json();

          mockBoards.push({
            id: uuid(),
            name: board.name,
            description: board.description,
          });

          return new HttpResponse(null, { status: 201 });
        }),
      ],
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

export const Errored: StoryObj<typeof PrincipalBoardGallery> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me/boards", async () => {
          return new HttpResponse(null, {
            status: 500,
          });
        }),
      ],
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

export const Loading: StoryObj<typeof PrincipalBoardGallery> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me/boards", async () => {
          return new Promise(() => {});
        }),
      ],
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
