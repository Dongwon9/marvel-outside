import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody: unknown = await response.json();
        let errorMessage = "로그인 실패";
        if (
          errorBody &&
          typeof errorBody === "object" &&
          "message" in errorBody
        ) {
          const maybeMessage = (errorBody as Record<string, unknown>).message;
          if (typeof maybeMessage === "string") {
            errorMessage = maybeMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const data: unknown = await response.json();
      setSuccess(true);
      setFormData({ email: "", password: "" });

      // 로그인 성공 처리 (토큰 저장, 리다이렉트 등)
      console.log("로그인 성공:", data);
      // TODO: 토큰 저장 및 페이지 리다이렉트
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marvel Outside
          </h1>
          <p className="text-gray-600">로그인하여 시작하세요</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">
              로그인이 완료되었습니다!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <a
              href="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              가입하기
            </a>
          </p>
          <p className="text-sm text-gray-600">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              비밀번호를 잊으셨나요?
            </a>
          </p>
        </div>
        {/* OAuth Login Mockup */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <span className="h-px w-full bg-gray-200" />
            <span className="px-3 text-xs font-semibold text-gray-500 bg-white">
              OAuth
            </span>
            <span className="h-px w-full bg-gray-200" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <span className="i-carbon-logo-google text-lg" />
              Google로 로그인
            </button>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition"
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
