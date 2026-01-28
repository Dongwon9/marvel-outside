# 공통 UI 컴포넌트

프로젝트 전체에서 재사용 가능한 UI 컴포넌트 모음입니다.

## 컴포넌트 목록

### Button

다양한 스타일의 버튼 컴포넌트

**Props:**

- `variant`: "primary" | "secondary" | "danger" | "success" | "outline" (기본값: "primary")
- `size`: "sm" | "md" | "lg" (기본값: "md")
- `children`: ReactNode (필수)
- 모든 표준 button HTML 속성 지원

**사용 예시:**

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md">
  저장
</Button>

<Button variant="danger" onClick={handleDelete}>
  삭제
</Button>

<Button variant="outline" size="sm" disabled={loading}>
  새로고침
</Button>
```

---

### Card

일관된 카드 스타일을 제공하는 컴포넌트

**Props:**

- `variant`: "default" | "elevated" | "outlined" (기본값: "default")
- `padding`: "sm" | "md" | "lg" (기본값: "md")
- `children`: ReactNode (필수)
- 모든 표준 div HTML 속성 지원

**사용 예시:**

```tsx
import { Card } from "@/components/ui";

<Card variant="elevated" padding="lg">
  <h2>제목</h2>
  <p>내용</p>
</Card>

<Card variant="outlined" className="border-red-200">
  위험 영역
</Card>
```

---

### Input

레이블, 에러 메시지, 헬퍼 텍스트를 포함한 입력 필드

**Props:**

- `label`: string (선택)
- `error`: string (선택) - 에러 메시지 표시
- `helperText`: string (선택) - 도움말 텍스트
- 모든 표준 input HTML 속성 지원

**사용 예시:**

```tsx
import { Input } from "@/components/ui";

<Input
  type="email"
  label="이메일"
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>

<Input
  type="text"
  label="사용자명"
  helperText="다른 사용자에게 표시되는 이름입니다"
  required
/>
```

---

### IconButton

lucide-react 아이콘과 함께 사용하는 아이콘 전용 버튼 컴포넌트

**Props:**

- `icon`: LucideIcon (필수) - lucide-react의 아이콘 컴포넌트
- `size`: "sm" | "md" | "lg" (기본값: "md")
  - sm: 16px
  - md: 20px
  - lg: 24px
- `variant`: "default" | "primary" (기본값: "default")
- 모든 표준 button HTML 속성 지원

**사용 예시:**

```tsx
import { IconButton } from "@/components/ui";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

<IconButton icon={ThumbsUp} size="md" onClick={handleLike} />

<IconButton
  icon={MessageCircle}
  size="lg"
  variant="primary"
  onClick={handleComment}
/>

<IconButton
  icon={Share2}
  size="sm"
  className="hover:bg-gray-100"
/>
```

---

## 아이콘 사용 가이드

### lucide-react 아이콘

프로젝트는 **lucide-react**를 아이콘 라이브러리로 사용합니다.
**일반 사용:**

```tsx
import { Heart, Star, Bookmark } from "lucide-react";

<Heart className="h-5 w-5 text-red-500" />
<Star size={24} className="text-yellow-500" />
<Bookmark size={20} />
```

**IconButton과 함께 사용:**

```tsx
import { IconButton } from "@/components/ui";
import { Settings, LogOut, Bell } from "lucide-react";

<IconButton icon={Settings} size="md" />
<IconButton icon={LogOut} size="lg" variant="primary" />
<IconButton icon={Bell} size="sm" />
```

**프로젝트에서 사용하는 주요 아이콘:**

- `ThumbsUp`, `ThumbsDown` - 좋아요/싫어요
- `MessageCircle`, `MessageSquare` - 댓글/메시지
- `Share2` - 공유
- `MoreVertical` - 더보기 메뉴
- `ChevronLeft`, `ChevronRight` - 내비게이션
- `Eye` - 조회수
- `User`, `Users` - 사용자
- `FileText`, `Newspaper` - 문서/게시글
- `Upload` - 파일 업로드

전체 아이콘 목록: [lucide.dev](https://lucide.dev/)

---

### Section

일관된 섹션 간격을 제공하는 래퍼 컴포넌트

**Props:**

- `spacing`: "sm" | "md" | "lg" (기본값: "md")
- `children`: ReactNode (필수)
- 모든 표준 section HTML 속성 지원

**사용 예시:**

```tsx
import { Section } from "@/components/ui";

<Section spacing="lg">
  <h1>페이지 제목</h1>
  <div>콘텐츠</div>
</Section>;
```

---

## 일괄 Import

```tsx
import { Button, Card, Input, IconButton, Section } from "@/components/ui";
```

## 스타일 커스터마이징

모든 컴포넌트는 `className` prop을 통해 추가 스타일을 적용할 수 있습니다:

```tsx
<Button className="w-full" variant="primary">
  전체 너비 버튼
</Button>

<Card className="border-2 border-blue-500">
  커스텀 테두리 카드
</Card>
```

## 반응형 디자인

모든 컴포넌트는 반응형으로 설계되어 있으며, 자동으로 md 브레이크포인트(768px)에서 스타일이 조정됩니다.
