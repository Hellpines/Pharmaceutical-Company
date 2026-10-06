import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TestsListPage } from './pages/TestsListPage';
import { TestDetailsPage } from './pages/TestDetailsPage';
import { useAuth } from './context/AuthContext';
import { auth } from './services/firebase';
import { DocumentationPage } from './pages/DocumentationPage';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-primary">
      {user && <Header />}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
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

const documentationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documentation',
  beforeLoad: checkAuth,
  component: DocumentationPage,
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
  documentationRoute,
  testDetailsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}