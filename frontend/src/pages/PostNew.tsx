import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function PostNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    board: "board1",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("게시글 데이터:", formData);
    navigate("/post");
  };

  return (
    <section className="mx-auto max-w-4xl space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">새 게시글 작성</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900 md:px-4 md:py-2.5 md:text-base"
        >
          취소
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl"
      >
        <div className="space-y-4 p-4 md:space-y-6 md:p-6 lg:p-8">
          {/* Board Select */}
          <div>
            <label
              htmlFor="board"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
            >
              게시판 선택
            </label>
            <select
              id="board"
              value={formData.board}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, board: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
            >
              <option value="board1">자유 게시판</option>
              <option value="board2">질문 게시판</option>
              <option value="board3">정보 공유</option>
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              placeholder="제목을 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700 md:text-base"
            >
              내용
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              required
              rows={12}
              placeholder="내용을 입력하세요"
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
            />
          </div>

          {/* File Upload (Optional) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 md:text-base">
              첨부 파일 (선택사항)
            </label>
            <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500 md:p-8">
              <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400 md:h-12 md:w-12" />
              <p className="mb-1 text-sm text-gray-600 md:text-base">
                클릭하거나 파일을 드래그하세요
              </p>
              <p className="text-xs text-gray-500 md:text-sm">
                PNG, JPG, GIF 최대 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:justify-end md:px-6 md:py-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto md:px-6 md:py-3 md:text-base"
          >
            취소
          </button>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg sm:w-auto md:px-6 md:py-3 md:text-base"
          >
            게시하기
          </button>
        </div>
      </form>
    </section>
  );
}
