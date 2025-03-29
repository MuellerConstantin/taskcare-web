import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { http, HttpResponse } from "msw";
import { DialogTrigger } from "react-aria-components";
import { AddBoardDialog } from "@/components/organisms/board/AddBoardDialog";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/atoms/Modal";

const meta: Meta<typeof AddBoardDialog> = {
  title: "Organisms/Board/AddBoardDialog",
  component: AddBoardDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default: StoryObj<typeof AddBoardDialog> = {
  args: {},
  render: (args: any) => (
    <DialogTrigger>
      <Button variant="secondary">Show...</Button>
      <Modal>
        <AddBoardDialog {...args} />
      </Modal>
    </DialogTrigger>
  ),
  parameters: {
    msw: {
      handlers: [
        http.post("/api/proxy/boards", async () => {
          return new HttpResponse(null, { status: 201 });
        }),
      ],
    },
  },
};

export const Errored: StoryObj<typeof AddBoardDialog> = {
  args: {},
  render: (args: any) => (
    <DialogTrigger>
      <Button variant="secondary">Show...</Button>
      <Modal>
        <AddBoardDialog {...args} />
      </Modal>
    </DialogTrigger>
  ),
  parameters: {
    msw: {
      handlers: [
        http.post("/api/proxy/boards", async () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

export const Loading: StoryObj<typeof AddBoardDialog> = {
  args: {},
  render: (args: any) => (
    <DialogTrigger>
      <Button variant="secondary">Show...</Button>
      <Modal>
        <AddBoardDialog {...args} />
      </Modal>
    </DialogTrigger>
  ),
  parameters: {
    msw: {
      handlers: [
        http.post("/api/proxy/boards", async () => {
          return new Promise(() => {});
        }),
      ],
    },
  },
};
