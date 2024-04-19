import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KindeProvider
      isDangerouslyUseLocalStorage={process.env.NODE_ENV === "development"}
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_DOMAIN}
      logoutUri={window.location.origin}
      redirectUri={window.location.origin}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </KindeProvider>
  </React.StrictMode>,
)
