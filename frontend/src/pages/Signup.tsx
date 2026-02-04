import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { signup, login } from "../api/auth";
import { getErrorMessage } from "../api/errors";
import { useAuth } from "../hooks/useAuth";

interface LocationState {
  from?: { pathname: string };
}

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    void (async () => {
      const { confirmPassword, ...userData } = formData;
      if (userData.password !== confirmPassword) {
        alert("비밀번호를 확인하세요.");
        setLoading(false);
        return;
      }
      try {
        await signup(userData);
        const { name, ...loginData } = userData;
        await login({ ...loginData, rememberMe: false });
        await refetchUser();

        const state = location.state as LocationState | null;
        const from = state?.from?.pathname ?? "/";
        void navigate(from);
      } catch (error) {
        console.error(error);
        alert(getErrorMessage(error));
        setLoading(false);
      }
    })();
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-lg bg-white p-6 shadow-lg md:rounded-xl md:p-8">
        {/* Header */}
        <div className="mb-6 text-center md:mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
            회원가입
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Marvel Outside에 참여하세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
              placeholder="example@email.com"
            />
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
            >
              사용자명
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
              placeholder="닉네임"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
              placeholder=""
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
              placeholder="비밀번호 재입력"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 disabled:bg-blue-400 md:py-3.5 md:text-base"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 md:text-base">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
