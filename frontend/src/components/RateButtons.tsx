import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import {
  createRate,
  deleteRate,
  updateRate,
  type RateResponse,
  type RateType,
} from "../api/rates";
import { ApiError } from "../api/errors";

interface RateButtonsProps {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
  userRate?: RateResponse;
  onRateChange?: (likes: number, dislikes: number) => void;
}

export default function RateButtons({
  postId,
  initialLikes,
  initialDislikes,
  userRate,
  onRateChange,
}: RateButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [currentRate, setCurrentRate] = useState<RateResponse | undefined>(
    userRate,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRate = async (type: RateType) => {
    setIsLoading(true);
    setError(null);

    try {
      // 이미 같은 타입의 평가가 있으면 삭제
      if (currentRate && currentRate.type === type) {
        await deleteRate(currentRate.id);
        setCurrentRate(undefined);
        if (type === "LIKE") {
          setLikes(likes - 1);
        } else {
          setDislikes(dislikes - 1);
        }
        onRateChange?.(
          type === "LIKE" ? likes - 1 : likes,
          type === "DISLIKE" ? dislikes - 1 : dislikes,
        );
        return;
      }

      // 다른 타입의 평가가 있으면 수정
      if (currentRate) {
        const oldType = currentRate.type;
        const updatedRate = await updateRate(currentRate.id, { type });
        setCurrentRate(updatedRate);

        if (oldType === "LIKE") {
          setLikes(likes - 1);
        } else {
          setDislikes(dislikes - 1);
        }

        if (type === "LIKE") {
          setLikes(likes + 1);
        } else {
          setDislikes(dislikes + 1);
        }

        onRateChange?.(
          type === "LIKE" ? likes - 1 + 1 : likes - 1,
          type === "DISLIKE" ? dislikes - 1 + 1 : dislikes - 1,
        );
        return;
      }

      // 새로운 평가 생성
      const newRate = await createRate({ postId, type });
      setCurrentRate(newRate);

      if (type === "LIKE") {
        setLikes(likes + 1);
        onRateChange?.(likes + 1, dislikes);
      } else {
        setDislikes(dislikes + 1);
        onRateChange?.(likes, dislikes + 1);
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "평가를 처리할 수 없습니다.";
      setError(message);
      console.error("Failed to rate:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => handleRate("LIKE")}
          disabled={isLoading}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors md:gap-2 md:px-4 md:py-2.5 ${
            currentRate?.type === "LIKE"
              ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:bg-blue-50"
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="text-sm font-medium md:text-base">{likes}</span>
        </button>
        <button
          onClick={() => handleRate("DISLIKE")}
          disabled={isLoading}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors md:gap-2 md:px-4 md:py-2.5 ${
            currentRate?.type === "DISLIKE"
              ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:bg-gray-50"
          }`}
        >
          <ThumbsDown className="h-5 w-5" />
          <span className="text-sm font-medium md:text-base">{dislikes}</span>
        </button>
      </div>
      {error && <p className="text-xs text-red-600 md:text-sm">{error}</p>}
    </div>
  );
}
