import { useNavigate } from "react-router-dom";

import { Button, Card } from "@/components/ui";

interface ProfileCardProps {
  userName: string;
  registeredAt: string;
  onEditProfile: () => void;
  mode: "nonMember" | "member" | "self";
  onFollow?: () => void;
}

export default function ProfileCard({
  userName,
  registeredAt,
  onEditProfile,
  mode,
  onFollow,
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
          <p className="mt-2 text-xs text-blue-100 md:text-sm">
            가입일: {registeredDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          {mode === "self" && (
            <>
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
            </>
          )}
          {mode === "member" && (
            <Button
              onClick={onFollow}
              variant="primary"
              size="md"
              className="bg-white font-medium text-blue-600 hover:bg-blue-50"
            >
              팔로우
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
