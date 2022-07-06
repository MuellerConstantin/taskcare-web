import React from "react";
import BoardHeader from "./BoardHeader";

export default {
  title: "Molecules/BoardHeader",
  component: BoardHeader,
};

function Template(args) {
  return <BoardHeader {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  board: {
    id: "1862b7eb-6e73-4571-88a8-9f86eed944d1",
    name: "Housebuilding",
    description:
      "Contains the planning and processing of all important steps for building a house.",
    createdBy: "maxi123",
    createdAt: "2022-07-04T07:14:46.569141+02:00",
  },
};
