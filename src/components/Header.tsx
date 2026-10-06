import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Home,
  LayoutGrid,
  FileText,
  Sun,
  Moon,
  MessageCircle,
  Grip,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate({ to: '/login' });
  };

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="relative flex h-16 items-center justify-end border-b border-border-primary bg-white px-8 dark:bg-brand-dark dark:text-brand-secondary">
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[42px] font-medium text-brand-secondary">
        <Link
          to="/"
          className="flex items-center gap-1.5 hover:text-brand-primary transition-colors [&.active]:text-brand-primary font-semibold"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/tests"
          className="flex items-center gap-1.5 hover:text-brand-primary transition-colors [&.active]:text-brand-primary font-semibold"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Tables</span>
        </Link>

        <Link
          to="/documentation"
          className="flex items-center gap-[6px] hover:text-brand-primary [&.active]:text-brand-primary transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Documentation</span>
        </Link>
      </nav>

      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          title="Toggle theme"
          onClick={() => setIsDarkTheme((prev) => !prev)}
          className="flex p-2 items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors dark:bg-brand-dark dark:text-orange-300"
        >
          {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button 
          title="Chat"
          className="flex p-2 items-center justify-center rounded-full hover:bg-background-primary text-brand-secondary transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
        </button>

        <button 
          title="Apps"
          className="flex p-2 items-center justify-center rounded-full hover:bg-background-primary text-brand-secondary transition-colors"
        >
          <Grip className="h-5 w-5" />
        </button>

        <div ref={menuRef} className="relative flex items-center gap-3 pl-2 text-brand-secondary">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="User menu"
            className="flex items-center justify-center h-8 w-8 overflow-hidden rounded-full border border-border-primary bg-background-primary text-brand-dark transition-colors hover:border-brand-primary"
          >
            <span className="text-sm font-semibold">{userInitial}</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-xl border border-border-primary bg-white shadow-[0_12px_40px_rgba(20,24,40,0.08)]">
              <div className="flex items-center gap-3 border-b border-border-primary px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border-primary bg-background-primary text-sm font-semibold text-brand-dark">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-brand-secondary">
                    Account
                  </p>
                  <p className="truncate text-sm font-medium text-brand-dark">
                    User
                  </p>
                </div>
              </div>

              <div className="px-4 py-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-brand-secondary">
                  Email
                </p>
                <p className="mt-1 break-all text-sm text-brand-secondary">
                  {user?.email || 'No email available'}
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border-primary bg-background-primary px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};