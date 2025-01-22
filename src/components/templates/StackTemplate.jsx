"use client";

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/molecules/Footer";

export default function StackTemplate({ children }) {
  return (
    <div className="h-full min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="grow flex flex-col">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
