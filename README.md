# Project Archive Frontend

Project Archive의 프론트엔드 프로젝트입니다.

처음 참여하는 사람도 같은 방식으로 작업할 수 있도록 개발 환경 설정, 브랜치 사용법, 폴더 구조와 네이밍 규칙을 정리했습니다.

## 개발 환경 준비

이 프로젝트는 `pnpm`을 사용합니다. 저장소를 처음 내려받았다면 프로젝트 루트에서 의존성을 설치합니다.

```bash
pnpm install
```

개발 서버는 다음 명령어로 실행합니다.

```bash
pnpm run dev
```

실행 후 브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

## 브랜치 규칙

- `main`: 배포 가능한 최신 코드를 관리하는 공용 브랜치
- `dev-{이름}`: 각 개발자가 실제 작업하는 개인 브랜치
- Jemin의 작업 브랜치: `dev-jemin`

기능 개발과 수정 작업은 개인 브랜치에서 진행합니다. `main`에서 직접 작업하거나 커밋하지 않습니다.

### 처음 한 번만: 원격 브랜치 가져오기

로컬에 `dev-jemin`이 아직 없다면 원격 브랜치를 가져와 연결합니다.

```bash
git fetch origin
git switch --track origin/dev-jemin
```

이미 로컬 브랜치가 있다면 다음 명령어만 사용합니다.

```bash
git switch dev-jemin
```

현재 브랜치는 다음 명령어로 확인할 수 있습니다.

```bash
git branch --show-current
```

### 작업 시작 전: `main` 최신화하기

매 작업을 시작하기 전에 반드시 로컬 `main`을 최신 상태로 만든 뒤, 변경 내용을 개인 브랜치에 합칩니다.

```bash
# 1. main 브랜치로 이동
git switch main

# 2. 원격 main의 최신 변경 사항 받기
git pull --ff-only origin main

# 3. 개인 작업 브랜치로 이동
git switch dev-jemin

# 4. 최신 main을 개인 작업 브랜치에 반영
git merge main
```

`git pull --ff-only` 또는 `git merge main`에서 충돌이 발생하면 강제로 덮어쓰지 말고, 충돌 내용을 확인한 뒤 해결합니다.

## 폴더 구조

코드는 `components`, `hooks`, `api`처럼 종류별 최상위 폴더에 한꺼번에 모으지 않고, **기능 단위**로 분리합니다.

```text
app/
└── login/
    └── page.tsx              # 라우팅만 담당하고 기능 페이지를 불러옴

features/
└── auth/
    ├── components/
    │   ├── login-page.tsx
    │   └── login-form.tsx
    ├── api/
    │   └── login-api.ts
    ├── hooks/
    │   └── use-login.ts
    ├── types/
    │   └── auth.ts
    └── utils/
        └── validate-login.ts

shared/
├── components/               # 여러 기능에서 공통으로 사용하는 UI
├── hooks/                    # 여러 기능에서 공통으로 사용하는 훅
├── types/                    # 여러 기능에서 공통으로 사용하는 타입
└── utils/                    # 여러 기능에서 공통으로 사용하는 유틸리티
```

구조를 나눌 때는 다음 기준을 지킵니다.

- `app/`에는 라우팅과 Next.js 특수 파일(`page.tsx`, `layout.tsx`, `route.ts` 등)을 둡니다.
- 기능 전용 코드는 `features/<기능명>/` 안에서 관리합니다.
- 두 개 이상의 기능에서 실제로 재사용할 때만 `shared/`로 이동합니다.
- `features/*/api`는 백엔드 API를 호출하는 함수의 위치입니다.
- Next.js Route Handler는 `app/api/<경로>/route.ts`에 작성합니다.

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 파일, 폴더 | `kebab-case` | `login-form.tsx`, `product-detail/` |
| 일반 변수, 매개변수 | `camelCase` | `userName`, `productId` |
| 일반 함수, 커스텀 훅 | `camelCase` | `formatDate`, `useLogin` |
| React 컴포넌트 | `PascalCase` | `LoginForm` |
| 타입, 인터페이스, 클래스, enum | `PascalCase` | `LoginResponse`, `UserRole` |
| 전역 상수 | `UPPER_CASE` | `MAX_RETRY_COUNT` |

서버 응답의 `user_id`처럼 외부 API가 정한 속성 이름은 그대로 사용할 수 있습니다.

## 작업 완료 전 확인

커밋하기 전에 다음 검사를 모두 실행합니다.

```bash
pnpm run lint
pnpm run typecheck
pnpm run test:ci
```

검사를 통과하면 변경한 파일만 스테이징하고 개인 브랜치에 푸시합니다.

```bash
# 예시: 실제로 변경한 파일만 추가
git add features/auth/components/login-form.tsx
git commit -m "feat: 작업 내용"
git push
```

커밋 메시지는 `feat: 로그인 화면 추가`처럼 Conventional Commit 타입은 영어로, 콜론 뒤 설명은 한국어로 작성합니다. 완료한 작업은 Pull Request를 통해 `main`에 반영합니다.
