"use client";

import StackTemplate from "@/components/templates/StackTemplate";
import Sidebar from "@/components/organisms/tmc/Sidebar";

export default function TmcBoards() {
  return (
    <StackTemplate>
      <div className="grow flex flex-col flex">
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 grow w-full max-w-screen-2xl mx-auto">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Sidebar />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5">
            
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
