import React from "react";
import KanbanView from "./KanbanView";

export default {
  title: "Molecules/KanbanView",
  component: KanbanView,
};

function Template(args) {
  return <KanbanView {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  tasks: [
    {
      id: "e3eb92b8-1f35-4874-aaac-22d0c0f8f62f",
      name: "Some task",
      status: "OPENED",
      createdAt: "2022-06-27T15:18:16.706776+02:00",
      createdBy: "maxi123",
    },
  ],
};
