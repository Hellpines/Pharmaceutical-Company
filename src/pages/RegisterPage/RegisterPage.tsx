import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate({ to: '/' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          setError('A user with this email already exists.');
        } else if (err.message.includes('auth/invalid-email')) {
          setError('Invalid email format.');
        } else {
          setError('Registration error: ' + err.message);
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">PharmaDash</h2>
          <p className="mt-2 text-sm text-brand-secondary">
            Create a new researcher account
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-1">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-2.5 px-4 text-sm font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Sign up'}
          </button>

          <div className="text-center text-sm">
            <span className="text-brand-secondary">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-brand-primary hover:text-brand-primary/80"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};