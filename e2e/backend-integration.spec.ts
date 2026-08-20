import { expect, test, type Page } from "@playwright/test";

const credentials = {
  seller: { email: process.env.E2E_SELLER_EMAIL, password: process.env.E2E_SELLER_PASSWORD },
  buyer: { email: process.env.E2E_BUYER_EMAIL, password: process.env.E2E_BUYER_PASSWORD },
};
const ready = Boolean(process.env.E2E_BACKEND_URL && credentials.seller.email && credentials.seller.password && credentials.buyer.email && credentials.buyer.password);

async function login(page: Page, account: typeof credentials.seller, next = "/") {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("이메일").fill(account.email!);
  await page.getByLabel("비밀번호").fill(account.password!);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(new RegExp(`${next.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
}

async function nextStep(page: Page) {
  await page.getByRole("button", { name: "다음 단계" }).click();
}

function readPoint(text: string | null) {
  const point = text?.replace(/[^\d]/g, "");
  return point ? Number(point) : 0;
}

async function createReportAndRecruitmentFixture(page: Page, projectName: string) {
  return page.evaluate(async ({ name }) => {
    const storedUser = window.sessionStorage.getItem("project-archive.auth-user.v2");
    const sellerUserId = storedUser ? (JSON.parse(storedUser) as { userId: number }).userId : null;
    if (!sellerUserId) throw new Error("판매자 세션 사용자 ID를 찾지 못했습니다.");

    const projectRequest = {
      sellerUserId,
      registrationPurpose: "REGISTER",
      projectName: name,
      description: "상세 리포트 이용권과 단기 파일 URL을 검증하는 E2E 전용 프로젝트입니다.",
      projectIdentityText: "유료 상세 리포트 본문과 첨부 데이터 파일 접근을 실제 결제로 검증합니다.",
      categories: ["데이터", "E2E"],
      developmentStatus: "COMPLETED",
      developmentStartDate: "2026-08-01",
      developmentEndDate: "2026-08-20",
      awardHistory: "",
      resultLevel: "SUBMISSION_OUTPUT",
      eventName: "E2E 전용 해커톤",
      eventType: "HACKATHON",
      eventHostOrganization: "Project Archive QA",
      eventStartedAt: "2026-08-01",
      eventEndedAt: "2026-08-31",
      problemAreas: ["리포트 접근 검증"],
      methods: ["Playwright E2E"],
      assetCategories: ["DATA"],
      detailPages: [{
        pageName: "E2E 상세 리포트",
        pageIntro: "구매 후에만 읽을 수 있는 검증용 리포트입니다.",
        pageContent: "리포트 본문과 파일 URL은 entitlement 확인 뒤에만 제공되어야 합니다.",
        visibility: "PAID",
        sortOrder: 0,
      }],
      links: [],
    };
    const formData = new FormData();
    formData.append("projectRegisterRequest", new Blob([JSON.stringify(projectRequest)], { type: "application/json" }));
    formData.append("projectIdentityText", projectRequest.projectIdentityText);
    formData.append("detailPageFiles[0]", new File(
      [JSON.stringify({ purpose: "report-file-access-e2e" })],
      "e2e-report.json",
      { type: "application/json" },
    ));
    const projectResponse = await fetch("/api/project-registration/basic", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const projectPayload = await projectResponse.json() as { success: boolean; message?: string; data?: { projectId: number } };
    if (!projectResponse.ok || !projectPayload.success || !projectPayload.data) {
      throw new Error(projectPayload.message ?? "리포트 E2E 프로젝트 등록 실패");
    }
    const projectId = projectPayload.data.projectId;

    const offerResponse = await fetch(`/api/projects/${projectId}/report-offer`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricePoint: 100, status: "ON_SALE", reportVersion: 1 }),
    });
    const offerPayload = await offerResponse.json() as { success?: boolean; message?: string };
    if (!offerResponse.ok || !offerPayload.success) {
      throw new Error(offerPayload.message ?? "리포트 판매 설정 실패");
    }

    const deadline = new Date();
    deadline.setUTCDate(deadline.getUTCDate() + 30);
    const recruitmentResponse = await fetch("/api/recruitments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        ownerUserId: sellerUserId,
        title: `${name} 팀원 모집`,
        description: "지원 상태와 마이페이지 반영을 검증합니다.",
        roles: ["프론트엔드"],
        headcount: 1,
        deadline: deadline.toISOString().slice(0, 10),
        requiredSkills: ["Playwright"],
        activitySchedule: "E2E 검증 기간",
        workMode: "ONLINE",
        applicationGuide: "지원 메시지를 작성해 주세요.",
      }),
    });
    const recruitmentPayload = await recruitmentResponse.json() as { success?: boolean; message?: string; data?: { id: number } };
    if (!recruitmentResponse.ok || !recruitmentPayload.success || !recruitmentPayload.data) {
      throw new Error(recruitmentPayload.message ?? "팀 모집 E2E 시드 생성 실패");
    }
    return { projectId, recruitmentId: recruitmentPayload.data.id };
  }, { name: projectName });
}

test.describe.serial("병합 백엔드 통합 흐름", () => {
  test.skip(!ready, "E2E_BACKEND_URL과 판매자·구매자 전용 계정이 모두 필요합니다.");
  const uniqueName = `E2E 전체양도 ${Date.now()}`;
  const reportProjectName = `E2E 리포트 ${Date.now()}`;
  let projectId = 0;
  let reportProjectId = 0;
  let buyerBalance = 0;

  test("판매자 로그인 → 프로젝트 등록 → 검색과 상세", async ({ page }) => {
    await login(page, credentials.seller, "/project-register");
    await page.locator("#eventType").selectOption("HACKATHON");
    await page.locator("#eventName").fill("E2E 전용 해커톤");
    await page.locator("#organizer").fill("Project Archive QA");
    await page.locator("#eventDate").fill("2026-08");
    await nextStep(page);

    await page.locator("#projectName").fill(uniqueName);
    await page.locator("#summary").fill("전체 양도와 리포트 결제를 검증하기 위한 전용 프로젝트입니다.");
    await page.locator("#projectStartedAt").fill("2026-08-01");
    await page.locator("#projectEndedAt").fill("2026-08-20");
    await page.locator('input[name="categories"]').first().check();
    await page.locator('input[name="problemAreas"]').first().check();
    await page.locator('input[name="methods"]').first().check();
    await nextStep(page);

    for (const [id, value] of Object.entries({
      problemDefinition: "프로젝트 거래 검증 과정에서 권리 범위가 불명확해지는 문제를 해결합니다.",
      targetAudience: "프로젝트를 안전하게 거래하려는 판매자와 구매자입니다.",
      solution: "상세 리포트와 프로젝트 전체 양도를 분리해 거래 범위를 명시합니다.",
      coreApproach: "멱등 결제와 거래 후 잔액 및 상태 재조회로 중복 거래를 방지합니다.",
      differentiation: "열람권과 소유권을 하나의 결제로 섞지 않습니다.",
      validation: "판매자와 구매자 계정의 실제 E2E 흐름으로 검증합니다.",
    })) await page.locator(`#${id}`).fill(value);
    await page.locator('input[name="resultLevel"][value="SUBMISSION_OUTPUT"]').check();
    await page.locator('input[name="activityStatus"][value="ACTIVE"]').check();
    await nextStep(page);

    await page.locator("#attempts").fill("등록과 검색, 상세, 구매 흐름을 순서대로 연결해 검증했습니다.");
    await page.locator("#limitations").fill("전용 환경의 시드와 계정 상태에 따라 초기 잔액이 달라질 수 있습니다.");
    await page.locator("#nextSteps").fill("배포 Swagger와 실제 응답을 반복 대조해야 합니다.");
    await page.getByRole("button", { name: "자산 추가" }).click();
    await page.locator('[id^="asset-"][id$="-category"]').selectOption("CODE_TECH");
    await page.locator('[id^="asset-"][id$="-title"]').fill("E2E 검증 소스");
    await page.locator('[id^="asset-"][id$="-role"]').fill("통합 흐름 검증에 사용하는 소스 자산");
    await page.locator('[id^="asset-"][id$="-description"]').fill("등록과 구매, 상세 접근을 재현하기 위한 테스트 자산입니다.");
    await page.locator('[id^="asset-"][id$="-link"]').fill("https://github.com/Project-Archive-Mutsa");
    await page.getByRole("button", { name: "링크 추가" }).click();
    await nextStep(page);

    await page.locator('input[name="purpose"][value="SELL"]').check();
    await page.locator("#desiredPoints").fill("100");
    await nextStep(page);
    await expect(page.getByText("등록 시 입력한")).toBeVisible();
    await page.locator("#materialDisclosureConsent input[type=checkbox]").check();
    await page.getByRole("button", { name: "프로젝트 등록" }).click();
    await expect(page.getByText(/등록 완료/)).toBeVisible();
    await expect(page.getByText(/정보 충실도 (미산정|\d+점)/)).toBeVisible();
    const detailHref = await page.getByRole("link", { name: "등록한 프로젝트 기록 보기" }).getAttribute("href");
    projectId = Number(detailHref?.split("/").at(-1));
    expect(projectId).toBeGreaterThan(0);
    await page.goto(`/projects?q=${encodeURIComponent(uniqueName)}`);
    await expect(page.getByRole("link", { name: uniqueName }).first()).toBeVisible();
    await page.goto(`/projects/${projectId}`);
    await expect(page.getByRole("heading", { name: uniqueName })).toBeVisible();
    const fixture = await createReportAndRecruitmentFixture(page, reportProjectName);
    reportProjectId = fixture.projectId;
    expect(reportProjectId).toBeGreaterThan(0);
  });

  test("구매자 포인트 충전 → 거래내역 반영", async ({ page }) => {
    await login(page, credentials.buyer, "/mypage/points");
    const balanceValue = page.getByText("사용 가능 포인트").locator("..").locator("dd");
    const balanceBefore = readPoint(await balanceValue.textContent());
    await page.getByLabel("충전할 포인트").fill("1000");
    await page.getByRole("button", { name: "충전하기" }).click();
    await expect(page.getByText("CHARGE").first()).toBeVisible();
    await expect.poll(async () => readPoint(await balanceValue.textContent())).toBe(balanceBefore + 1000);
    buyerBalance = balanceBefore + 1000;
  });

  test("프로젝트 전체 양도 구매 → 잔액·상태·거래내역", async ({ page }) => {
    await login(page, credentials.buyer, `/projects/${projectId}`);
    await page.getByRole("button", { name: "프로젝트 권리 구매" }).click();
    await expect(page.getByRole("dialog", { name: "프로젝트 구매 확인" })).toContainText("프로젝트 전체");
    await page.getByRole("button", { name: "프로젝트 구매", exact: true }).click();
    await expect(page.getByText(/결제 완료/)).toBeVisible();
    await page.goto("/mypage/points");
    await expect(page.getByText(uniqueName).first()).toBeVisible();
    await expect(page.getByText("사용 가능 포인트").locator("..").locator("dd")).toContainText((buyerBalance - 100).toLocaleString("ko-KR"));
    buyerBalance -= 100;
    await page.goto(`/projects/${projectId}`);
    await expect(page.getByText("현재 구매할 수 없는 판매 상태입니다.")).toBeVisible();
  });

  test("리포트 이용권 → 본문과 단기 파일 URL 접근", async ({ page }) => {
    await login(page, credentials.buyer, `/projects/${reportProjectId}`);
    const purchase = page.getByRole("button", { name: "리포트 이용권 구매" });
    await expect(purchase).toBeVisible();
    await purchase.click();
    await page.getByRole("button", { name: "이용권 구매" }).click();
    await expect(page.getByRole("link", { name: "상세 리포트 읽기" })).toBeVisible();
    await page.getByRole("link", { name: "상세 리포트 읽기" }).click();
    await expect(page.locator("#project-report")).toBeVisible();
    const fileButton = page.getByRole("button", { name: "파일 열기" }).first();
    await expect(fileButton).toBeEnabled();
    const popupPromise = page.waitForEvent("popup");
    await fileButton.click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded").catch(() => undefined);
    expect(popup.url()).toMatch(/^https:\/\//);
  });

  test("팀 지원·북마크 → 마이페이지 반영", async ({ page }) => {
    await login(page, credentials.buyer, `/projects/${reportProjectId}`);
    await page.getByRole("button", { name: `${reportProjectName} 관심 프로젝트 저장` }).click();
    await page.goto("/mypage/wishlist");
    await expect(page.getByText(reportProjectName).first()).toBeVisible();
    await page.goto(`/team-recruitment?q=${encodeURIComponent(reportProjectName)}`);
    const application = page.getByRole("button", { name: "지원하기" }).first();
    await expect(application).toBeVisible();
    const form = application.locator("xpath=ancestor::form");
    await form.getByLabel("지원 메시지").fill("E2E 지원 상태 반영을 검증합니다.");
    await application.click();
    await expect(page.getByText("지원이 접수되었습니다.")).toBeVisible();
    await page.goto("/mypage/team-applications");
    await expect(page.getByText(/검토 중|수락|거절/).first()).toBeVisible();
  });

  test("AI 검색 성공·부분 성공과 프로젝트 이동", async ({ page }) => {
    await page.goto("/search?q=%ED%99%98%EA%B2%BD");
    await expect(page.getByText(/분석 완료|부분 분석|분석 중/).first()).toBeVisible();
    const projectLink = page.locator('h3 a[href^="/projects/"]').first();
    await expect(projectLink).toHaveAttribute("href", /\/projects\/\d+/);
    await expect(page.getByText("유사한 이유").first()).toBeVisible();
  });
});
