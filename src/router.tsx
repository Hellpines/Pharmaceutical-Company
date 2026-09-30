import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { TestsListPage } from './pages/TestsListPage/TestsListPage';
import { TestDetailsPage } from './pages/TestDetailsPage/TestDetailsPage';
import { useAuth } from './context/AuthContext';
import { auth } from './services/firebase';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {user && <Header />}
      <main className="p-6">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
};

const rootRoute = createRootRoute({
  component: Layout,
});

const checkAuth = () => {
  if (!auth.currentUser) {
    throw redirect({ to: '/login' });
  }
};

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: checkAuth,
  component: DashboardPage,
});

const testsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tests',
  beforeLoad: checkAuth,
  component: TestsListPage,
});

const testDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tests/$testId',
  beforeLoad: checkAuth,
  component: TestDetailsPage,
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