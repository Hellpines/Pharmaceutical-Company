import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Input from '../components/Input';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate({ to: '/' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('auth/invalid-credential')) {
          setError('Invalid email or password.');
        } else if (err.message.includes('auth/too-many-requests')) {
          setError('Too many attempts. Please try again later.');
        } else {
          setError('Sign-in error: ' + err.message);
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-border-primary">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-dark">PharmaDash</h2>
          <p className="mt-2 text-sm text-brand-secondary">
            Sign in to access the dashboard
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
              <Input
                value={email}
                type="email"
                setValue={setEmail}
                placeholder="name@company.com"
                label="Email"
              />
              <Input
                value={password}
                type="password"
                setValue={setPassword}
                placeholder="••••••••"
                label="Password"
              />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-2.5 px-4 text-sm font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center text-sm">
            <span className="text-brand-secondary">Don't have an account yet? </span>
            <Link
              to="/register"
              className="font-medium text-brand-primary hover:text-brand-primary/80"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};