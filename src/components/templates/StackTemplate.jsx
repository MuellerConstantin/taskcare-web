"use client";

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/molecules/Footer";

export default function StackTemplate({ children }) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header>
        <Navbar />
      </header>
      <main className="flex grow flex-col">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
