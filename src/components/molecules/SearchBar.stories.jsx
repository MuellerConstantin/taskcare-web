import SearchBar from "./SearchBar";
 
const meta = {
  title: "Molecules/SearchBar",
  component: SearchBar
};

export default meta;

export const Default = {
  args: {
    properties: new Map([["id", "ID"], ["name", "Name"], ["description", "Description"]]),
  }
}
