import React from "react";
import { MemoryRouter } from "react-router-dom";
import BoardThumbnail from "./BoardThumbnail";

export default {
  title: "Molecules/BoardThumbnail",
  component: BoardThumbnail,
};

function Template(args) {
  return (
    <MemoryRouter>
      <BoardThumbnail {...args} />
    </MemoryRouter>
  );
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
