import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { login } from "../api/auth";
import { getErrorMessage } from "../api/errors";
import { useAuth } from "../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, refetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      const state = location.state as LocationState | null;
      const from = state?.from?.pathname ?? "/";
      void navigate(from, { replace: true });
    }
  }, [isLoggedIn, location.state, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.currentTarget;
    const inputValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(formData);
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      await refetchUser();
      setFormData({ email: "", password: "", rememberMe: false });

      const state = location.state as LocationState | null;
      const from = state?.from?.pathname ?? "/";
      void navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-primary mb-2 text-3xl font-bold">
            Marvel Outside
          </h1>
          <p className="text-tertiary">로그인하여 시작하세요</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="text-secondary mb-2 block text-sm font-medium"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="text-secondary mb-2 block text-sm font-medium"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              로그인 상태 유지
            </label>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <a
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              가입하기
            </a>
          </p>
          <p className="text-sm text-gray-600">
            <a
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              비밀번호를 잊으셨나요?
            </a>
          </p>
        </div>
        {/* OAuth Login Mockup */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <span className="h-px w-full bg-gray-200" />
            <span className="bg-white px-3 text-xs font-semibold text-gray-500">
              OAuth
            </span>
            <span className="h-px w-full bg-gray-200" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <span className="i-carbon-logo-google text-lg" />
              Google로 로그인
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
            >
              <span className="i-carbon-logo-github text-lg" />
              GitHub로 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
