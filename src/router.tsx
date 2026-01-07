import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { Builder } from './pages/Builder';
import { MyForms } from './pages/MyForms';
// REMOVED: import { ViewForm } from './pages/ViewForm'; 

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 1. Builder Route (Home)
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Builder,
});

// 2. My Forms Dashboard
export const myFormsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms',
  component: MyForms,
});

// REMOVED: viewFormRoute

const routeTree = rootRoute.addChildren([
  indexRoute,
  myFormsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}