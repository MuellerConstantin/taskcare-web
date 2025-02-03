import Sidebar from "./Sidebar";
 
const meta = {
  title: "Organisms/TMC/Sidebar",
  component: (args) => (
    <div className="max-w-[20rem]">
      <Sidebar {...args} />
    </div>
  ),
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

export const Default = {
  args: {},
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/tmc/boards",
      },
    },    
  }
}
