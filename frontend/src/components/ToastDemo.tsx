import { Button } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

export default function ToastDemo() {
  const { addToast } = useToast();

  return (
    <div className="space-y-4 rounded-lg bg-gray-50 p-6">
      <h2 className="text-lg font-bold">Toast 데모</h2>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="success"
          size="sm"
          onClick={() => addToast("저장되었습니다", "success")}
        >
          성공 메시지
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => addToast("오류가 발생했습니다", "error")}
        >
          에러 메시지
        </Button>

        <Button size="sm" onClick={() => addToast("알림입니다", "info")}>
          정보 메시지
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast("주의하세요", "warning")}
        >
          경고 메시지
        </Button>

        <Button
          size="sm"
          onClick={() => addToast("이 메시지는 영구적입니다", "info", 0)}
        >
          영구 메시지
        </Button>
      </div>
    </div>
  );
}
