# 커스텀 아이콘 가이드

이 폴더는 lucide-react에 없는 커스텀 아이콘을 관리합니다.

## 현재 상태

현재 프로젝트의 모든 아이콘은 **lucide-react**에 존재하므로 커스텀 아이콘이 필요하지 않습니다.

## lucide-react 사용 중인 아이콘

프로젝트에서 사용하는 lucide-react 아이콘 목록:

- `ThumbsUp` - 좋아요 버튼
- `ThumbsDown` - 싫어요 버튼
- `MessageCircle` - 댓글
- `Share2` - 공유
- `MoreVertical` - 더보기 메뉴 (3점)
- `ChevronLeft` - 왼쪽 화살표
- `ChevronRight` - 오른쪽 화살표
- `Eye` - 조회수
- `User` - 사용자
- `Users` - 사용자 그룹
- `FileText` - 문서
- `ClipboardList` - 게시판 목록
- `Newspaper` - 뉴스/게시글
- `MessageSquare` - 메시지
- `Upload` - 파일 업로드

## 커스텀 아이콘 추가 방법

향후 lucide-react에 없는 아이콘이 필요한 경우:

### 1. SVG 컴포넌트 생성

```tsx
// CustomIcon.tsx
interface CustomIconProps {
  className?: string;
  size?: number;
}

export default function CustomIcon({
  className = "",
  size = 24,
}: CustomIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* SVG path 내용 */}
      <path d="..." />
    </svg>
  );
}
```

### 2. index.ts에 export 추가

```tsx
export { default as CustomIcon } from "./CustomIcon";
```

### 3. 사용 예시

```tsx
import { CustomIcon } from "@/components/icons";

<CustomIcon className="h-6 w-6 text-blue-600" size={24} />;
```

## 아이콘 디자인 가이드라인

커스텀 아이콘을 만들 때는 lucide-react 스타일을 따라야 합니다:

- **Stroke 기반**: fill이 아닌 stroke 사용
- **Stroke Width**: 기본 2px
- **ViewBox**: `0 0 24 24`
- **Round Cap & Join**: `strokeLinecap="round"` `strokeLinejoin="round"`
- **일관된 크기**: 24x24 기준
- **currentColor**: stroke 색상은 `currentColor` 사용하여 부모에서 제어 가능하도록

## 참고 자료

- [Lucide Icons](https://lucide.dev/) - 공식 아이콘 카탈로그
- [SVG Path Editor](https://yqnn.github.io/svg-path-editor/) - 경로 편집 도구
