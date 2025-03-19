import { http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import UserAvatar from "./UserAvatar";

const SUCCESS_ID = "55b8dec2-a09f-42e3-8a89-969a89ebaa59";
const MISSING_ID = "f02b8620-b4e5-4c37-863c-f655bbb6a892";
const ERROR_ID = "1b9a31b4-6817-48c8-b687-a22bb35fbafc";
 
const meta = {
  title: "Molecules/User/UserAvatar",
  component: (args) => (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <UserAvatar {...args} />
    </SWRConfig>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get("/api/proxy/users/:userId/profile-image", async ({params}) => {
          switch(params.userId) {
            case SUCCESS_ID: {
              const buffer = await fetch("https://placehold.co/600x400/png").then(
                (response) => response.arrayBuffer()
              );

              console.log("works")

              return HttpResponse.arrayBuffer(buffer, {
                headers: {
                  "Content-Type": "image/png",
                },
              });
            }
            case MISSING_ID:
              return new HttpResponse(null, {
                status: 404
              })
            case ERROR_ID:
              return new HttpResponse(null, {
              status: 500
            })
          }
        }),
      ],
    },
  },
};

export default meta;

export const Success = {
  args: {
    username: "John Doe",
    userId: SUCCESS_ID,
  },
}

export const Missing = {
  args: {
    username: "John Doe",
    userId: MISSING_ID,
  },
}

export const Error = {
  args: {
    username: "John Doe",
    userId: ERROR_ID,
  },
}
