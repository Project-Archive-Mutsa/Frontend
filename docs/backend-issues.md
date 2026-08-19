# 백엔드 이슈 인덱스

이 문서는 프론트엔드 작업 중 필요한 백엔드 계약과 GitHub 이슈의 연결 관계를 빠르게
찾기 위한 로컬 스냅샷이다. 이슈 본문 전체를 매번 다시 조회하지 않고도 구현 범위와
의존 관계를 파악하는 용도로 사용한다.

- 대상 저장소: [Project-Archive-Mutsa/Backend](https://github.com/Project-Archive-Mutsa/Backend)
- 마지막 동기화: 2026-08-19 KST
- 동기화 범위: Backend 이슈 #5~#19
- 동기화 시점 상태: 전부 `OPEN`

이 문서는 실시간 상태가 아니다. 기능 범위와 계약을 확인할 때는 이 문서를 먼저 읽고,
현재 상태·새 댓글·수정된 본문을 확인하거나 이슈를 작성·보완할 때만 GitHub를 다시
조회한다. GitHub를 조회해 내용이 달라졌다면 이 문서의 관련 항목과 동기화 날짜도 함께
갱신한다.

백엔드 저장소는 읽기·분석과 이슈 작성 용도로만 사용한다. 백엔드 코드, 브랜치와
커밋은 수정하지 않는다.

## 전체 목록 대신 인기 4개만 보이는 문제

결론부터 말하면 이 내용은 [Backend #13](https://github.com/Project-Archive-Mutsa/Backend/issues/13)에
명확히 작성되어 있다.

현재 프론트의 `/projects` 기본 진입은 통합 전체 목록 API가 없어서
`GET /api/projects/popular`를 사용한다. 이 응답은 인기 프로젝트를 최대 4개만 제공하므로
현재 화면은 전체 프로젝트 목록이 아니라 인기 프로젝트 미리보기다. 프론트에서는 이를
`백엔드 미구현`으로 표시하고, 전체 목록처럼 오해할 수 있는 총 개수나 문구를 만들지
않아야 한다.

#13의 요구 계약은 다음과 같다.

```http
GET /api/projects
  ?q=
  &registrationPurpose=ARCHIVE|ZOMBIE|SELL|TEAM_RECRUIT
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

따라서 #13이 실제 배포 API로 완료되고 프론트가 `GET /api/projects`로 전환되기 전까지
인기 4개 제한 안내를 제거하면 안 된다.

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
| 마이페이지·상세페이지 | #18 범위 기록 | 후속 신규 이슈 필요 |

## 이슈 목록

| 번호 | 상태 | 기능 | 핵심 계약 |
|---|---|---|---|
| [#5](https://github.com/Project-Archive-Mutsa/Backend/issues/5) | OPEN | 좀비 프로젝트 | 활동 중단 여부와 분리된 공개 계승 목적, 재사용 자산·라이선스·조건 |
| [#6](https://github.com/Project-Archive-Mutsa/Backend/issues/6) | OPEN | 프로젝트 자산 | 파일과 링크를 하나의 자산 모델로 묶고 권리·접근 범위를 구조화 |
| [#7](https://github.com/Project-Archive-Mutsa/Backend/issues/7) | OPEN | 팀원 지원 | 지원·수락·거절·철회, 권한과 정원 동시성 검증 |
| [#8](https://github.com/Project-Archive-Mutsa/Backend/issues/8) | OPEN | 팀원 모집 | 프로젝트 연결형 모집글 등록·목록·검색 |
| [#9](https://github.com/Project-Archive-Mutsa/Backend/issues/9) | OPEN | 홈 | 등록 프로젝트 기반 인기 프로젝트·최근 수상작 집계 |
| [#10](https://github.com/Project-Archive-Mutsa/Backend/issues/10) | OPEN | AI 자산 분석 | 문서·디자인·코드·데이터·링크의 안전한 증거 추출 파이프라인 |
| [#11](https://github.com/Project-Archive-Mutsa/Backend/issues/11) | OPEN | AI 유사 검색 | 문제·대상·해결 방식 기반 비교와 설명 가능한 유사도 |
| [#12](https://github.com/Project-Archive-Mutsa/Backend/issues/12) | OPEN | 프로젝트 마켓 | 판매 자산·권리 범위·포인트 가격 중심의 판매 모델 |
| [#13](https://github.com/Project-Archive-Mutsa/Backend/issues/13) | OPEN | 프로젝트 탐색 | 전체 목록·키워드 검색·복합 필터·페이지네이션 |
| [#14](https://github.com/Project-Archive-Mutsa/Backend/issues/14) | OPEN | AI 정보 충실도 | 등록 정보와 자산 근거 기반 0~100 평가·재평가 |
| [#15](https://github.com/Project-Archive-Mutsa/Backend/issues/15) | OPEN | 프로젝트 등록 | 출품 맥락·문제/해결·결과/회고를 저장하는 통합 등록 |
| [#16](https://github.com/Project-Archive-Mutsa/Backend/issues/16) | OPEN | AI 검색 요약 | 검색 결과 상단의 종합 요약·키워드·검증 포인트 |
| [#17](https://github.com/Project-Archive-Mutsa/Backend/issues/17) | OPEN | 마켓 거래 | 포인트 구매·권리 이전 정책과 원자적 거래 처리 |
| [#18](https://github.com/Project-Archive-Mutsa/Backend/issues/18) | OPEN | 범위 기록 | 마이페이지·상세페이지를 현재 이슈 세트에서 제외 |
| [#19](https://github.com/Project-Archive-Mutsa/Backend/issues/19) | OPEN | OpenAPI | 일반 프로젝트 목록 DTO와 AI 요약 DTO 이름 충돌 해소 |

## 기능별 계약 요약

### #5 좀비 프로젝트

- 좀비 프로젝트는 `PAUSED`나 `ENDED`의 다른 이름이 아니다.
- 선정 기준은 `registrationPurpose=ZOMBIE`이며 `activityStatus`와 독립적이다.
- 최소 한 개의 공개 재사용 자산과 자산별 `licenseName`, `reuseTerms`가 필요하다.
- 목록에는 공개 자산·라이선스·재사용 조건을 제공하고 가격과 판매 원본 URL은 넣지
  않는다.
- `ARCHIVE + PAUSED`가 좀비 목록에 섞이거나 `ZOMBIE + ACTIVE`가 누락되면 안 된다.

### #6 프로젝트 자산

- 기획서, 발표 자료, 디자인, 코드, 데이터, 연구, 영상과 오프라인 결과물을 하나의
  `project_assets` 모델로 관리한다.
- 파일과 외부 링크는 서로 다른 자산이 아니라 한 논리 자산 아래의 여러 source가 될
  수 있다.
- 자산에는 카테고리, 제목, 프로젝트에서의 역할, 설명, 소유 상태, 권리 설명과 접근
  조건이 필요하다.
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

- 등록 목적은 `ARCHIVE | ZOMBIE | SELL | TEAM_RECRUIT` 중 하나다.
- 결과물 단계는 `IDEA_PLAN | DESIGNED | INITIAL_OUTPUT | SUBMISSION_OUTPUT | APPLIED`,
  현재 활동 상태는 `ACTIVE | PAUSED | ENDED`로 독립 저장한다.
- 공모전·콘테스트·해커톤·캡스톤·교과·기타 출품 맥락, 주최 기관, 시기, 트랙과
  구조화 수상 이력을 저장한다.
- 문제, 대상, 해결, 핵심 수행 방식, 차별점, 검증, 시도, 한계, 종료 이유와 다음
  과제를 재조회할 수 있어야 한다.
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

## 동기화 체크리스트

GitHub를 다시 조회한 경우 다음을 함께 확인한다.

- 이슈 상태, 제목, 본문과 완료 조건이 변경되었는가
- 새 이슈가 기존 기능을 대체하거나 범위를 분리했는가
- 프론트의 `백엔드 미구현` 표시를 제거할 만큼 API가 실제 배포되었는가
- Swagger뿐 아니라 실제 응답과 프론트 런타임 검증이 일치하는가
- 변경 내용을 이 문서와 `마지막 동기화` 날짜에 반영했는가
