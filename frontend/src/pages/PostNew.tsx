import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">새 게시글 작성</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
        >
          취소
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
          {/* Board Select */}
          <div>
            <label
              htmlFor="board"
              className="block text-sm md:text-base font-medium text-gray-700 mb-2"
            >
              게시판 선택
            </label>
            <select
              id="board"
              value={formData.board}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, board: e.target.value }))
              }
              className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="block text-sm md:text-base font-medium text-gray-700 mb-2"
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
              className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm md:text-base font-medium text-gray-700 mb-2"
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
              className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
          </div>

          {/* File Upload (Optional) */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              첨부 파일 (선택사항)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm md:text-base text-gray-600 mb-1">
                클릭하거나 파일을 드래그하세요
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                PNG, JPG, GIF 최대 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-4 md:px-6 md:py-5 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            게시하기
          </button>
        </div>
      </form>
    </section>
  );
}
