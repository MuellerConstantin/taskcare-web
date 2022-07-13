import React from "react";
import MemberThumbnailSkeleton from "./MemberThumbnailSkeleton";

export default {
  title: "Molecules/MemberThumbnailSkeleton",
  component: MemberThumbnailSkeleton,
};

function Template(args) {
  return <MemberThumbnailSkeleton {...args} />;
}

export const Default = Template.bind({});

Default.args = {};

export const Errored = Template.bind({});

Errored.args = { error: "An unexpected error occurred" };
