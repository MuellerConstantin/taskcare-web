import type { Meta } from "@storybook/react";
import React from "react";
import { Form } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { TextArea } from "@/components/atoms/TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Atoms/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Description",
  },
};

export default meta;

export const Default = (args: any) => <TextArea {...args} />;

export const WithDescription = (args: any) => <TextArea {...args} />;

WithDescription.args = {
  description: "Lorem ipsum dolor sit amet",
};

export const Errored = (args: any) => <TextArea {...args} />;

Errored.args = {
  isInvalid: true,
  errorMessage: "Error message",
};

export const Validation = (args: any) => (
  <Form className="flex flex-col items-start gap-2">
    <TextArea {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
