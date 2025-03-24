import React from "react";
import { SWRConfig } from "swr";
import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { PrincipalAvatar } from "./PrincipalAvatar";

const meta: Meta<typeof PrincipalAvatar> = {
  title: "Organisms/User/PrincipalAvatar",
  parameters: {
    layout: "centered",
  },
  component: PrincipalAvatar,
};

export default meta;

export const Default: StoryObj<typeof PrincipalAvatar> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me", async () => {
          return HttpResponse.json({
            id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get("/api/proxy/user/me/profile-image", async () => {
          const buffer = await fetch(
            "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
          ).then((response) => response.arrayBuffer());

          return HttpResponse.arrayBuffer(buffer);
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

export const NotFound: StoryObj<typeof PrincipalAvatar> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me", async () => {
          return HttpResponse.json({
            id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get("/api/proxy/user/me/profile-image", async () => {
          return new HttpResponse(null, {
            status: 404,
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

export const Errored: StoryObj<typeof PrincipalAvatar> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me", async () => {
          return HttpResponse.json({
            id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get("/api/proxy/user/me/profile-image", async () => {
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

export const Loading: StoryObj<typeof PrincipalAvatar> = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/user/me", async () => {
          return HttpResponse.json({
            id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get("/api/proxy/user/me/profile-image", async () => {
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
