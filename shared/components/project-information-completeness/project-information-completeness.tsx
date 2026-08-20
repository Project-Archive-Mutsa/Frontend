interface ProjectInformationCompletenessProps {
  projectName: string;
  score?: number | null;
}

function normalizeScore(score: number | null | undefined): number | null {
  if (score === null || score === undefined || !Number.isFinite(score)) {
    return null;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export default function ProjectInformationCompleteness({
  projectName,
  score,
}: ProjectInformationCompletenessProps) {
  const normalizedScore = normalizeScore(score);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-xs">
        <span className="font-medium text-slate-600">정보 충실도</span>
        <strong className="whitespace-nowrap tabular-nums text-slate-900">
          {normalizedScore === null ? "미산정" : `${normalizedScore} / 100`}
        </strong>
      </div>

      {normalizedScore === null ? (
        <div
          aria-hidden="true"
          className="mt-2 h-1.5 bg-slate-200"
        />
      ) : (
        <div
          role="meter"
          aria-label={`${projectName} 정보 충실도`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={normalizedScore}
          aria-valuetext={`${normalizedScore}점`}
          className="mt-2 h-1.5 overflow-hidden bg-slate-200"
        >
          <div
            className="h-full bg-brand-accent"
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function ProjectInformationCompletenessNotice() {
  return (
    <p className="text-xs leading-5 text-slate-500">
      정보 충실도는 문제 정의·해결 방식·근거와 자산 설명이 상세 확인에
      충분한지 보여줍니다. 현재 점수 데이터는{" "}
      <strong className="font-semibold text-slate-700">아직 미산정</strong>
      입니다.
    </p>
  );
}
