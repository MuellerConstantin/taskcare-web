import { http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import BoardLogo from "./BoardLogo";

const SUCCESS_ID = "55b8dec2-a09f-42e3-8a89-969a89ebaa59";
const MISSING_ID = "f02b8620-b4e5-4c37-863c-f655bbb6a892";
const ERROR_ID = "1b9a31b4-6817-48c8-b687-a22bb35fbafc";

const meta = {
  title: "Molecules/Board/BoardLogo",
  component: (args) => (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <BoardLogo {...args} />
    </SWRConfig>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get(
          "/api/proxy/boards/:boardId/logo-image",
          async ({ params }) => {
            switch (params.boardId) {
              case SUCCESS_ID: {
                const buffer = await fetch(
                  "https://placehold.co/600x400/png",
                ).then((response) => response.arrayBuffer());

                console.log("works");

                return HttpResponse.arrayBuffer(buffer, {
                  headers: {
                    "Content-Type": "image/png",
                  },
                });
              }
              case MISSING_ID:
                return new HttpResponse(null, {
                  status: 404,
                });
              case ERROR_ID:
                return new HttpResponse(null, {
                  status: 500,
                });
            }
          },
        ),
      ],
    },
  },
};

export default meta;

export const Success = {
  args: {
    boardId: SUCCESS_ID,
  },
};

export const Missing = {
  args: {
    boardId: MISSING_ID,
  },
};

export const Error = {
  args: {
    boardId: ERROR_ID,
  },
};
