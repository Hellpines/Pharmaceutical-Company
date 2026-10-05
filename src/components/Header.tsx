import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { 
  Home, 
  LayoutGrid, 
  FileText, 
  Sun, 
  MessageCircle, 
  Grip,
  LogOut, 
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="relative flex h-16 items-center justify-end border-b border-border-primary bg-white px-8">
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
          title="Toggle theme"
          className="flex p-2 items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors"
        >
          <Sun className="h-5 w-5" />
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

        <div className="flex items-center gap-3 pl-2 text-brand-secondary">
          <div className="flex items-center justify-center h-8 w-8 overflow-hidden rounded-full border border-border-primary bg-background-primary">
            <User className="h-5 w-5" />
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex p-2 items-center justify-center rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};