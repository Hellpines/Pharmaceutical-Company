import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { TestsListPage } from './pages/TestsListPage/TestsListPage';
import { TestDetailsPage } from './pages/TestDetailsPage/TestDetailsPage';

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: DashboardPage,
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: RegisterPage,
});

const testsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/tests',
    component: TestsListPage,
});

const testDetailsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/tests/$testId',
    component: TestDetailsPage,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    testsRoute,
    testDetailsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}