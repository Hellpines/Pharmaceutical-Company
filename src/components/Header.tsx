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
  Send,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type ChatMessage = {
  id: string;
  text: string;
  isOwn: boolean;
};

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', text: 'Connected to echo chat. Say hello!', isOwn: false },
  ]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
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
    let isMounted = true;
    let reconnectTimer: number | undefined;

    const connectSocket = () => {
      const socket = new WebSocket('wss://ws.ifelse.io');
      socketRef.current = socket;

      socket.onopen = () => {
        if (!isMounted) {
          socket.close();
          return;
        }

        setIsSocketConnected(true);
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        const nextMessage = typeof event.data === 'string' ? event.data.trim() : '';

        if (!nextMessage) {
          return;
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `${Date.now()}-${Math.random()}`,
            text: nextMessage,
            isOwn: false,
          },
        ]);
      };

      socket.onerror = () => {
        if (!isMounted) {
          return;
        }

        setIsSocketConnected(false);
      };

      socket.onclose = () => {
        if (!isMounted) {
          return;
        }

        setIsSocketConnected(false);
        reconnectTimer = window.setTimeout(() => {
          connectSocket();
        }, 2000);
      };
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }

      if (chatRef.current && !chatRef.current.contains(target)) {
        setIsChatOpen(false);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSendMessage = () => {
    const trimmedMessage = draftMessage.trim();
    const socket = socketRef.current;

    if (!trimmedMessage || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(trimmedMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${Date.now()}-${Math.random()}`,
        text: trimmedMessage,
        isOwn: true,
      },
    ]);
    setDraftMessage('');
  };

  return (
    <header className="border-b border-border-primary bg-white px-4 py-3 dark:bg-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="relative mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <nav className="order-2 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-brand-secondary sm:gap-10 lg:order-1 lg:col-start-2 lg:justify-self-center lg:text-base">
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

        <div className="order-1 flex items-center justify-between gap-3 lg:order-3 lg:col-start-3 lg:ml-auto lg:justify-self-end">
          <button
            type="button"
            title="Toggle theme"
            onClick={() => setIsDarkTheme((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors dark:bg-slate-800 dark:text-orange-300"
          >
            {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            title="Chat"
            onClick={() => setIsChatOpen((prevValue) => !prevValue)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-secondary transition-colors hover:bg-background-primary"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <button
            title="Apps"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-background-primary text-brand-secondary transition-colors"
          >
            <Grip className="h-5 w-5" />
          </button>

          <div ref={menuRef} className="relative flex items-center gap-3 pl-2 text-brand-secondary">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              title="User menu"
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border-primary bg-background-primary text-brand-dark transition-colors hover:border-brand-primary"
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
      </div>

      {isChatOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-5 right-5 z-50 w-[320px] overflow-hidden rounded-2xl border border-border-primary bg-white shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between border-b border-border-primary bg-background-primary px-4 py-3 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isSocketConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <p className="text-sm font-semibold text-brand-dark dark:text-slate-100">Echo chat</p>
            </div>

            <button
              type="button"
              title="Close chat"
              onClick={() => setIsChatOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-brand-secondary transition-colors hover:bg-white dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-72 flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto bg-background-primary/40 px-3 py-3 dark:bg-slate-800/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.isOwn
                        ? 'bg-brand-primary text-white'
                        : 'bg-white text-brand-dark shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 border-t border-border-primary bg-white p-3 dark:bg-slate-900"
            >
              <input
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-border-primary bg-background-primary px-3 py-2 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-secondary focus:border-brand-primary dark:bg-slate-800 dark:text-slate-100"
              />

              <button
                type="submit"
                disabled={!draftMessage.trim() || !isSocketConnected}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};