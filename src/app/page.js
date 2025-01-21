"use client";

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/molecules/Footer";

export default function Home() {
  return (
    <div className="h-full min-h-screen flex flex-col">
      <header>
        <Navbar currentPath="/" />
      </header>
      <main className="grow flex flex-col text-gray-800">

      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
