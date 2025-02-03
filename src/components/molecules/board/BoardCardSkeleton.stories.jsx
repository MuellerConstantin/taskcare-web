import BoardCardSkeleton from "./BoardCardSkeleton";
 
const meta = {
  title: "Molecules/BoardCardSkeleton",
  component: BoardCardSkeleton,
};

export default meta;

export const Default = {
  args: {
    error: false,
  }
}

export const Errored = {
  args: {
    error: true,
  }
}
