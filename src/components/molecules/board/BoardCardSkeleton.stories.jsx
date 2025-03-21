import BoardCardSkeleton from "./BoardCardSkeleton";

const meta = {
  title: "Molecules/Board/BoardCardSkeleton",
  component: BoardCardSkeleton,
};

export default meta;

export const Default = {
  args: {
    error: false,
  },
};

export const Error = {
  args: {
    error: true,
  },
};
