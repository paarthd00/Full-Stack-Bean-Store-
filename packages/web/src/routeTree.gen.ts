/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UsersImport } from './routes/users'

// Create Virtual Routes

const ProfileLazyImport = createFileRoute('/profile')()
const FaqLazyImport = createFileRoute('/faq')()
const CartLazyImport = createFileRoute('/cart')()
const AddCoffeeLazyImport = createFileRoute('/add-coffee')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const ProfileLazyRoute = ProfileLazyImport.update({
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/profile.lazy').then((d) => d.Route))

const FaqLazyRoute = FaqLazyImport.update({
  path: '/faq',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/faq.lazy').then((d) => d.Route))

const CartLazyRoute = CartLazyImport.update({
  path: '/cart',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/cart.lazy').then((d) => d.Route))

const AddCoffeeLazyRoute = AddCoffeeLazyImport.update({
  path: '/add-coffee',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/add-coffee.lazy').then((d) => d.Route))

const UsersRoute = UsersImport.update({
  path: '/users',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/users': {
      preLoaderRoute: typeof UsersImport
      parentRoute: typeof rootRoute
    }
    '/add-coffee': {
      preLoaderRoute: typeof AddCoffeeLazyImport
      parentRoute: typeof rootRoute
    }
    '/cart': {
      preLoaderRoute: typeof CartLazyImport
      parentRoute: typeof rootRoute
    }
    '/faq': {
      preLoaderRoute: typeof FaqLazyImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      preLoaderRoute: typeof ProfileLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  UsersRoute,
  AddCoffeeLazyRoute,
  CartLazyRoute,
  FaqLazyRoute,
  ProfileLazyRoute,
])

/* prettier-ignore-end */
