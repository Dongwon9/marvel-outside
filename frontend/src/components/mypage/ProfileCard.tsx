import { useNavigate } from "react-router-dom";

import { Button, Card } from "@/components/ui";

interface ProfileCardProps {
  userName: string;
  email: string;
  registeredAt: string;
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function ProfileCard({
  userName,
  email,
  registeredAt,
  onEditProfile,
  onLogout,
  onDeleteAccount,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const registeredDate = new Date(registeredAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Card
      variant="default"
      padding="md"
      className="bg-linear-to-r from-blue-500 to-blue-600 text-white"
    >
      <div className="space-y-4">
        {/* User Info */}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{userName}</h1>
          <p className="mt-1 text-sm text-blue-100 md:text-base">{email}</p>
          <p className="mt-2 text-xs text-blue-100 md:text-sm">
            가입일: {registeredDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <Button
            onClick={onEditProfile}
            variant="primary"
            size="md"
            className="bg-white font-medium text-blue-600 hover:bg-blue-50"
          >
            프로필 수정
          </Button>
          <Button
            onClick={() => navigate("/settings")}
            variant="secondary"
            size="md"
            className="border border-white bg-transparent font-medium text-white hover:bg-blue-700"
          >
            설정
          </Button>
          <Button
            onClick={onLogout}
            variant="secondary"
            size="md"
            className="border border-white bg-transparent font-medium text-white hover:bg-blue-700"
          >
            로그아웃
          </Button>
          <Button
            onClick={onDeleteAccount}
            variant="danger"
            size="md"
            className="border border-red-300 bg-red-600 font-medium hover:bg-red-700"
          >
            계정 삭제
          </Button>
        </div>
      </div>
    </Card>
  );
}
