import React from "react";
import BoardThumbnailSkeleton from "./BoardThumbnailSkeleton";

export default {
  title: "Molecules/BoardThumbnailSkeleton",
  component: BoardThumbnailSkeleton,
};

function Template(args) {
  return <BoardThumbnailSkeleton {...args} />;
}

export const Default = Template.bind({});

Default.args = {};

export const Errored = Template.bind({});

Errored.args = { error: "An unexpected error occurred" };
