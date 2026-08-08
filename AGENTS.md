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
