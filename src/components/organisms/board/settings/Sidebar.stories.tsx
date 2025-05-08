import React from "react";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { StoreMockProvider } from "../../../../../tests/mockStore";
import { Sidebar } from "./Sidebar";

const USER_SUCCESS_ID = "24790c42-8d90-4667-8700-ec037fd1864b";

const MEMBER_SUCCESS_ID = "9e0cf22e-3928-486c-9e09-0db2e7884a02";

const BOARD_SUCCESS_ID = "55b8dec2-a09f-42e3-8a89-969a89ebaa59";
const BOARD_MISSING_ID = "f02b8620-b4e5-4c37-863c-f655bbb6a892";
const BOARD_ERROR_ID = "1b9a31b4-6817-48c8-b687-a22bb35fbafc";
const BOARD_LOADING_ID = "7076b879-ef55-4824-975d-5a57402f73b5";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Board/Settings/Sidebar",
  component: Sidebar,
};

export default meta;

export const Default: StoryObj<typeof Sidebar> = {
  args: {},
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: `/boards/${BOARD_SUCCESS_ID}`,
        segments: [["boardId", BOARD_SUCCESS_ID]],
      },
    },
    msw: {
      handlers: [
        http.get("/api/proxy/user/me", async () => {
          return HttpResponse.json({
            id: USER_SUCCESS_ID,
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get("/api/proxy/boards/:boardId", async ({ params }) => {
          switch (params.boardId) {
            case BOARD_SUCCESS_ID: {
              return HttpResponse.json({
                id: BOARD_SUCCESS_ID,
                name: "Kanban #1",
                description:
                  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
              });
            }
            case BOARD_MISSING_ID:
              return new HttpResponse(null, {
                status: 404,
              });
            case BOARD_ERROR_ID:
              return new HttpResponse(null, {
                status: 500,
              });
            case BOARD_LOADING_ID:
              return new Promise(() => {});
          }
        }),
        http.get("/api/proxy/boards/:boardId/members", async ({ params }) => {
          switch (params.boardId) {
            case BOARD_SUCCESS_ID: {
              return HttpResponse.json({
                content: [
                  {
                    id: MEMBER_SUCCESS_ID,
                    userId: USER_SUCCESS_ID,
                    role: "ADMINISTRATOR",
                  },
                ],
                info: {
                  page: 0,
                  perPage: 25,
                  totalPages: 1,
                  totalElements: 0,
                },
              });
            }
            default:
              return new HttpResponse(null, {
                status: 404,
              });
          }
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <StoreMockProvider
          preloadedState={{
            auth: {
              isAuthenticated: true,
              accessToken: "accessToken",
              refreshToken: "refreshToken",
              principalName: "john.doe",
            },
          }}
        >
          {Story()}
        </StoreMockProvider>
      </SWRConfig>
    ),
  ],
};

export const MissingPermissions: StoryObj<typeof Sidebar> = {
  args: {},
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: `/boards/${BOARD_SUCCESS_ID}`,
        segments: [["boardId", BOARD_SUCCESS_ID]],
      },
    },
    msw: {
      handlers: [
        http.get("/api/proxy/user/me", async () => {
          return HttpResponse.json({
            id: USER_SUCCESS_ID,
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get("/api/proxy/boards/:boardId", async ({ params }) => {
          switch (params.boardId) {
            case BOARD_SUCCESS_ID: {
              return HttpResponse.json({
                id: BOARD_SUCCESS_ID,
                name: "Kanban #1",
                description:
                  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
              });
            }
            case BOARD_MISSING_ID:
              return new HttpResponse(null, {
                status: 404,
              });
            case BOARD_ERROR_ID:
              return new HttpResponse(null, {
                status: 500,
              });
            case BOARD_LOADING_ID:
              return new Promise(() => {});
          }
        }),
        http.get("/api/proxy/boards/:boardId/members", async ({ params }) => {
          switch (params.boardId) {
            case BOARD_SUCCESS_ID: {
              return HttpResponse.json({
                content: [
                  {
                    id: MEMBER_SUCCESS_ID,
                    userId: USER_SUCCESS_ID,
                    role: "MAINTAINER",
                  },
                ],
                info: {
                  page: 0,
                  perPage: 25,
                  totalPages: 1,
                  totalElements: 0,
                },
              });
            }
            default:
              return new HttpResponse(null, {
                status: 404,
              });
          }
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <StoreMockProvider
          preloadedState={{
            auth: {
              isAuthenticated: true,
              accessToken: "accessToken",
              refreshToken: "refreshToken",
              principalName: "john.doe",
            },
          }}
        >
          {Story()}
        </StoreMockProvider>
      </SWRConfig>
    ),
  ],
};
