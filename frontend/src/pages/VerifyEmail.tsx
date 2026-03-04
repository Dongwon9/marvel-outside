import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { verifyEmail } from "@/api/auth";
import { getErrorMessage } from "@/api/errors";
import { Section } from "@/components/ui";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("유효하지 않은 인증 링크입니다.");
      return;
    }

    void (async () => {
      try {
        setStatus("loading");
        const res = await verifyEmail(token);
        setStatus("success");
        setMessage(res.message ?? "이메일 인증이 완료되었습니다.");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    })();
  }, [searchParams]);

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <Section>
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-md md:p-8">
        <h1 className="mb-4 text-xl font-semibold text-gray-900 md:text-2xl">
          이메일 인증
        </h1>

        {status === "loading" && (
          <p className="text-sm text-gray-600 md:text-base">
            이메일을 확인하는 중입니다...
          </p>
        )}

        {status !== "loading" && (
          <>
            <p
              className={`mb-6 text-sm md:text-base ${
                status === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
            <button
              type="button"
              onClick={handleGoLogin}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:text-base"
            >
              로그인 페이지로 이동
            </button>
          </>
        )}
      </div>
    </Section>
  );
}

