import Navbar from "../organisms/Navbar";

export default function StackNavigationTemplate({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="grow">{children}</main>
      <footer />
    </div>
  );
}
