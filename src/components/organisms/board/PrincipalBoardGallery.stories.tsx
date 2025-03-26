import React from "react";
import { v4 as uuid } from "uuid";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { PrincipalBoardGallery } from "./PrincipalBoardGallery";

const meta: Meta<typeof PrincipalBoardGallery> = {
  title: "Organisms/Board/PrincipalBoardGallery",
  component: PrincipalBoardGallery,
};

export default meta;

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

          const totalElements = 75;
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

          const currenPageElements = Math.min(
            perPage,
            totalElements - page * perPage,
          );

          return HttpResponse.json({
            info: {
              page,
              perPage,
              totalPages,
              totalElements,
            },
            content: Array.from(Array(currenPageElements).keys()).map(
              (index) => ({
                id: uuid(),
                name: `Board #${page * perPage + index + 1}`,
                description:
                  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
              }),
            ),
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
