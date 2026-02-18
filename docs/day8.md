# [개발 범위] Project PawSteps (포스텝스) - Day 8 개발 범위 확정 (2/17)

## 1. 현재까지의 개발 진행 상황 요약

*   **Phase 1: Supabase 백엔드 기초 구현 (완료)**
    *   Supabase 환경 변수 설정 및 클라이언트 초기화 코드 (`.env.local`, `app/lib/supabase/client.ts`, `app/lib/supabase/server.ts` - **런타임 오류 해결 완료**)
    *   Supabase 타입 정의 (`types/supabase.ts`)
    *   DB 스키마 정의 (`activities`, `families`, `profiles` 테이블)
    *   RLS (Row Level Security) 정책 설정 완료
    *   활동 기록 CRUD (Create, Read, Update, Delete) Server Actions 구현 완료
    *   Google 소셜 로그인 연동 (Supabase 및 Next.js 코드) 및 가족 생성 로직 구현 완료
*   **Phase 2: 메인 대시보드 UI 및 타임라인 리스트 렌더링 (골격 구현 완료)**
    *   Next.js 및 Tailwind CSS 연동 확인
    *   모바일 우선 디자인 원칙 적용 (UI 구현 시 반영 예정)
    *   `app/page.tsx`에 대시보드 기본 레이아웃 및 컴포넌트(AI 브리핑 영역, 퀵 로그 버튼, 활동 타임라인) 골격 구현
    *   인증 상태에 따른 UI 분기 (로그인 페이지, 가족 생성 페이지, 대시보드) 구현
    *   `app/login/page.tsx` (Google 로그인 버튼 포함) 및 `/auth/callback`, `/auth/signout` 라우트 구현

## 2. 현재 직면한 주요 문제

*   **해결 완료:** Supabase 클라이언트 초기화 과정에서 발생하던 "Your project's URL and Key are required to create a Supabase client!" 런타임 오류 및 `TypeError: Cannot read properties of undefined (reading 'getUser')` 오류 해결. 애플리케이션이 정상적으로 구동됩니다.

## 3. 남은 개발 목표 (PRD 기준)

*   **Phase 3: 가족 공유 및 실시간 동기화 (Supabase Realtime)**
    *   Supabase Realtime 구독 로직 구현
    *   실시간 업데이트를 UI에 반영
*   **Phase 4: AI 건강 브리핑 (Gemini/Groq API 연동)**
    *   외부 AI API 연동 및 데이터 요약 기능 추가 (프롬프트 구성, API 호출 및 응답 처리)

## 4. [개발 범위] 현실적인 개발 범위 확정 (2/17 23:59까지)

현재 가장 시급한 문제는 Supabase 클라이언트 초기화 오류 해결입니다. 이 문제가 해결되지 않으면 다른 모든 기능 개발이 불가능합니다.

### 목표 결과:
*   Supabase 클라이언트 초기화 오류 해결 후, 대시보드 UI에서 핵심 활동 기록 (추가/조회) 기능 정상 작동

### 구현 목표 (우선순위):
1.  **Supabase 클라이언트 초기화 오류 해결:** 현재 발생 중인 "Your project's URL and Key are required..." 오류 완벽 해결. (✓ **완료**)
2.  **대시보드 UI - 핵심 기능 연동:**
    *   로그인/로그아웃 기능 원활 작동 확인. (✓ **완료**)
    *   퀵 로그 버튼(`addActivity` Server Action)을 통한 활동 기록 추가 확인. (✓ **완료**)
    *   활동 타임라인(`getActivities` Server Action)에 기록된 활동 목록 정확히 표시 확인. (✓ **완료**)
    *   가족 생성 기능 (`createFamilyAndAssignToUser` Server Action) 정상 작동 확인. (✓ **완료**)
3.  **배포 (Vercel):**
    *   Vercel에 Next.js 프로젝트 배포.
    *   Vercel 환경 변수 설정.
    *   배포된 URL에서 로그인, 가족 생성, 활동 추가 등 핵심 기능 작동 확인.

### 제외/후순위 목표 (오늘까지):
*   **Phase 3 (실시간 동기화):** 구현 목표 초과 달성 시 착수 가능.
*   **Phase 4 (AI 건강 브리핑):** 이번 개발 범위에서 제외.
*   **활동 기록 수정/삭제 UI:** 이번 개발 범위에서 제외 (백엔드 로직은 존재).
*   **카카오 소셜 로그인:** 이번 개발 범위에서 제외.
*   **상세 UI/UX 개선:** 핵심 기능 동작 확인 후 진행.
