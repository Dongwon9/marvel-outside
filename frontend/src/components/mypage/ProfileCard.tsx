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
          <h1 className="text-2xl md:text-3xl font-bold">{userName}</h1>
          <p className="text-blue-100 text-sm md:text-base mt-1">{email}</p>
          <p className="text-blue-100 text-xs md:text-sm mt-2">
            가입일: {registeredDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <Button
            onClick={onEditProfile}
            variant="primary"
            size="md"
            className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
          >
            프로필 수정
          </Button>
          <Button
            onClick={() => navigate("/settings")}
            variant="secondary"
            size="md"
            className="border border-white bg-transparent text-white hover:bg-blue-700 font-medium"
          >
            설정
          </Button>
          <Button
            onClick={onLogout}
            variant="secondary"
            size="md"
            className="border border-white bg-transparent text-white hover:bg-blue-700 font-medium"
          >
            로그아웃
          </Button>
          <Button
            onClick={onDeleteAccount}
            variant="danger"
            size="md"
            className="border border-red-300 bg-red-600 hover:bg-red-700 font-medium"
          >
            계정 삭제
          </Button>
        </div>
      </div>
    </Card>
  );
}
