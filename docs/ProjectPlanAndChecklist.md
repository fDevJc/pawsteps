# 🐾 Project PawSteps (포스텝스) - 프로젝트 진행 계획 및 체크리스트

## 1. 프로젝트 개요 및 목표

본 문서는 Project PawSteps의 효율적인 개발을 위한 진행 계획과 체크리스트를 정의합니다. PRD(요구사항 정의서)에 명시된 목표와 기술 스택을 기반으로 단계별 작업을 명확히 하고, 현재까지의 진행 상황을 반영하여 다음 단계를 준비합니다.

**최종 목표:** 반려견의 활동을 가족이 실시간으로 공동 기록하고 공유하며, AI 기반 건강 요약을 제공하는 MVP 서비스 출시.

## 2. 현재 진행 상태

*   Git Repository 생성 완료
*   Supabase Project 생성 완료

## 3. 단계별 개발 계획 및 체크리스트

PRD의 "단계별 개발 우선순위"를 기반으로 상세 체크리스트를 구성합니다.

---

### Phase 1: Supabase 백엔드 기초 구현

**목표:** Supabase 데이터베이스 스키마를 설정하고, 필요한 CRUD Server Actions를 구현하여 백엔드의 기본 골격을 마련합니다.

*   **진행 상태:**
    *   [x] `.env.local` 파일에 Supabase 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
    *   [x] `app/lib/supabase/client.ts` 또는 유사한 파일에 Supabase 클라이언트 초기화 코드 작성
    *   [x] `types/supabase.ts` 파일 생성 및 Supabase 타입 정의
    *   [x] `activities` 테이블 스키마 정의 및 Supabase에 적용 (SQL 마이그레이션 또는 Supabase 대시보드 사용)
        *   `id`: uuid (PK)
        *   `created_at`: timestamp with time zone (default: now())
        *   `user_id`: uuid (FK to auth.users)
        *   `type`: text (values: 'meal', 'poop', 'walk', 'medicine')
        *   `note`: text (optional)
    *   [x] RLS (Row Level Security) 정책 설정: 동일 그룹(Family ID) 사용자만 `activities` 테이블에 접근 가능하도록
    *   [x] `app/lib/supabase/server-actions.ts` (가칭) 파일 생성 및 Server Actions 구현
        *   [x] 활동 기록 추가 (Create) Server Action 구현
        *   [x] 활동 기록 조회 (Read) Server Action 구현
        *   [x] 활동 기록 수정 (Update) Server Action 구현 (MVP에서는 제외 가능성 있음 - 논의 필요)
        *   [x] 활동 기록 삭제 (Delete) Server Action 구현 (MVP에서는 제외 가능성 있음 - 논의 필요)
    *   [x] Supabase Auth 연동 및 소셜 로그인(구글) 설정 (카카오는 추후 진행 예정)
        *   [x] 사용자 그룹(Family ID) 관리 로직 설계 및 구현

---

### Phase 2: 메인 대시보드 UI 및 타임라인 리스트 렌더링

**목표:** Next.js App Router와 Tailwind CSS를 활용하여 메인 대시보드 UI를 구현하고, Supabase에서 조회한 활동 기록을 타임라인 형태로 렌더링합니다.

*   **진행 상태:**
    *   [x] Next.js 프로젝트 설정 및 Tailwind CSS 연동 확인
    *   [x] 모바일 우선(Mobile First) 디자인 원칙 적용
    *   [x] `app/page.tsx` (메인 대시보드) 레이아웃 설계 및 기본 컴포넌트 구성
        *   [x] 상단: 오늘 날짜 및 반려견 상태 요약 위젯 (AI 브리핑 영역 - Phase 4에서 연동)
        *   [x] 중앙: 2x2 그리드 형태의 대형 기록 버튼 (식사, 배변, 산책, 투약) 컴포넌트 구현
        *   [x] 하단: 최근 활동 타임라인 리스트 컴포넌트 구현
    *   [x] Phase 1에서 구현된 Server Actions를 사용하여 활동 기록 조회 및 타임라인에 표시

---

### Phase 3: Supabase Realtime 실시간 동기화 구현

**목표:** Supabase Realtime 기능을 활용하여 가족 구성원 간 활동 기록이 실시간으로 동기화되도록 구현합니다.

*   **진행 상태:**
    *   [x] Supabase Realtime 구독 로직 구현 (`activities` 테이블 변경 감지)
    *   [x] 실시간으로 업데이트되는 데이터를 UI에 반영하도록 클라이언트 컴포넌트 수정
    *   [x] 여러 디바이스/브라우저에서 실시간 동기화 테스트

---

### Phase 4: 외부 AI API 연동 및 데이터 요약 기능 추가

**목표:** Gemini 또는 Groq API를 연동하여 활동 기록을 분석하고 AI가 건강 상태를 요약하는 기능을 추가합니다.

*   **진행 상태:**
    *   [x] Gemini 또는 Groq API 키 설정 및 환경 변수 관리
    *   [x] 활동 기록 데이터를 기반으로 AI 프롬프트 구성 로직 구현
    *   [x] AI API 호출 및 응답 처리 Server Action 또는 API Route 구현
    *   [x] AI 브리핑 결과를 메인 대시보드 상단 위젯에 표시
    *   [x] AI 요약 결과에 대한 에러 처리 및 로딩 상태 UI 구현

---

### Phase 5: 배포 (Vercel)

**목표:** Vercel을 통해 Next.js 프로젝트를 배포하고, 배포된 환경에서 애플리케이션의 핵심 기능을 테스트합니다.

*   **진행 상태:**
    *   [ ] Git Repository에 최신 코드 푸시 확인
    *   [ ] Vercel 계정 로그인 및 새 프로젝트 생성
    *   [ ] Git Repository와 Vercel 프로젝트 연동
    *   [ ] Vercel 프로젝트 환경 변수 설정 (Supabase URL, Publishable Key, Google Client ID, Google Client Secret 등)
    *   [ ] Vercel 자동 배포 확인 및 배포된 URL 확인
    *   [ ] 배포된 앱에서 핵심 기능 테스트:
        *   [ ] Google 로그인 및 로그아웃 (특히 중요, 로그아웃 기능 아직 미완성)
        *   [ ] 가족 생성
        *   [ ] 활동 기록 추가 및 타임라인 표시

---

## 4. 추가 고려사항

*   **테스트:** 각 기능 구현 후 단위/통합 테스트 코드 작성 (선택 사항이지만 권장)
*   **배포:** Vercel을 통한 지속적인 배포(CI/CD) 환경 설정 및 관리
*   **에러 핸들링:** 사용자 친화적인 에러 메시지 및 로깅 시스템 구현
*   **성능 최적화:** 이미지, 데이터 로딩 등 성능 병목 지점 최적화 고려