import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { Builder } from './pages/Builder';
import { MyForms } from './pages/MyForms';
import { ViewForm } from './pages/ViewForm';

// 1. Create a Root Route (Layout wrapper)
export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet /> {/* This renders the child pages */}
      {/* <TanStackRouterDevtools /> // Uncomment if you want debug tools */}
    </>
  ),
});

// 2. Define the Routes

// Index Route: "/" -> Builder
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Builder,
});

// Forms Route: "/forms" -> My Forms List
export const myFormsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forms',
  component: MyForms,
});

// View Route: "/form/$formId" -> View Specific Form
export const viewFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/form/$formId', // $ denotes a dynamic param
  component: ViewForm,
});

// 3. Build the Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  myFormsRoute,
  viewFormRoute,
]);

// 4. Create the Router
export const router = createRouter({ routeTree });

// 5. Register Types (Crucial for Type Safety)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}