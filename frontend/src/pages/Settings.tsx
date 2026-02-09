import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { deleteAccount } from "@/api/auth";
import useConfirm from "@/components/useConfirm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

import { Button, Card, Section } from "../components/ui";

export default function Settings() {
  const { confirm } = useConfirm();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleDelete() {
    const confirmed = await confirm({
      title: "정말로 탈퇴하시겠습니까?",
      description:
        "작성한 게시글과 댓글은 남아있게 됩니다. \n이 작업은 되돌릴 수 없습니다!!!",
      confirmLabel: "탈퇴!!!",
      cancelLabel: "취소",
      isDangerous: true,
    });

    if (confirmed) {
      try {
        await deleteAccount();
        addToast("계정이 삭제되었습니다", "success");
        // 로그아웃 처리 및 로그인 페이지로 이동
        void logout();
        void navigate("/login", { replace: true });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "계정 삭제 중 오류가 발생했습니다";
        addToast(errorMessage, "error");
      }
    }
  }
  const settingsSections = [
    {
      title: "계정 설정",
      items: [
        { label: "비밀번호 변경", icon: "🔒" },
        { label: "이메일 변경", icon: "📧" },
      ],
    },
    // {
    //   title: "알림 설정",
    //   items: [
    //     { label: "푸시 알림", icon: "🔔" },
    //     { label: "이메일 알림", icon: "📨" },
    //     { label: "좋아요 알림", icon: "❤️" },
    //   ],
    // },
    // {
    //   title: "개인정보 및 보안",
    //   items: [
    //     { label: "개인정보 처리방침", icon: "📜" },
    //     { label: "차단한 사용자", icon: "🚫" },
    //     { label: "로그인 기록", icon: "📋" },
    //   ],
    // },
  ];

  return (
    <Section>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">설정</h1>
          <p className="text-tertiary mt-1 text-sm md:text-base">
            계정 및 설정을 관리하세요
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4 md:space-y-6">
        {settingsSections.map((section, idx) => (
          <Card
            key={idx}
            variant="default"
            padding="sm"
            className="overflow-hidden"
          >
            <div className="border-light border-b bg-gray-50 px-4 py-3 md:px-6 md:py-4">
              <h2 className="text-primary text-base font-semibold md:text-lg">
                {section.title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 md:px-6 md:py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl md:text-2xl">{item.icon}</span>
                    <span className="text-secondary text-sm font-medium md:text-base">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="text-subtle h-5 w-5" />
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Danger Zone */}
      <Card
        variant="outlined"
        padding="sm"
        className="overflow-hidden border-red-200"
      >
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-base font-semibold text-red-900 md:text-lg">
            위험 지역
          </h2>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-primary text-sm font-medium md:text-base">
                회원 탈퇴
              </h3>
              <p className="text-muted mt-1 text-xs md:text-sm">
                떠나시면 돌아올 수 없습니다...
              </p>
            </div>
            <Button
              onClick={() => void handleDelete()}
              variant="danger"
              size="md"
              className="whitespace-nowrap"
            >
              계정 삭제
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}
