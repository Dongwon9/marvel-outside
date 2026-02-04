# Tailwind CSS 재사용 패턴 가이드

프로젝트에서 반복되는 Tailwind CSS 스타일을 재사용 가능한 클래스로 정리했습니다.
`src/index.css`에서 `@apply` 지시어를 사용하여 정의된 유틸리티 클래스를 활용하세요.

## 📦 컴포넌트 스타일

### Card 스타일

카드, 박스, 컨테이너에 사용됩니다.

```tsx
// 기본 카드 (기본 그림자)
<div className="card-default card-padding-md">
  컨텐츠
</div>

// 상승형 카드 (호버 시 그림자 강화)
<article className="card-elevated card-padding-lg">
  컨텐츠
</article>

// 테두리 카드
<div className="card-outlined card-padding-md">
  컨텐츠
</div>
```

**패딩 옵션:**

- `card-padding-sm`: `p-4`
- `card-padding-md`: `p-4 md:p-6`
- `card-padding-lg`: `p-6 md:p-8`

**사용 예시:**

```tsx
// PostCard, CommentItem 등
<div className="card-default card-padding-md border-light">{content}</div>
```

---

## 🎨 텍스트 색상 스타일

시맨틱한 텍스트 색상 클래스를 사용하여 색상 일관성을 유지하세요.

```tsx
// 주요 텍스트 (진회색, gray-900)
<p className="text-primary">제목</p>

// 보조 텍스트 (회색, gray-700)
<p className="text-secondary">부제목</p>

// 본문 텍스트 (회색, gray-600)
<p className="text-tertiary">본문 내용</p>

// 보조 텍스트 (밝은 회색, gray-500)
<p className="text-muted">작성일, 상태</p>

// 희미한 텍스트 (매우 밝은 회색, gray-400)
<p className="text-subtle">플레이스홀더, 무시 가능한 정보</p>
```

---

## 🔗 버튼/링크 액션 스타일

인터랙티브 요소에 사용되는 스타일입니다.

### 액션 링크 (텍스트 버튼)

```tsx
// 주요 액션 링크 (파란색)
<button className="action-link-primary">
  수정
</button>

// 위험 액션 링크 (빨간색)
<button className="action-link-danger">
  삭제
</button>

// 보조 액션 링크 (회색)
<button className="action-link-secondary">
  취소
</button>
```

### 아이콘 버튼

```tsx
// 좋아요, 댓글, 공유 등의 아이콘 버튼
<button className="action-icon-button">
  <ThumbsUp className="h-5 w-5" />
  <span>{count}</span>
</button>
```

---

## 👤 작성자 정보 섹션

작성자 정보를 표시하는 패턴입니다.

```tsx
<div className="author-section">
  <div className="author-avatar">{avatar || "👤"}</div>
  <div className="author-info">
    <h3 className="author-name">{name}</h3>
    <p className="author-meta">
      {board}, {time}
    </p>
  </div>
</div>
```

**사용 예시:**

```tsx
// PostCard에서
<div className="author-section">
  <div className="author-avatar">{authorAvatar || "👤"}</div>
  <div className="author-info">
    <h3 className="author-name">{authorName}</h3>
    <p className="author-meta">
      {boardName}, {relativeUpdatedAt}
    </p>
  </div>
  <button>...</button>
</div>
```

---

## 🎯 응답형 간격

반응형 패딩과 마진을 위한 유틸리티 클래스입니다.

```tsx
// 응답형 수평 패딩 (px-4 md:px-6)
<div className="responsive-px">
  content
</div>

// 응답형 수직 패딩 (py-3 md:py-4)
<div className="responsive-py">
  content
</div>

// 응답형 전체 패딩 (p-4 md:p-6)
<div className="responsive-p">
  content
</div>
```

---

## 🖼️ 테두리 스타일

테두리 스타일을 위한 클래스입니다.

```tsx
// 가벼운 테두리 (border border-gray-200)
<div className="border-light">
  content
</div>

// 가벼운 위쪽 테두리 (border-t border-gray-100)
<div className="border-top-light pt-4">
  content
</div>
```

---

## ✨ 사용 팁

### 1. 컴포넌트 개발 시

```tsx
// ❌ 피해야 할 방식
<div className="rounded-lg bg-white shadow-md p-4 md:p-6">
  <p className="text-gray-900">{title}</p>
  <p className="text-gray-600">{content}</p>
  <button className="text-sm text-blue-500 hover:text-blue-700">수정</button>
</div>

// ✅ 재사용 패턴 사용
<div className="card-default card-padding-md">
  <p className="text-primary">{title}</p>
  <p className="text-tertiary">{content}</p>
  <button className="action-link-primary">수정</button>
</div>
```

### 2. 결합 가능한 클래스

여러 클래스를 자유롭게 조합하세요:

```tsx
<div className="card-elevated card-padding-lg border-light">content</div>
```

### 3. 색상 일관성

- 색상 코드를 직접 사용하지 않고, 시맨틱 클래스를 사용하세요
- 색상 변경이 필요할 때 `index.css`만 수정하면 전체 프로젝트가 반영됩니다

### 4. 기존 유틸리티와 함께 사용

Tailwind 기본 유틸리티와 자유롭게 조합하세요:

```tsx
<div className="card-default card-padding-md mb-4 flex items-center justify-between">
  content
</div>
```

---

## 🔄 클래스 매핑 참고

| 클래스                | Tailwind 동등값                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `text-primary`        | `text-gray-900`                                                                                               |
| `text-secondary`      | `text-gray-700`                                                                                               |
| `text-tertiary`       | `text-gray-600`                                                                                               |
| `text-muted`          | `text-gray-500`                                                                                               |
| `text-subtle`         | `text-gray-400`                                                                                               |
| `card-default`        | `rounded-lg bg-white md:rounded-xl shadow-md`                                                                 |
| `card-elevated`       | `rounded-lg bg-white md:rounded-xl shadow-md transition-shadow hover:shadow-lg`                               |
| `card-outlined`       | `rounded-lg bg-white md:rounded-xl border border-gray-200`                                                    |
| `action-link-primary` | `text-sm text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50`                             |
| `action-link-danger`  | `text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50`                               |
| `action-icon-button`  | `flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-600 md:gap-2 md:text-base` |

---

## 📋 체크리스트

새 컴포넌트 작성 시:

- [ ] 카드 스타일이 필요한가? → `card-*` 클래스 사용
- [ ] 텍스트 색상 지정? → `text-primary`, `text-secondary` 등 사용
- [ ] 버튼/링크? → `action-link-*` 또는 기존 Button 컴포넌트 사용
- [ ] 작성자 정보? → `author-*` 클래스 사용
- [ ] 반응형 간격? → `responsive-*` 클래스 사용
