"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

// 用户名验证：数字、字母、下划线，5-16位
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

function validateUsername(username: string): string | null {
  if (username.length < 5 || username.length > 16) {
    return "Username must be 5-16 characters";
  }
  if (!USERNAME_REGEX.test(username)) {
    return "Username can only contain letters, numbers and underscores";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (password.length < 6 || password.length > 16) {
    return "Password must be 6-16 characters";
  }
  return null;
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 用户名校验
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    // 密码校验
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 确认密码
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white/70 p-8 shadow-md backdrop-blur-md">
        <h1 className="mb-6 text-center font-sans text-3xl">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="mb-1 block text-sm text-neutral-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 font-sans focus:border-blue-500 focus:outline-none"
              placeholder="5-16 chars, letters/numbers/underscores"
              required
              minLength={5}
              maxLength={16}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-neutral-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 font-sans focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-neutral-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 font-sans focus:border-blue-500 focus:outline-none"
              placeholder="6-16 characters"
              required
              minLength={6}
              maxLength={16}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm text-neutral-600">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-neutral-300 px-3 py-2 font-sans focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-neutral-900 py-2 font-sans text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
