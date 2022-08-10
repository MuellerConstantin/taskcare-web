import React from "react";
import { MemoryRouter } from "react-router-dom";
import MemberThumbnail from "./MemberThumbnail";

export default {
  title: "Molecules/MemberThumbnail",
  component: MemberThumbnail,
};

function Template(args) {
  return (
    <MemoryRouter>
      <MemberThumbnail {...args} />
    </MemoryRouter>
  );
}

export const Default = Template.bind({});

Default.args = {
  member: {
    username: "maxi123",
    role: "ADMINISTRATOR",
  },
};
