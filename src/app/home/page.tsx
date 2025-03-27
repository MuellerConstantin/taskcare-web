import { PrincipalBoardGallery } from "@/components/organisms/board/PrincipalBoardGallery";

export default function Home() {
  return (
    <div className="flex grow flex-col">
      <div className="mx-auto flex w-full max-w-screen-2xl grow flex-col space-y-4 p-4">
        <PrincipalBoardGallery />
      </div>
    </div>
  );
}
