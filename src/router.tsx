import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { TestsListPage } from './pages/TestsListPage/TestsListPage';
import { TestDetailsPage } from './pages/TestDetailsPage/TestDetailsPage';
import { useAuth } from './context/AuthContext';
import { auth } from './services/firebase';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {user && (
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-blue-600">PharmaDash</span>
            <nav className="flex gap-4 font-medium">
              <Link to="/" className="hover:text-blue-600 [&.active]:text-blue-600">
                Dashboard
              </Link>
              <Link to="/tests" className="hover:text-blue-600 [&.active]:text-blue-600">
                Tests
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </header>
      )}
      <main>
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