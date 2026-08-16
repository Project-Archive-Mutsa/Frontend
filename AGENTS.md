<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Product Context

- 제품 기능, 도메인 모델, 화면 구조, UX 문구를 설계하거나 변경하기 전에
  `docs/product-context.md`를 읽고 제품 방향과 핵심 정책을 확인합니다.
- 화면이나 사용자 흐름을 구현하거나 변경할 때는 `docs/wireframes.md`도 확인합니다.
- `docs/wireframes.md`와 그 안의 이미지는 초기 아이디어를 전달하기 위한 와이어프레임입니다.
  확정된 UI 디자인, 디자인 시스템 또는 픽셀 단위 구현 명세로 취급하지 않습니다.
- 와이어프레임의 색상, 타이포그래피, 간격, 더미 데이터, Figma Make 및 브라우저 UI는
  구현 요구사항이 아닙니다. 정보 구조와 사용자 목적을 먼저 해석합니다.
- 문서에 없는 핵심 정책이나 권리·거래 규칙을 임의로 확정하지 않습니다.

## Code Review Rules

### Review language

- 모든 PR 리뷰 요약과 인라인 코멘트는 한국어로 작성합니다.
- 코드 식별자, 파일 경로, 명령어와 오류 메시지는 원문을 유지하고 설명만 한국어로 작성합니다.

## Commit Message Rules

- Conventional Commit의 타입과 선택적인 스코프는 영어로 작성합니다.
- 콜론 뒤의 커밋 제목은 한국어로 작성합니다.
- 예시: `feat: 로그인 폼 유효성 검사 추가`

## Loading UI Rules

- 비동기 pending 상태를 `처리 중...` 같은 텍스트만으로 표시하지 않습니다.
- 로딩 표시는 `shared/components/loading-spinner/loading-spinner.tsx`의 공통
  `LoadingSpinner`를 사용합니다.
- 버튼 pending 상태에서는 버튼을 비활성화하고 버튼 내부에 인라인
  `LoadingSpinner`를 표시합니다.
- 섹션 전체의 로딩 상태에는 `SectionLoadingSpinner`를 사용합니다.

## Design Reference Rules

- 사용자가 제공한 화면 이미지는 픽셀 단위 구현 명세가 아니라 분위기와 방향을
  파악하기 위한 참고 자료로 취급합니다.
- 이미지의 색상, 간격, 타이포그래피와 배치를 그대로 복제하지 않고 제품의 기존
  화면 흐름, 요청된 화면 범위와 접근성을 고려해 완성도 있게 다듬습니다.
- 이미지에 보이는 임시 요소의 동작은 사용자가 명시한 범위까지만 구현합니다.

## Hackathon UI Scope

- 이 프로젝트의 UI는 해커톤 데모용 데스크톱 화면을 우선합니다.
- 사용자가 별도로 요청하지 않으면 모바일 전용 레이아웃, 모바일 분기 UI와 모바일
  화면 테스트까지 작업 범위를 확장하지 않습니다.
- 데스크톱 구현에 필요한 기본적인 유동 너비는 유지하되, 모바일 대응을 위해 동일한
  콘텐츠나 인터랙션을 중복 구현하지 않습니다.

## UI/UX Skill Workflow

- 화면, 컴포넌트, 디자인 시스템, 반응형 레이아웃, 접근성, 인터랙션 또는 시각적
  완성도를 설계·구현·검토할 때는 다음 두 스킬을 함께 사용합니다.
  - `.agents/skills/ui-ux-pro-max/SKILL.md`: 디자인 근거 탐색, UX·접근성 검증,
    색상·타이포그래피·레이아웃·인터랙션 가이드
  - `.agents/skills/frontend-architecture-guardrails/SKILL.md`: 컴포넌트 책임,
    기능 경계, Server/Client Component, 데이터 흐름과 추상화 구조
- 작업 순서는 제품 문맥과 와이어프레임 확인 → 기존 UI와 디자인 규칙 확인 →
  `ui-ux-pro-max`의 필요한 범위만 검색 → 아키텍처 가드레일에 맞춰 구현 →
  접근성·요청된 화면 크기·상태 UI 검증 순서로 진행합니다.
- 새 페이지나 제품 전반의 시각 방향을 설계할 때는 `ui-ux-pro-max`의
  `--design-system`을 사용합니다. 기존 화면의 일부를 수정할 때는 전체 디자인을
  다시 생성하지 않고 해당 `--domain`과 `--stack nextjs` 검색만 사용합니다.
- `ui-ux-pro-max`의 결과는 참고 근거이며 자동 확정안이 아닙니다. 사용자 요구,
  `docs/product-context.md`, 이 파일의 프로젝트 규칙, 기존 디자인 일관성을 우선하고
  제품에 맞는 결과만 선별해서 적용합니다.
- 이 프로젝트는 Next.js 웹 서비스이므로 모바일 네이티브 전용 지침은 적용하지
  않습니다. 새 패키지나 아이콘 라이브러리는 스킬 추천만으로 설치하지 않고 기존
  의존성과 컴포넌트를 먼저 사용합니다.
- 디자인 시스템 결과를 `design-system/`에 저장하거나 기존 파일을 덮어쓸 때는
  사용자의 명시적인 요청을 먼저 확인합니다.
