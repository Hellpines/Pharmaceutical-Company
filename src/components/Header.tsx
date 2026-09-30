import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { 
  Home, 
  LayoutGrid, 
  Workflow, 
  FileText, 
  Sun, 
  Bell, 
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
    <header className="relative flex h-16 items-center justify-end border-b border-slate-200 bg-white px-8 shadow-sm">
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[42px] font-medium text-slate-600">
        <Link
          to="/"
          className="flex items-center gap-[6px] text-[#56627D] hover:text-[#3874FF] transition-colors [&.active]:text-[#3874FF] font-semibold"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/tests"
          className="flex items-center gap-[6px] text-[#56627D] hover:text-[#3874FF] transition-colors [&.active]:text-[#3874FF] font-semibold"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Tables</span>
        </Link>

        <a
          href="#process"
          className="flex items-center gap-[6px] text-[#56627D] hover:text-[#3874FF] [&.active]:text-[#3874FF] transition-colors"
        >
          <Workflow className="h-4 w-4" />
          <span>Process</span>
        </a>

        <a
          href="#docs"
          className="flex items-center gap-[6px] text-[#56627D] hover:text-[#3874FF] [&.active]:text-[#3874FF] transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Documentation</span>
        </a>
      </nav>

      <div className="flex items-center gap-[12px]">
        <button 
          title="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors"
        >
          <Sun className="h-4 w-4" />
        </button>

        <button 
          title="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button 
          title="Apps"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Grip className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="flex items-center justify-center h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-600">
            <User className="h-4 w-4" />
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};