import React from "react";
import KanbanViewSkeleton from "./KanbanViewSkeleton";

export default {
  title: "Molecules/KanbanViewSkeleton",
  component: KanbanViewSkeleton,
};

function Template(args) {
  return <KanbanViewSkeleton {...args} />;
}

export const Default = Template.bind({});

Default.args = {};

export const Errored = Template.bind({});

Errored.args = { error: "An unexpected error occurred" };
