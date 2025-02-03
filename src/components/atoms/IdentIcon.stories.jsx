import IdentIcon from "./IdentIcon";
 
const meta = {
  title: "Atoms/IdentIcon",
  component: IdentIcon
};

export default meta;

export function Default() {
  return <IdentIcon value="test" />;
}

export function Rounded() {
  return <IdentIcon value="test" className="rounded-full" />;
}
