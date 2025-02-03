import { http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import Navbar from "./Navbar";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as StoreProvider } from "react-redux";
import { rootReducer } from "@/store";
 
const meta = {
  title: "Organisms/Navbar",
  component: (args) => (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <StoreProvider store={configureStore({ reducer: rootReducer })}>
        <Navbar {...args} />
      </StoreProvider>
    </SWRConfig>
  ),
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

export const Default = {
  args: {}
}

export const Authenticated = {
  args: {},
  render: (args) => (
    <StoreProvider store={configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          isAuthenticated: true,
          principalName: "john.doe"
        }
      },
    })}>
      <Navbar {...args} />
    </StoreProvider>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get(`${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/user/me`, async () => {
          const buffer = await fetch("https://placehold.co/600x400/png").then(
            (response) => response.arrayBuffer()
          );

          return HttpResponse.json({
            id: "55b8dec2-a09f-42e3-8a89-969a89ebaa59",
            username: "john.doe",
            displayName: "John Doe",
            role: "USER",
            identityProvider: "LOCAL",
          });
        }),
        http.get(`${process.env.NEXT_PUBLIC_TASKCARE_API_URL}/user/me/profile-image`, async () => {
          return new HttpResponse(null, {
            status: 404,
          })
        })
      ],
    },
  },
}
