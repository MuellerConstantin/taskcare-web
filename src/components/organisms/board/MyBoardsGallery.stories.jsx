import { SWRConfig } from "swr";
import { http, HttpResponse } from "msw";
import MyBoardsGallery from "./MyBoardsGallery";

const meta = {
  title: "Organisms/Board/MyBoardsGallery",
  component: (args) => (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MyBoardsGallery {...args} />
    </SWRConfig>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get(
          `${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/boards/:boardId/logo-image`,
          async () => {
            const buffer = await fetch("https://placehold.co/600x400/png").then(
              (response) => response.arrayBuffer(),
            );

            return HttpResponse.arrayBuffer(buffer, {
              headers: {
                "Content-Type": "image/png",
              },
            });
          },
        ),
        http.get(
          `${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/user/me/boards`,
          async () => {
            return new HttpResponse(
              JSON.stringify({
                info: {
                  totalElements: 2,
                  page: 0,
                  perPage: 25,
                  totalPages: 1,
                },
                content: [
                  {
                    id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
                    name: "Board 1",
                    description:
                      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
                  },
                  {
                    id: "96039212-c174-496c-b338-40bd26373b1e",
                    name: "Board 2",
                    description:
                      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
                  },
                  {
                    id: "3c7eea04-225c-41b3-9ff2-30be7cf12e3f",
                    name: "Board 3",
                    description:
                      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
                  },
                ],
              }),
              {
                status: 200,
              },
            );
          },
        ),
      ],
    },
  },
};

export default meta;

export const Success = {
  args: {},
};

export const Error = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get(
          `${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/user/me/boards`,
          async ({ params }) => {
            return new HttpResponse(null, {
              status: 500,
            });
          },
        ),
      ],
    },
  },
};
