import { SWRConfig } from "swr";
import { http, HttpResponse } from "msw";
import BoardCard from "./BoardCard";
 
const meta = {
  title: "Molecules/Board/BoardCard",
  component: (args) => (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <BoardCard {...args} />
    </SWRConfig>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get(`${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/boards/:boardId/logo-image`, async () => {
          const buffer = await fetch("https://placehold.co/600x400/png").then(
            (response) => response.arrayBuffer()
          );

          return HttpResponse.arrayBuffer(buffer, {
            headers: {
              "Content-Type": 'image/png',
            },
          });
        }),
      ],
    },
  },
};

export default meta;

export const ImageSuccess = {
  args: {
    board: {
      id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
      name: "Board 1",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
    }
  },
}

export const ImageMissing = {
  args: {
    board: {
      id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
      name: "Board 1",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
    }
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/boards/:boardId/logo-image`, async () => {
          return new HttpResponse(null, {
            status: 404
          })
        }),
      ],
    },
  }
}

export const ImageError = {
  args: {
    board: {
      id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
      name: "Board 1",
      description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
    }
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/boards/:boardId/logo-image`, async () => {
          return new HttpResponse(null, {
            status: 500
          })
        }),
      ],
    },
  }
}

