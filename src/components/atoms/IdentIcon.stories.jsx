import IdentIcon from "./IdentIcon";

const meta = {
  title: "Atoms/IdentIcon",
  component: (args) => (
    <div className="h-32 w-32">
      <IdentIcon {...args} />
    </div>
  ),
};

export default meta;

export const Default = {
  args: {
    value: "55b8dec2",
  },
};

export const Rounded = {
  args: {
    value: "55b8dec2",
    className: "rounded-full",
  },
};
