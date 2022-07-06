import React from "react";
import BoardHeaderSkeleton from "./BoardHeaderSkeleton";

export default {
  title: "Molecules/BoardHeaderSkeleton",
  component: BoardHeaderSkeleton,
};

function Template(args) {
  return <BoardHeaderSkeleton {...args} />;
}

export const Default = Template.bind({});

Default.args = {};

export const Errored = Template.bind({});

Errored.args = {
  error: "An unexpected error occurred",
};
