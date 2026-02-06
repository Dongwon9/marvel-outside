# 토스트 메시지 컴포넌트 구현 가이드

## 개요

Marvel Outside 프로젝트에 재사용 가능한 토스트 메시지 시스템이 구현되었습니다.
화면의 우측 상단에 사용자 피드백(성공, 에러, 정보, 경고)을 표시합니다.

## 구조

### 파일 구성

```
frontend/src/
├── context/
│   ├── toast.ts                 # Toast 타입 및 Context 정의
│   └── ToastContext.tsx         # ToastProvider 컴포넌트
├── hooks/
│   └── useToast.ts              # useToast 커스텀 훅
├── components/ui/
│   └── Toast.tsx                # Toast UI 컴포넌트
└── main.tsx                      # 루트에 ToastProvider 설정
```

### 아키텍처

1. **toast.ts**: Context 타입 정의
2. **ToastContext.tsx**: ToastProvider로 상태 관리
3. **useToast.ts**: 어디서나 토스트 추가/제거 가능한 훅
4. **Toast.tsx**: UI 렌더링 컴포넌트
5. **main.tsx**: 전역 Provider 설정

## 사용 방법

### 기본 사용법

```tsx
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui";

export default function MyComponent() {
  const { addToast, removeToast, toasts } = useToast();

  const handleSave = () => {
    try {
      // ... 저장 로직
      addToast("저장되었습니다", "success");
    } catch (error) {
      addToast("저장 실패", "error");
    }
  };

  return <Button onClick={handleSave}>저장</Button>;
}
```

### addToast API

```typescript
addToast(message: string, type?: ToastType, duration?: number): string

// message (필수): 표시할 메시지
// type (선택): "success" | "error" | "info" | "warning" (기본값: "info")
// duration (선택): 자동 종료 시간(ms), 0이면 영구적 (기본값: 3000)
// 반환값: 토스트 고유 ID (수동 제거 시 사용)
```

### 사용 예시

```tsx
// 성공 메시지 (3초 후 자동 종료)
addToast("저장되었습니다", "success");

// 에러 메시지
addToast("오류가 발생했습니다", "error");

// 5초 후 자동 종료
addToast("주의하세요", "warning", 5000);

// 영구 메시지 (사용자가 수동으로 닫아야 함)
addToast("중요한 알림", "info", 0);

// 수동 제거
const toastId = addToast("임시 메시지", "info", 0);
removeToast(toastId);
```

## 특징

### 1. 타입 안전성

- TypeScript의 엄격한 타입 검사
- Record 타입으로 안전한 인덱싱

### 2. 자동 정리

- 지정된 시간 후 자동으로 토스트 제거
- 메모리 누수 방지

### 3. 반응형 디자인

- 모바일: 우측하단 (top-4, right-4)
- 데스크톱: 우측 상단 (sm:top-6, sm:right-6)

### 4. 애니메이션

- 슬라이드인 애니메이션
- 페이드 인 효과
- Tailwind의 기본 애니메이션 사용

### 5. 여러 토스트 지원

- 동시에 여러 토스트 표시 가능
- 자동 쌓임 정렬

## 스타일

### 각 타입별 색상

| 타입    | 배경색    | 테두리     | 사용 사례            |
| ------- | --------- | ---------- | -------------------- |
| success | green-50  | green-200  | 저장 성공, 생성 완료 |
| error   | red-50    | red-200    | 오류, 실패           |
| info    | blue-50   | blue-200   | 일반 알림            |
| warning | yellow-50 | yellow-200 | 경고, 주의           |

## 모범 사례

### ✅ 좋은 예시

```tsx
// API 호출 결과에 따른 토스트
async function handleSubmit(formData) {
  try {
    await submitForm(formData);
    addToast("저장되었습니다", "success");
  } catch (error) {
    addToast(error.message || "저장 실패", "error");
  }
}

// 사용자 액션 피드백
function handleDelete() {
  deleteItem(id);
  addToast("삭제되었습니다", "success");
}
```

### ❌ 피해야 할 예시

```tsx
// 너무 많은 토스트 표시
addToast("메시지1");
addToast("메시지2");
addToast("메시지3"); // 너무 많음

// 중요한 정보를 토스트로만 전달
addToast("계정이 삭제되었습니다"); // 모달이나 페이지 리다이렉트 필요

// 영구 토스트를 과도하게 사용
addToast("일반 정보", "info", 0); // 중요한 경우만 사용
```

## 개발 중 주의사항

1. **Provider 위치**: ToastProvider는 반드시 라우터 상위에 배치
2. **Context 에러**: ToastProvider 외부에서 useToast 호출 금지
3. **메시지 길이**: 너무 긴 메시지는 피하기 (한 줄 권장)

## 기술 스택

- **React**: 19.2.4 (Context API 사용)
- **TypeScript**: strict mode 활성화
- **Tailwind CSS**: v4 (애니메이션)
- **lucide-react**: 아이콘 (CheckCircle, AlertCircle 등)

## 관련 문서

- [UI 컴포넌트 README](./README.md)
- [프로젝트 구조](https://github.com/your-repo/wiki/architecture)
