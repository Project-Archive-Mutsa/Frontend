"use client";

import { useMutation } from "@tanstack/react-query";
import { getProjectReportFile } from "../api/get-project-report-file";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

export default function ProjectReportFileButton({ projectId, fileId }: { projectId: number; fileId: number }) {
  const mutation = useMutation({
    mutationFn: () => getProjectReportFile(projectId, fileId),
    retry: false,
    onSuccess: (file) => window.open(file.signedUrl, "_blank", "noopener,noreferrer"),
  });
  return (
    <div className="shrink-0 text-right">
      <button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending} className="inline-flex min-h-9 items-center gap-2 text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 disabled:opacity-60">
        {mutation.isPending ? <LoadingSpinner size={14} /> : null}
        {mutation.isPending ? "URL 발급 중" : "파일 열기"}
      </button>
      {mutation.isError ? <p role="alert" className="mt-1 max-w-48 text-xs text-red-700">{mutation.error.message}</p> : null}
    </div>
  );
}
