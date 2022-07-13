import React from "react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

export default {
  title: "Molecules/Footer",
  component: Footer,
};

function Template(args) {
  return (
    <MemoryRouter>
      <Footer {...args} />
    </MemoryRouter>
  );
}

export const Default = Template.bind({});

Default.args = {};
