# 🐾 Project PawSteps (포스텝스) - 요구사항 정의서 (PRD)

## 1. 프로젝트 개요
- **목적**: 반려견의 주요 활동(식사, 배변, 산책, 투약)을 가족이 실시간으로 공동 기록하고 공유하는 건강 관리 MVP 서비스.
- **핵심 가치**: "밥 줬어?"라고 물어보지 않아도 되는 실시간 동기화 및 AI 기반 건강 요약.
- **기술 스택**: Next.js (App Router), Tailwind CSS, Supabase (Auth, DB, Realtime), Vercel.

## 2. 주요 기능 (MVP Scope)

### 2.1. 원터치 퀵 로그 (Activity Logging)
- **기능**: 메인 화면의 큰 버튼 4개(식사, 배변, 산책, 투약)를 눌러 즉시 타임스탬프 기록.
- **데이터 구조**: `activities` 테이블
  - `id`: uuid (PK)
  - `created_at`: timestamp with time zone (default: now())
  - `user_id`: uuid (FK to auth.users)
  - `type`: text (values: 'meal', 'poop', 'walk', 'medicine')
  - `note`: text (optional, 추가 정보 입력용)

### 2.2. 가족 공유 및 실시간 동기화 (Realtime Sync)
- **기능**: Supabase Realtime을 사용하여 가족 구성원 중 한 명이 기록 시 모든 구성원의 대시보드 리스트가 즉시 업데이트됨.
- **인증**: Supabase Auth를 이용한 소셜 로그인(구글/카카오) 및 그룹 ID를 통한 데이터 필터링.

### 2.3. AI 건강 브리핑 (AI Insight)
- **기능**: 당일 또는 최근 24시간 내의 로그를 분석하여 AI가 건강 상태를 한 줄로 요약.
- **구현**: Gemini API 또는 Groq API를 호출하여 데이터 요약 로직 구현.
- **예시**: "오늘 초코는 산책을 2번 했고 배변 상태도 좋습니다! 아주 건강한 하루네요."

## 3. 화면 설계 (UI/UX)
- **Main Page**: 
  - 상단: 오늘 날짜 및 반려견 상태 요약 위젯 (AI 브리핑 영역).
  - 중앙: 2x2 그리드 형태의 대형 기록 버튼 (아이콘 포함).
  - 하단: 최근 활동 타임라인 리스트 (최신순).
- **Mobile First**: 모든 UI는 모바일 브라우저에서 최적화된 웹뷰 형태로 구현.

## 4. 백엔드 개발자 가이드 (Gemini CLI 전용)
- 모든 DB 조작은 **Supabase Server Actions**를 사용하여 클라이언트와 분리할 것.
- **RLS (Row Level Security)**: 동일한 그룹(Family ID)에 속한 사용자만 해당 데이터를 읽고 쓸 수 있도록 정책 설정.
- **TypeScript**: 모든 데이터 타입은 엄격하게 정의하여 `types/supabase.ts` 등으로 관리.

## 5. 단계별 개발 우선순위
1. **Phase 1**: Supabase Table 스키마 생성 및 기초 CRUD Server Actions 구현.
2. **Phase 2**: 메인 대시보드 UI 및 타임라인 리스트 렌더링.
3. **Phase 3**: Supabase Realtime 구독 로직 추가하여 실시간 동기화 구현.
4. **Phase 4**: 외부 AI API 연동 및 데이터 요약 기능 추가.
