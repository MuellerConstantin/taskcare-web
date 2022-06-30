import Navbar from "../organisms/Navbar";

export default function StackTemplate({ children }) {
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
