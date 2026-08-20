# 백엔드 이슈 인덱스

이 문서는 프론트엔드 작업 중 필요한 백엔드 계약과 GitHub 이슈의 연결 관계를 빠르게
찾기 위한 로컬 스냅샷이다. 이슈 본문 전체를 매번 다시 조회하지 않고도 구현 범위와
의존 관계를 파악하는 용도로 사용한다.

- 대상 저장소: [Project-Archive-Mutsa/Backend](https://github.com/Project-Archive-Mutsa/Backend)
- 마지막 동기화: 2026-08-20 KST
- 동기화 범위: Backend 이슈 #5~#28, #31~#42, Frontend #10 및 PR #30
- 동기화 시점 상태: Backend #5~#28·#31~#38 `CLOSED`, #39~#42 `OPEN`, Frontend #10 `OPEN`, PR #30 `MERGED`
- 병합 상태: PR #30은 2026-08-20 11:40 KST에 `main`으로 병합됨
- 배포 상태: 2026-08-20 운영 Swagger `GET /v3/api-docs` 200 응답과 공개 목록·상세 실응답 확인.
  다만 운영 프로젝트 300건에는 구조화 수상·행사·자산·결과물 단계 seed가 반영되지 않음

이 문서는 실시간 상태가 아니다. 기능 범위와 계약을 확인할 때는 이 문서를 먼저 읽고,
현재 상태·새 댓글·수정된 본문을 확인하거나 이슈를 작성·보완할 때만 GitHub를 다시
조회한다. GitHub를 조회해 내용이 달라졌다면 이 문서의 관련 항목과 동기화 날짜도 함께
갱신한다.

백엔드 저장소는 읽기·분석과 이슈 작성 용도로만 사용한다. 백엔드 코드, 브랜치와
커밋은 수정하지 않는다.

## 전체 목록 대신 인기 4개만 보이는 문제

결론부터 말하면 이 내용은 [Backend #13](https://github.com/Project-Archive-Mutsa/Backend/issues/13)에
명확히 작성되어 있다.

배포 백엔드에 페이지네이션된 `GET /api/projects`가 추가되었다. 프론트의 `/projects`는
이 계약으로 전환하며 기존 `/api/projects/popular`의 최대 4개 제한 안내를 제거한다.

#13의 요구 계약은 다음과 같다.

```http
GET /api/projects
  ?q=
  &registrationPurpose=ZOMBIE|SELL|TEAM_RECRUIT
  &resultLevel=IDEA_PLAN|DESIGNED|INITIAL_OUTPUT|SUBMISSION_OUTPUT|APPLIED
  &activityStatus=ACTIVE|PAUSED|ENDED
  &eventType=COMPETITION|CONTEST|HACKATHON|CAPSTONE|COURSE|OTHER
  &eventYear=
  &category=
  &problemArea=
  &method=
  &tag=
  &assetCategory=
  &sort=RECENT|POPULAR
  &page=0
  &size=20
```

- 필터가 없으면 페이지네이션된 전체 프로젝트를 반환한다.
- `/api/projects/popular`는 새 조회 서비스의 `sort=POPULAR` 호환 어댑터로만 유지한다.
- 필터·정렬·페이지네이션은 DB에서 수행한다.
- `informationCompletenessScore`, 출품 행사, 결과물 단계, 활동 상태, 자산 요약과
  수상 이력을 공통 목록 응답에 포함한다.
- 원본 자산 URL, 판매 원본, 비공개 정보와 존재가 보장되지 않는 상세 경로는 반환하지
  않는다.

2026-08-19 실제 Swagger와 응답에서 이 계약의 목록·필터·정렬·페이지네이션을 확인했다.

## 2026-08-20 병합 계약 대조 결과

이슈의 `CLOSED` 상태는 이슈 본문에 제안한 계약이 그대로 구현됐다는 뜻은 아니다. 아래는
현재 `main`의 커밋 `aae441d`와 2026-08-20 운영 Swagger를 기준으로
프론트가 사용해야 할 계약이다. 인증이 필요한 쓰기 흐름은 전용 계정이 없어 아직
운영 E2E를 완료하지 못했다.

- 전체 프로젝트 목록, 복합 필터와 페이지네이션은 `GET /api/projects`로 제공된다.
- 프로젝트 등록은 제안된 통합 `POST /api/projects`가 아니라 기존 목적별 multipart
  `/api/project-registration/basic|zombie|sale|team-recruit`로 제공된다.
- 팀원 모집 목적 프로젝트 등록과 `POST /api/recruitments`는 별도 요청이라 원자적이지
  않다. 두 번째 요청 실패 시 프로젝트만 등록된 부분 성공을 프론트에서 표시해야 한다.
- 포인트 구매 `POST /api/projects/{projectId}/purchase`와 모집글별 지원·수락·거절·철회
  API는 제공된다.
- AI 검색은 실제 후보와 `analysisSummary`, `analysisStatus`를 반환한다.
- 공통 목록에는 판매 권리 요약과 좀비 자산별 라이선스·재사용 조건이 목적별 projection으로 포함된다.
- 테스트용 `POST /api/project-registration/completeness/preview`는 배포되어 있지만 제품
  등록 흐름에서는 호출하지 않는다. 정보 충실도는 등록 요청에서 한 번 계산하고 등록
  응답과 목록·상세에서 조회한다.
- 프로젝트 상세 `GET /api/projects/{projectId}`는 공통 메타데이터, viewer,
  `reportOffer`와 목적별 `purposeDetail`을 반환한다. 목록 검색으로 상세 필드를 추정하지 않는다.
- 상세 리포트는 별도 접근 상태, 멱등 구매, 본문과 단기 파일 URL API로 분리됐다.
- 포인트 잔액·충전·거래내역, 전체 프로젝트 양도 구매, 모집 지원, 북마크와 마이페이지
  조회 API가 병합됐다.
- 프로젝트 구매 응답에는 판매 거래 스냅샷 ID가 없어 구매 직후
  `GET /api/project-sales/transactions/{transactionId}`를 안전하게 호출할 수 없다.
- 운영 공개 상세에서 리포트가 없는 프로젝트는 `reportOffer: null`을 반환하며, 판매
  `includedAssets`는 문자열 배열이 아니라 `{ count, categories }` 요약 객체다.
- 운영 프로젝트 300건은 `SELL` 150건과 `ZOMBIE` 150건뿐이며 `resultLevel`, 행사,
  수상 이력과 자산이 모두 비어 있다. `/api/awards/recent`도 성공 응답의 빈 배열을
  반환해 운영 seed/backfill 이슈 #31로 분리했다.
- AI 검색은 운영 프로젝트로 모델을 재학습하지 않는다. 요청 시 OpenAI 분류·임베딩을
  수행하고 DB의 저장 임베딩과 비교하므로, 데모 프로젝트도 임베딩 backfill이 없으면
  AI 검색 후보에서 제외된다.
- 포인트 충전 거래는 정상적으로 `projectId = null`을 저장하지만 거래내역 조회에서
  `Map.of().get(null)`이 발생해 500이 되는 코드 경로를 #32로 분리했다.
- 닫힌 #12에 명시됐지만 실제 목록 계약에서 빠진 판매 가격 조건·가격대 필터는 #33,
  읽기 API만 있는 메시지의 문의·답장·읽음 처리는 #34로 분리했다.
- 운영 AI 검색의 약 22초 지연은 두 번의 직렬 OpenAI 호출과 여러 DB 검색의 단계별
  측정·timeout·부분 성공 요구사항을 #35로 분리했다.
- AI 검색의 `comparisonPoints`, `validationPoints`, 프로젝트별 `differencePoint`,
  `validationSuggestion`이 실제 후보를 분석하지 않는 고정 템플릿인 문제는 #38로
  분리했다.
- 2026-08-20 후속 정책에서 `ARCHIVE | REGISTER | BASIC`은 `ZOMBIE`로 통합하고,
  모든 목적의 일반 상세정보와 자산은 기본 잠금으로 변경했다. 구현 범위는 목적 통합
  #39, 목적별 상세정보 접근 #40, 객관적 구조화 상세정보 #41로 분리했다.
- 등록 자료별 권리·접근 입력을 제거하고 프로젝트 단위 공통 공개 동의를 저장하는
  계약은 #42로 분리했다. 실제 접근 범위는 #40에 따라 서버가 목적에서 파생한다.
- #38은 실제 후보 기반 문구 생성과 상태 계약이 반영됐다는 완료 댓글과 함께 닫혔다.

## 화면별 빠른 찾기

| 프론트 영역 | 먼저 볼 이슈 | 함께 볼 이슈 |
|---|---|---|
| 프로젝트 등록 공통 흐름 | #15 통합 등록 | #6 자산, #14 정보 충실도 |
| 아카이브·좀비·판매·모집 목적 입력 | #15 등록 | #5 좀비, #12 판매, #8 모집 |
| 전체 프로젝트 탐색·검색·필터 | #13 통합 목록 | #14 충실도, #19 OpenAPI |
| 홈 인기 프로젝트·최근 수상작 | #9 홈 집계 | #13 목록, #15 수상 이력 |
| 정보 충실도 점수 | #14 AI 평가 | #10 자산 분석, #15 등록 |
| AI 유사 프로젝트 검색 | #11 유사 검색 | #16 종합 요약, #10 자산 분석 |
| 좀비 프로젝트 | #5 공개 계승 | #6 자산, #13 목록 |
| 프로젝트 마켓 목록 | #12 판매 모델 | #6 자산, #13 목록 |
| 프로젝트 실제 구매·권리 이전 | #17 거래 | #12 판매, #6 자산 |
| 팀원 모집 목록 | #8 모집글 | #15 등록, #6 참고 자산 |
| 지원·수락·거절 | #7 지원 흐름 | #8 모집글 |
| Swagger 응답 타입 충돌 | #19 OpenAPI | #13 목록, AI 요약 API |
| 운영 로그인 CORS | #20 인증/CORS | Vercel·Render 배포 설정 |
| 마이페이지·상세페이지 범위 기록 | #18 범위 기록 | 상세 후속은 #26~#28 |
| 프로젝트 공개 상세 | #26 상세 조회 | #15 등록, #13 목록 |
| 상세 리포트 접근 보안 | #27 유료 본문 보호 | #6 자산, #26 상세 |
| 상세 리포트 포인트 이용권 기반 | #28 열람권 거래 | #36 공통 가격·정산 정책, #27 접근 보안 |
| 상세 리포트 공통 가격·정산 | #36 1,000P·충실도 배분 | #28 구매 기반, #14 충실도 평가 |
| 내 프로젝트 콘텐츠 정산 | #37 등록자 정산 조회 | #36 정산 정책, Frontend #10 |
| 프로젝트 전체 양도 판매 | #24 전체 양도 | #6 자산, #12 판매, #17 거래 |
| 전체 탐색 데모 데이터 | #25 전체 탐색 seed | #13 목록, #14 충실도 |
| 좀비 프로젝트 데모 데이터 | #21 좀비 seed | #5 좀비, #6 자산 |
| 판매 프로젝트 데모 데이터 | #23 마켓 seed | #24 전체 양도 |
| 팀원 모집 데모 데이터 | #22 모집 seed | #7 지원, #8 모집 |
| 공통 운영 데모 카탈로그 | #31 운영 seed/backfill | #9, #13, #21~#25, PR #30 |
| 포인트 충전 후 거래내역 500 | #32 null 프로젝트 거래 조회 | 포인트 충전·거래내역 API |
| 판매 프로젝트 가격 필터 | #33 가격 조건·가격대 | #12 판매 모델, #24 전체 양도 |
| 메시지 새 문의·답장 | #34 메시지 쓰기·읽음 | #18 후속 범위 기록 |
| AI 검색 응답 지연 | #35 검색 성능·부분 성공 | #11 유사 검색, #31 임베딩 backfill |
| AI 검색 비교·개선 문구 품질 | #38 결과 기반 분석 문구 | #11 유사 검색, #16 종합 요약, #35 성능 |
| 등록 목적 통합 | #39 `ARCHIVE·REGISTER → ZOMBIE` | #15 등록, #5 기존 좀비 모델 |
| 프로젝트 상세정보 잠금·해제 | #40 목적별 접근권한 | #27·#28·#36, #24 전체 양도 |
| 객관적 상세정보 필드 | #41 구조화 섹션 | #15 등록, #14 충실도, #40 접근권한 |
| 등록 자료 공통 공개 동의 | #42 자료별 설정 제거·공통 동의 | #6 자산, #39 목적, #40 접근권한, #41 상세정보 |

## 이슈 목록

| 번호 | 상태 | 기능 | 핵심 계약 |
|---|---|---|---|
| [#5](https://github.com/Project-Archive-Mutsa/Backend/issues/5) | CLOSED | 좀비 프로젝트 | 활동 중단 여부와 분리된 공개 계승 목적, 재사용 자산·라이선스·조건 |
| [#6](https://github.com/Project-Archive-Mutsa/Backend/issues/6) | CLOSED | 프로젝트 자산 | 파일과 링크를 하나의 자산 모델로 묶음. 자료별 권리·접근 입력은 #42가 대체 |
| [#7](https://github.com/Project-Archive-Mutsa/Backend/issues/7) | CLOSED | 팀원 지원 | 지원·수락·거절·철회, 권한과 정원 동시성 검증 |
| [#8](https://github.com/Project-Archive-Mutsa/Backend/issues/8) | CLOSED | 팀원 모집 | 프로젝트 연결형 모집글 등록·목록·검색 |
| [#9](https://github.com/Project-Archive-Mutsa/Backend/issues/9) | CLOSED | 홈 | 등록 프로젝트 기반 인기 프로젝트·최근 수상작 집계 |
| [#10](https://github.com/Project-Archive-Mutsa/Backend/issues/10) | CLOSED | AI 자산 분석 | 문서·디자인·코드·데이터·링크의 안전한 증거 추출 파이프라인 |
| [#11](https://github.com/Project-Archive-Mutsa/Backend/issues/11) | CLOSED | AI 유사 검색 | 문제·대상·해결 방식 기반 비교와 설명 가능한 유사도 |
| [#12](https://github.com/Project-Archive-Mutsa/Backend/issues/12) | CLOSED | 프로젝트 마켓 | 판매 자산·권리 범위·포인트 가격 중심의 판매 모델 |
| [#13](https://github.com/Project-Archive-Mutsa/Backend/issues/13) | CLOSED | 프로젝트 탐색 | 전체 목록·키워드 검색·복합 필터·페이지네이션 |
| [#14](https://github.com/Project-Archive-Mutsa/Backend/issues/14) | CLOSED | AI 정보 충실도 | 등록 정보와 자산 근거 기반 0~100 평가·재평가 |
| [#15](https://github.com/Project-Archive-Mutsa/Backend/issues/15) | CLOSED | 프로젝트 등록 | 출품 맥락·문제/해결·결과/회고를 저장하는 통합 등록 |
| [#16](https://github.com/Project-Archive-Mutsa/Backend/issues/16) | CLOSED | AI 검색 요약 | 검색 결과 상단의 종합 요약·키워드·검증 포인트 |
| [#17](https://github.com/Project-Archive-Mutsa/Backend/issues/17) | CLOSED | 마켓 거래 | 포인트 구매·권리 이전 정책과 원자적 거래 처리 |
| [#18](https://github.com/Project-Archive-Mutsa/Backend/issues/18) | CLOSED | 범위 기록 | 마이페이지·상세페이지를 현재 이슈 세트에서 제외 |
| [#19](https://github.com/Project-Archive-Mutsa/Backend/issues/19) | CLOSED | OpenAPI | 일반 프로젝트 목록 DTO와 AI 요약 DTO 이름 충돌 해소 |
| [#20](https://github.com/Project-Archive-Mutsa/Backend/issues/20) | CLOSED | 인증/CORS | Vercel 운영 origin의 credentialed 로그인 preflight 허용 |
| [#21](https://github.com/Project-Archive-Mutsa/Backend/issues/21) | CLOSED | 좀비 데모 데이터 | 공개 자산·라이선스·재사용 조건과 공통 필드가 채워진 seed |
| [#22](https://github.com/Project-Archive-Mutsa/Backend/issues/22) | CLOSED | 팀원 모집 데모 데이터 | 역할·일정·진행 방식·지원 상태가 다양한 seed |
| [#23](https://github.com/Project-Archive-Mutsa/Backend/issues/23) | CLOSED | 마켓 데모 데이터 | 전체 양도·가격·전체 자산 필드가 채워진 seed |
| [#24](https://github.com/Project-Archive-Mutsa/Backend/issues/24) | CLOSED | 프로젝트 전체 양도 | 프로젝트·전체 자산·관련 권리의 일괄 이전 계약 |
| [#25](https://github.com/Project-Archive-Mutsa/Backend/issues/25) | CLOSED | 전체 탐색 데모 데이터 | 신규 공통 필드가 채워진 다양한 프로젝트 seed |
| [#26](https://github.com/Project-Archive-Mutsa/Backend/issues/26) | CLOSED | 프로젝트 공개 상세 | 등록 공통정보와 목적별 projection을 단일 상세 응답으로 제공 |
| [#27](https://github.com/Project-Archive-Mutsa/Backend/issues/27) | CLOSED | 상세 리포트 접근 보안 | 공개 응답의 `PAID` 본문·비공개 파일 URL 차단과 권한 조회 |
| [#28](https://github.com/Project-Archive-Mutsa/Backend/issues/28) | CLOSED | 상세 리포트 포인트 이용권 기반 | entitlement·멱등 구매·환불 원장 유지, 가격·정산율은 #36이 대체 |
| [#31](https://github.com/Project-Archive-Mutsa/Backend/issues/31) | CLOSED | 공통 운영 데모 카탈로그 | 300개 프로젝트를 탐색·수상·인기·목적별 목록·AI 검색의 단일 원천으로 재구성 |
| [#32](https://github.com/Project-Archive-Mutsa/Backend/issues/32) | CLOSED | 포인트 거래내역 500 | `CHARGE`의 null 프로젝트 ID를 안전하게 조회하고 거래 원장 보존 |
| [#33](https://github.com/Project-Archive-Mutsa/Backend/issues/33) | CLOSED | 판매 목록 가격 필터 | `pricingMode`, 포인트 범위와 가격순 DB 필터·정렬 |
| [#34](https://github.com/Project-Archive-Mutsa/Backend/issues/34) | CLOSED | 메시지 쓰기·읽음 | 프로젝트 소유자 문의, 수신 메시지 답장과 읽음 권한 처리 |
| [#35](https://github.com/Project-Archive-Mutsa/Backend/issues/35) | CLOSED | AI 검색 성능 | 단계별 계측, 제한된 병렬화, timeout·캐시·부분 성공 계약 |
| [#36](https://github.com/Project-Archive-Mutsa/Backend/issues/36) | CLOSED | 상세 리포트 가격·정산 | 공통 1,000P와 `INFO_COMPLETENESS_LINEAR_V1` 버전별 snapshot |
| [#37](https://github.com/Project-Archive-Mutsa/Backend/issues/37) | CLOSED | 등록자 콘텐츠 정산 조회 | 현재·과거 소유 프로젝트의 본인 정산 합계·상세 API |
| [#38](https://github.com/Project-Archive-Mutsa/Backend/issues/38) | CLOSED | AI 검색 분석 품질 | 고정 템플릿을 실제 후보 기반 공통점·차이점·검증/개선 문구로 교체 |
| [#39](https://github.com/Project-Archive-Mutsa/Backend/issues/39) | OPEN | 등록 목적 통합 | `ARCHIVE·REGISTER·BASIC`을 `ZOMBIE`로 통합하고 활동 상태와 분리 |
| [#40](https://github.com/Project-Archive-Mutsa/Backend/issues/40) | OPEN | 프로젝트 상세정보 접근 | 모든 상세정보 기본 잠금, `ZOMBIE` 1,000P·`SELL` 양도·`TEAM_RECRUIT` 소유자 해제 |
| [#41](https://github.com/Project-Archive-Mutsa/Backend/issues/41) | OPEN | 객관적 상세정보 계약 | 문제·해결·검증·제약·한계를 구조화 저장하고 권한 조회에 제공 |
| [#42](https://github.com/Project-Archive-Mutsa/Backend/issues/42) | OPEN | 등록 자료 공통 공개 동의 | 자료별 권리·접근 입력 제거, 프로젝트 단위 동의 snapshot과 목적별 서버 접근정책 |

## 기능별 계약 요약

### #5 좀비 프로젝트

- 좀비 프로젝트는 `PAUSED`나 `ENDED`의 다른 이름이 아니며 `activityStatus`와 독립적이다.
- #39가 이 이슈의 공개 계승 모델을 후속 대체한다. 일반 기록 등록까지 모두
  `registrationPurpose=ZOMBIE`로 통합한다.
- 신규 좀비 등록은 공개 재사용 자산·라이선스를 필수로 요구하지 않으며 자산 0개도
  허용한다. 명시적 계약 없이 재사용 권리를 추론하지 않는다.
- 상세정보와 자산은 #40에 따라 기본 잠금이며, 좀비 프로젝트만 1,000P 열람권으로
  해제한다.

### #6 프로젝트 자산

- 기획서, 발표 자료, 디자인, 코드, 데이터, 연구, 영상과 오프라인 결과물을 하나의
  `project_assets` 모델로 관리한다.
- 파일과 외부 링크는 서로 다른 자산이 아니라 한 논리 자산 아래의 여러 source가 될
  수 있다.
- 신규 등록 자료에는 카테고리, 제목, 프로젝트에서의 역할과 설명을 받는다. #42에 따라
  소유 상태·권리 설명·접근 조건은 사용자 입력에서 제거하고 목적별 접근값은 서버가 만든다.
- 업로드 파일은 `sourcePartKey`로 metadata와 매칭하고 URL이 아닌 storage object key를
  저장한다.
- 비공개·판매 원본은 목록에 공개하지 않고 권한 검증 뒤 짧은 signed URL로 제공한다.
- HWP/HWPX, Figma 계열, 문서, 데이터, 영상 등 유형별 형식·MIME·크기·보안 검증이
  필요하다.

### #7 팀원 지원

- 로그인 사용자만 열린 모집글의 모집 역할에 지원할 수 있다.
- 자기 지원, 중복 지원, 마감 후 지원과 정원 초과를 막는다.
- 모집자는 수락·거절, 지원자는 철회를 수행하며 상태 전이를 제한한다.
- 동시 수락에서도 `headcount`를 초과하지 않도록 lock 또는 조건부 update가 필요하다.
- 지원 응답에는 `applicationId`, `recruitmentId`, `projectId`, 역할과 상태를 제공한다.

### #8 팀원 모집

- 모집글은 독립 게시물이 아니라 `projectId`에 연결된 프로젝트 단위 공고다.
- 역할, 역량, 모집 인원, 일정, 진행 방식, 마감일, 지원 안내와 공개 참고 자산을
  저장한다.
- `GET /api/recruitments`는 검색어·역할·분야·진행 방식·상태·마감/최신 정렬과
  페이지네이션을 지원한다.
- 응답에는 `recruitmentId`, `projectId`와 프로젝트 공통 요약을 함께 제공한다.
- 모집 등록은 프로젝트 등록과 하나의 트랜잭션으로 처리한다.

### #9 홈 인기 프로젝트·최근 수상작

- 인기는 `POPULAR` 카테고리가 아니라 조회·좋아요·북마크 등 반응 통계로 계산한다.
- `/api/projects/popular`는 공통 프로젝트 요약을 반환하며 가격·계좌·원본 ZIP을
  노출하지 않는다.
- `/api/awards/recent`는 독립 수상 게시물이 아니라 등록 프로젝트의 구조화된
  `project_awards`를 사용한다.
- 대표 이미지는 선택 사항이며 행사, 결과물 단계, 활동 상태, 자산, 수상과 정보
  충실도를 홈 카드에 제공한다.

### #10 AI 자산 분석

- 파일 개수나 확장자가 아니라 실제로 읽을 수 있는 증거를 자산 유형별로 추출한다.
- PDF·Office·HWP, Figma·이미지, Git 저장소·ZIP, 데이터, 영상과 권한형 링크를 서로
  다른 안전 정책으로 처리한다.
- 분석 상태는 `PENDING | RUNNING | SUCCEEDED | PARTIAL | FAILED | UNAVAILABLE`로
  기록하고 읽지 못한 이유를 별도로 보존한다.
- 등록 요청과 AI 분석을 분리해 파서·외부 API 실패가 프로젝트 등록 실패로 전파되지
  않게 한다.
- 원문·비밀정보·비공개 자산이 로그나 공개 응답에 유출되지 않아야 한다.

### #11 AI 유사 검색

- 단순 키워드가 아니라 문제 정의, 대상 사용자, 해결 방식과 핵심 기능을 구조화해
  기존 프로젝트와 비교한다.
- 결과에는 0~100 유사도, 유사한 이유, 차이점과 추가 검증 제안을 제공한다.
- 점수는 아이디어의 우수성·성공 가능성·표절 판단이 아니라 비교를 돕는 지표다.
- 공개 가능한 프로젝트 정보만 검색 후보와 설명 생성에 사용한다.
- 일반 `GET /api/projects` 검색과 AI 의미 검색을 같은 API나 응답 타입으로 섞지 않는다.

### #12 프로젝트 마켓 판매 모델

- `SELL` 목적은 무상 기부나 아카이브 공개가 아니라 판매에만 집중한다.
- 판매 대상으로 선택한 자산, 판매 가능한 권리 범위, 가격 방식과 포인트 가격을
  구조화한다.
- 목록에는 구매 판단에 필요한 공개 요약만 제공하고 원본 파일·계좌·비공개 권리
  문서는 노출하지 않는다.
- 판매 목록은 공통 프로젝트 요약과 판매 전용 projection을 조합한다.
- 실제 결제와 권리 이전은 이 이슈가 아니라 #17의 후속 거래 계약이다.

### #13 프로젝트 탐색

- `GET /api/projects`가 전체 프로젝트의 단일 목록 진입점이다.
- 등록 목적, 결과물 단계, 활동 상태, 행사, 연도, 분류, 문제 영역, 수행 방식, 태그와
  자산 유형을 독립적으로 조합해 필터링한다.
- 필터가 없으면 전체 목록을 반환하고 `page`, `size`, `totalElements`, `totalPages`를
  제공한다.
- `q`는 프로젝트명뿐 아니라 공개 요약, 행사와 구조화 태그도 검색한다.
- 인기·판매·좀비 기존 API는 새 조회 서비스의 호환 어댑터로만 유지한다.
- 공통 카드에는 행사, 자산 요약, 수상 이력, `informationCompletenessScore`와 통계를
  제공한다.

### #14 AI 정보 충실도

- 사용자에게 보이는 명칭은 `정보 충실도`이며 프로젝트 가치나 완성도를 평가하지
  않는다.
- 문제·대상, 해결 방식, 출품 결과·검증, 회고·재실행 가능성, 자산 설명·접근·권리
  정합성을 100점 기준으로 평가한다.
- 대표 이미지, 수상 여부, GitHub 존재, 파일 개수와 글자 수만으로 가산·감점하지
  않는다.
- 비소프트웨어 프로젝트에도 공정하도록 `notApplicable` 항목을 허용하고 재정규화한다.
- 목록에는 최신 점수 또는 `null`만 제공하고 세부 근거와 개선 제안은 소유자에게만
  제공한다.
- 등록 전 평가, 결과 조회와 프로젝트 재평가 API를 비동기 상태 모델로 제공한다.

### #15 프로젝트 통합 등록

- #39 후속 정책의 등록 목적은 `ZOMBIE | SELL | TEAM_RECRUIT`이며 기존
  `ARCHIVE | REGISTER | BASIC`은 `ZOMBIE`로 정규화한다.
- 결과물 단계는 `IDEA_PLAN | DESIGNED | INITIAL_OUTPUT | SUBMISSION_OUTPUT | APPLIED`,
  현재 활동 상태는 `ACTIVE | PAUSED | ENDED`로 독립 저장한다.
- 공모전·콘테스트·해커톤·캡스톤·교과·기타 출품 맥락, 주최 기관, 시기, 트랙과
  구조화 수상 이력을 저장한다.
- 문제, 대상, 해결, 핵심 기능, 차별점, 검증, 수행한 접근, 제약 조건, 확인된 한계,
  중단·종료 사유와 후속 검증 과제를 #41 구조로 재조회할 수 있어야 한다.
- `POST /api/projects` multipart 통합 등록을 사용하고 대표 이미지는 선택 사항이다.
- 사용자 ID는 인증 principal, 프로젝트 ID는 DB identity/sequence를 사용한다.
- 기존 목적별 등록 API는 필드 손실을 숨기지 않는 deprecated adapter로만 둘 수 있다.

### #16 AI 검색 상단 종합 요약

- AI 검색 결과 전체를 설명하는 `analysisSummary`와 `analysisStatus`를 추가한다.
- 요약, 핵심 키워드, 비교 포인트, 추가 검증 포인트와 해석 주의 문구를 구조화한다.
- 상태는 `PENDING | SUCCEEDED | PARTIAL | FAILED`를 구분한다.
- 종합 요약 생성 실패가 프로젝트 후보 목록 전체의 500 오류로 전파되면 안 된다.
- 비공개 자산과 구독 전용 본문은 요약 입력과 응답에 포함하지 않는다.

### #17 프로젝트 마켓 거래

- #12가 판매 등록·목록을 담당하고 이 이슈가 실제 포인트 구매와 권리 이전을 담당한다.
- 가격·자산·권리 범위를 거래 시점 스냅샷으로 보존한다.
- 잔액 확인, 차감, 거래 생성과 판매 상태 전환을 원자적으로 처리한다.
- 자기 구매, 중복·동시 구매와 정원 경쟁을 막고 멱등성을 보장한다.
- 구매 완료 사용자에게만 권한 검증된 판매 자산 접근 권한을 부여한다.
- 고정가·협의, 승인, 취소·환불·분쟁·정산 정책은 구현 전에 제품 정책으로 확정해야
  한다.

### #18 마이페이지·상세페이지 범위 기록

- 현재 백엔드 이슈 세트는 마이페이지와 프로젝트·대회·수상·모집 상세 화면을
  구현하지 않는다.
- 목록 API가 존재하지 않는 상세 URL을 임의로 보장하지 않으며 프론트도 상세 화면이
  준비되기 전 링크를 노출하지 않는다.
- 해당 화면 작업을 시작할 때 공개/유료 경계, 권한, canonical URL과 상태 처리를
  포함한 도메인별 신규 이슈를 만든다.

### #19 OpenAPI DTO 이름 충돌

- 일반 목록 DTO와 AI 프로젝트 요약 DTO가 모두 `ProjectSummaryResponse`라는 이름을
  사용해 Springdoc component가 충돌한다.
- 실제 일반 검색 응답은 목록형인데 Swagger는 AI 분석형 필드를 가리키는 상태다.
- 일반 목록과 AI 요약 타입의 Java 이름 또는 `@Schema(name=...)`을 분리한다.
- `/api/projects/search|popular|sell|zombie`는 일반 목록 schema,
  `/api/ai/project-summary`는 AI 요약 schema를 참조해야 한다.
- 실제 JSON과 OpenAPI `$ref`를 필드 수준으로 검증하는 회귀 테스트가 필요하다.

### #20 운영 로그인 CORS

- 운영 프론트 `https://project-archive-rust.vercel.app`에서 Render Backend의
  `POST /api/auth/login`을 호출하면 preflight가 `403 Invalid CORS request`로 거절된다.
- 최신 `SecurityConfig`의 허용 origin 목록에 localhost, SwaggerHub와 Render 계열만
  있고 Vercel 운영 origin이 없다.
- 프론트는 JSON 요청과 세션 쿠키를 위해 `credentials: "include"`를 사용하므로
  `Access-Control-Allow-Origin: *`로 우회할 수 없다.
- 운영 프론트 origin을 exact allowlist에 추가하고 origin 목록은 배포 환경변수 또는
  설정 속성으로 분리한다.
- 무차별 `https://*.vercel.app` 허용은 공격자 소유 Vercel 배포에도 credentialed
  request를 허용하므로 사용하지 않는다.
- 허용 origin의 로그인 `OPTIONS`는 200/204와 정확한 `Access-Control-Allow-Origin`,
  `Access-Control-Allow-Credentials: true`, 메서드·헤더 허용 정보를 반환해야 한다.
- CORS header뿐 아니라 실제 로그인 controller 도달, `Secure; HttpOnly; SameSite=None`
  세션 쿠키 저장과 후속 요청 유지까지 배포 환경에서 검증한다.
- 허용·비허용 origin preflight와 복수 exact origin 설정에 대한 Spring Security 통합
  테스트가 필요하다.

### #21~#25 후속 정책·데모 데이터

- #24는 판매 범위를 선택 자산·자유서술 권리에서 `FULL_PROJECT` 전체 양도로 변경한다.
  등록된 양도 가능 자산 전체, 프로젝트 소유·관리 권한과 관련 권리를 원자적으로
  구매자에게 이전하고 이전 소유자의 관리·원본 접근·재판매 권한을 종료한다.
- Frontend 대응은 [Frontend #8](https://github.com/Project-Archive-Mutsa/Frontend/issues/8)에서
  선택 자산·포함/제외 권리 UI 제거, 전체 양도 확인과 구매 문구 변경으로 분리했다.
- #25, #21, #23, #22는 각각 전체 탐색, 좀비, 마켓, 팀원 모집 화면용 demo DB seed다.
  공통 신규 필드와 목적별 필드를 실제 저장값으로 제공하고 endpoint 하드코딩은 허용하지
  않는다.
- seed는 반복 실행 가능해야 하고 기존 사용자·거래·지원 데이터를 삭제하지 않아야 한다.
- #39~#40 적용 후 좀비 seed의 일반 상세정보와 자산명·파일·링크는 기본 잠금으로
  재분류한다. 기존 라이선스 데이터는 삭제하지 않지만 무료 공개 근거로 자동 사용하지
  않는다. 마켓 seed는 `FULL_PROJECT`, 모집 seed는 역량·일정·진행 방식·지원 조건을
  구조화 계약으로 검증한다.

### #26 프로젝트 공개 상세

- `GET /api/projects/{projectId}` 하나에서 등록 목적, 행사, 분류, 문제 영역·수행 방식,
  결과물 단계, 활동 상태, 구조화 수상, 자산 요약, 정보 충실도와 통계를 제공한다.
- #40 후속 정책에 따라 공개 상세에는 문제·해결·검증·제약/한계, 상세 페이지 제목,
  자산명·파일명·링크와 원본 URL을 넣지 않고 자산 개수·카테고리만 제공한다.
- `publicSummary`는 최대 100자이며 긴 `description`으로 fallback하지 않는다.
- 목적별 상세은 `ZOMBIE | SELL | TEAM_RECRUIT`로 구성한다. 좀비는 1,000P 열람,
  판매는 전체 양도, 모집은 무료 모집 조건만 공개하는 방식으로 구분한다.
- Frontend가 프로젝트명 `q` 검색으로 목록 metadata를 다시 병합하는 임시 어댑터를
  제거할 수 있어야 한다.

### #27 상세 리포트 접근 보안

- 공개 응답에서 `PAID`/비공개 `pageContent`, 파일 URL, storage key와 비공개 외부
  링크를 직렬화하지 않는다.
- `canView=false`인 파일 DTO에 `fileUrl`이 함께 존재하는 상태를 금지한다.
- 등록자 또는 유효한 entitlement 보유자만 인증 전용 report endpoint로 본문을 조회한다.
  사용자 문구는 #40부터 `프로젝트 상세 정보`로 통일한다.
- 파일은 private storage의 object key로 관리하고 권한 확인 뒤 짧은 TTL signed URL을
  발급한다. IDOR, 공개 범위 변경과 URL 만료를 통합 테스트한다.

### #28 상세 리포트 포인트 이용권

- 프로젝트 상세 정보 열람권은 프로젝트 판매와 별도인 비독점 정보 열람권이다. 판매 `price`,
  `PURCHASE/SALE` transaction과 같은 의미로 재사용하지 않는다.
- report offer, viewer access, entitlement와 구매 시점 가격 snapshot을 구조화한다.
- 구매자 차감, entitlement, 거래 기록과 확정된 콘텐츠 정산을 하나의 트랜잭션으로
  처리하며 멱등 키와 unique constraint로 이중 차감을 막는다.
- #28의 프로젝트별 `pricePoint`와 고정 정산율 부분은 #36으로 대체한다. entitlement,
  멱등 구매, 구매·정산 snapshot과 환불 원장은 그대로 유지한다.

### #36 공통 1,000P와 정보 충실도 기반 정산

- 모든 신규 좀비 프로젝트 상세정보 열람가는 서버 관리 `1,000P`이며 offer 요청의 `pricePoint`는
  `400 REPORT_PRICE_IS_SERVER_MANAGED`로 거부한다. 프로젝트 판매가는 별도다.
- #40에 따라 신규 포인트 offer와 구매는 `ZOMBIE`에만 허용하고 `SELL | TEAM_RECRUIT`는
  목적별 소유권 규칙을 사용한다.
- `INFO_COMPLETENESS_LINEAR_V1`은 미산정·0점 60%에서 100점 90%까지 1점당 30bps로
  등록자 배분율을 계산한다. `null`은 미산정으로 유지한다.
- 특정 report version의 첫 판매 시 점수·평가 버전·평가 시각·정산율을 snapshot하고,
  같은 버전의 재판매에서는 바꾸지 않는다.
- 구매 시점 현재 소유자에게 귀속하고 양도 전 거래와 환불 역분개는 당시 등록자 snapshot을
  사용한다.
- 기존 offer 가격만 1,000P로 backfill하고 완료된 구매·정산 snapshot은 수정하지 않는다.

### #37 등록자 프로젝트별 콘텐츠 정산 조회

- `GET /api/members/me/report-earnings`와
  `GET /api/members/me/report-earnings/{projectId}`를 제공하며 `userId`를 받지 않는다.
- 현재 소유 프로젝트와 과거 정산 기록이 있는 양도 완료 프로젝트에서 현재 사용자의
  `creator_member_id` 기록만 집계한다.
- 전체 summary, 프로젝트별 구매·환불·순정산 합계와 구매 snapshot 상세를 반환하며
  구매자 개인정보는 노출하지 않는다.
- Frontend 구현 범위는 [Frontend #10](https://github.com/Project-Archive-Mutsa/Frontend/issues/10)에서
  내 프로젝트 요약, 프로젝트별 정산과 상세 내역으로 분리했다.

### #31 운영 시연 데이터 seed·backfill

- `SupabaseScenarioSeedController`와 `SupabaseScenarioSeedService`가 `local`, `dev`,
  `development` 프로필로 제한돼 현재 운영 프로필에서는 기존 fixture를 실행할 수 없다.
- 운영 적용은 상시 공개된 무인증 seed API가 아니라 관리자 작업 또는 멱등한 1회성
  migration/backfill로 수행한다. 고정 데모 ID만 upsert하고 사용자 데이터 삭제,
  `truncate`와 sequence 초기화는 하지 않는다.
- 현재 완료 데이터는 `SELL` 150건과 `ZOMBIE` 150건, 총 300건의 공통 프로젝트 풀이다.
  #39 적용 뒤 신규 seed에는 `ARCHIVE | REGISTER | BASIC`을 만들지 않는다.
- 최근 수상작은 같은 프로젝트의 `project_awards` 최신 5건, 인기 프로젝트는 같은
  프로젝트의 공식 통계 정렬 상위 5건으로 파생한다. 섹션별 독립 프로젝트나 요청 시
  랜덤 정렬을 만들지 않는다.
- 일반 목록에 노출되는 300건에는 대표 이미지, 행사, 분류, 문제 영역, 수행 방법,
  결과물 단계, 활동 상태, 자산, 정보 충실도, 상세 콘텐츠와 유효한 날짜를 채운다.
  수상작은 최소 40건, 팀 모집 목적은 모두 실제 모집글과 연결한다.
- 최종 프로젝트명·설명으로 이름/설명 임베딩을 재생성한다. 시연 검색어별 기대 주제가
  AI 결과 상위 10개에 포함되는지 검증하며, 임베딩 누락을 전체 성공으로 처리하지 않는다.
- legacy seed 소유 ID와 예상 서명을 대조한 뒤에만 갱신하고, 단계별 실행 결과와 실제
  운영 API count를 이슈 댓글에 기록한다.

### #32 포인트 충전 거래내역 500

- `CHARGE` 거래의 `projectId = null`은 정상 도메인 값이며 거래내역에서 누락하면 안 된다.
- 프로젝트 ID가 없을 때 immutable empty map을 null key로 조회하지 않고
  `projectName = null`을 반환한다.
- 충전 전용, 충전·구매·판매 혼합, 참조 프로젝트 누락과 비로그인 회귀 테스트를 추가한다.
- 운영에서 같은 세션으로 `충전 → 잔액 증가 → 거래내역 200`을 검증한다.

### #33 판매 프로젝트 가격 조건·가격대 필터

- #12의 미반영 범위만 보완하며 #24에서 확정한 `FULL_PROJECT`와 충돌하는 권리 범위
  선택 필터를 다시 만들지 않는다.
- `registrationPurpose=SELL`에서 `pricingMode`, `minPoints`, `maxPoints`와
  `PRICE_ASC | PRICE_DESC`를 DB 쿼리로 처리한다.
- 프로젝트 양도 가격과 상세 리포트 열람권 가격을 섞지 않는다.
- 범위 역전·음수·잘못된 enum은 400으로 명확히 반환한다.

### #34 메시지 문의·답장·읽음 처리

- 새 문의는 프로젝트 ID로 현재 소유자를 서버가 결정하고, 답장은 수신한 원본 메시지의
  발신자와 프로젝트 문맥을 사용한다.
- 클라이언트가 `senderId`, `receiverId`, 읽음 상태를 임의로 지정하지 않는다.
- 타인 메시지 조회·답장·읽음 처리, 자기 메시지와 잘못된 본문을 권한·검증 오류로 막는다.
- 두 계정으로 `문의 → 수신 → 답장 → 원 발신자 수신` 운영 E2E를 수행한다.

### #35 AI 프로젝트 검색 성능·부분 성공

- `/api/ai/project-discovery/results`의 라벨 초기화, 두 OpenAI 호출, 네 대상 DB 검색과
  fallback 시간을 요청별로 측정하되 원문·API key·임베딩은 로그에 남기지 않는다.
- 검색 요청마다 seed 초기화를 수행하지 않고, 외부 호출과 독립 DB 검색은 자원 상한 안에서
  병렬화한다.
- warm 중앙값 5초, p95 8초를 목표로 timeout을 두고 일부 성공 결과는 `PARTIAL`로 보존한다.
- 임베딩까지 실패하면 일반 키워드 검색을 AI 결과처럼 위장하지 않는다.

### #38 AI 검색 결과 기반 비교·개선 문구

- 완료 댓글 기준 `analysisSummary.comparisonPoints`, `validationPoints`와 프로젝트별
  `similarReason`, `differencePoint`, `validationSuggestion`이 실제 반환 후보의 공개
  태그·카테고리·제목·설명을 사용하도록 변경됐다.
- 검색어와 실제 반환 후보의 공개 문제·대상·해결 방식·카테고리·태그·결과물 정보를
  근거로 종합 요약, 겹치는 부분, 차이점과 추가 검증/개선 방향을 생성한다.
- 프로젝트별 N+1 모델 호출은 추가하지 않았고 #35의 시간 예산을 유지한다.
- 근거 없는 차이점은 만들지 않고 `null`로 반환한다. 분석 실패 시 고정 템플릿을
  `SUCCEEDED`로 위장하지 않으며 후보 목록과 `PARTIAL | FAILED` 상태를 보존한다.
- 유료 상세 리포트, 비공개 자산, 개인정보는 생성 입력·로그·응답에서 제외한다.

### #39 등록 목적 통합

- 정식 등록 목적은 `ZOMBIE | SELL | TEAM_RECRUIT` 세 개이며
  `ARCHIVE | REGISTER | BASIC`은 idempotent migration과 외부 응답 정규화로
  `ZOMBIE`가 된다.
- `/basic`은 deprecated adapter로만 유지할 수 있고 성공 시 `ZOMBIE`를 저장·응답한다.
- 등록 목적과 `ACTIVE | PAUSED | ENDED` 활동 상태는 독립이며 좀비 등록이 `PAUSED`를
  강제하지 않는다.
- 좀비 등록은 자산 0개를 허용하고 공개 재사용 자산·라이선스를 필수로 요구하지 않는다.

### #40 프로젝트 상세정보 잠금·목적별 해제

- 무료 상세에는 100자 소개, 행사, 기간, 결과·활동 상태, 팀·수상, 자산 개수·종류와
  공개 통계만 제공한다. 긴 설명, 상세 페이지, 자산명·파일명·링크는 기본 잠금이다.
- `ZOMBIE`는 1,000P entitlement, `SELL`은 전체 양도 후 현재 소유자,
  `TEAM_RECRUIT`은 현재 소유자만 일반 상세정보에 접근한다. 모집 조건만 무료 공개한다.
- access 응답은 `POINT_ACCESS | PROJECT_PURCHASE | OWNER_ONLY | ALREADY_GRANTED`
  `unlockMode`를 제공한다.
- 신규 좀비 등록은 1,000P offer와 version/정산 정책 snapshot을 원자적으로 만들고,
  판매·모집 목적의 신규 상세정보 offer/purchase는 거부한다.
- 기존 완료 구매·entitlement·정산·환불은 보존하고 공개 상세·자산 visibility만 목적에
  맞게 잠금 backfill한다.

### #41 객관적 상세정보 필드·구조화 섹션

- `느낀 점`, `어려웠던 점`, 일반 회고 대신 문제·대상·해결·핵심 기능·차별점·검증,
  수행한 접근·제약 조건·확인된 한계·중단/종료 사유·후속 검증 과제를 저장한다.
- 제목 라벨이 합쳐진 `detailPages[].pageContent`를 원본 모델로 쓰지 않고 필드별 컬럼과
  순서가 보존되는 `coreFunctions`로 구조화한다.
- 권한 조회 응답에 안정적인 `sectionCode`, `fieldCode`를 추가해 프론트가 한국어 제목을
  파싱하지 않게 한다.
- 기존 구매 version은 수정하지 않고, 알려진 레거시 라벨만 안전하게 이전하며 매핑이
  불확실한 본문은 `LEGACY_CONTENT`로 보존한다.

### #42 등록 자료 공통 공개 동의

- 모든 신규 등록 목적은 `materialDisclosureConsent=true`를 필수로 받고 인증 사용자,
  서버 동의 시각, `PROJECT_MATERIAL_DISCLOSURE_V1` 정책 코드와 당시 목적을 snapshot한다.
- `detailPages[].visibility`, `links[].accessRequirement`, 자료별 소유·권리 입력과
  판매·모집 자료 재선택 필드는 canonical 요청에서 제거한다.
- 상세 페이지·파일·링크 접근은 클라이언트 값이 아니라 #40의 `registrationPurpose`
  정책으로 서버가 결정한다. 임의 `PUBLIC` 요청으로 무료 공개할 수 없어야 한다.
- 판매 등록 자료 전체는 하나의 제공 범위로 취급한다. 공통 동의는 자료 제공 동의이며
  저작권·소유권 적법성이나 법적 권리 이전을 플랫폼이 보증하는 계약은 아니다.
- 기존 동의 시각을 임의 backfill하지 않고 legacy 상태로 구분하며, 완료 거래·열람권·정산
  snapshot과 기존 권리 데이터는 보존한다.
- 동의 누락은 `400 MATERIAL_DISCLOSURE_CONSENT_REQUIRED`, 전환 완료 뒤 자료별 접근
  필드 전송은 `400 MATERIAL_ACCESS_IS_SERVER_MANAGED`로 처리한다.

## 동기화 체크리스트

GitHub를 다시 조회한 경우 다음을 함께 확인한다.

- 이슈 상태, 제목, 본문과 완료 조건이 변경되었는가
- 새 이슈가 기존 기능을 대체하거나 범위를 분리했는가
- 프론트의 `백엔드 미구현` 표시를 제거할 만큼 API가 실제 배포되었는가
- Swagger뿐 아니라 실제 응답과 프론트 런타임 검증이 일치하는가
- 변경 내용을 이 문서와 `마지막 동기화` 날짜에 반영했는가
