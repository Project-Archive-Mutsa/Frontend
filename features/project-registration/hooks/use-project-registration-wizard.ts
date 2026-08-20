"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/api-error";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { createRecruitment, registerProject } from "../api/register-project";
import { queryKeys } from "@/shared/query/query-keys";
import {
  getProjectRegistrationDraftKey,
  readProjectRegistrationDraft,
  storeProjectRegistrationDraft,
} from "../lib/draft-storage";
import { defaultProjectRegistrationDraft } from "../model/default-draft";
import type {
  AssetLinkProvider,
  DraftSaveStatus,
  ProjectAssetDraft,
  ProjectAwardDraft,
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
  ProjectRegistrationStep,
} from "../model/types";
import {
  findFirstInvalidRegistrationStep,
  validateProjectRegistrationStep,
} from "../model/validation";

let entitySequence = 0;

function createEntityId(prefix: string) {
  entitySequence += 1;
  return `${prefix}-${Date.now()}-${entitySequence}`;
}

function isHostnameWithin(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function focusFirstError(errors: ProjectRegistrationFieldErrors) {
  const firstField = Object.keys(errors)[0];
  if (!firstField) {
    return;
  }

  window.requestAnimationFrame(() => {
    Object.keys(errors).forEach((fieldName) => {
      const details = document.getElementById(fieldName)?.closest("details");
      if (details) {
        details.open = true;
      }
    });
    const summary = document.getElementById("registration-error-summary");
    if (summary) {
      summary.focus();
      summary.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const field = document.getElementById(firstField);
    field?.focus();
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

const backendRegistrationFieldMap: Record<
  string,
  { field: string; step: ProjectRegistrationStep }
> = {
  problemDefinition: { field: "problemDefinition", step: 3 },
  targetAudience: { field: "targetAudience", step: 3 },
  solution: { field: "solution", step: 3 },
  coreFunctions: { field: "coreApproach", step: 3 },
  differentiation: { field: "differentiation", step: 3 },
  validationSummary: { field: "validation", step: 3 },
  approaches: { field: "approaches", step: 4 },
  constraints: { field: "constraints", step: 4 },
  limitations: { field: "limitations", step: 4 },
  terminationReason: { field: "endReason", step: 4 },
  nextValidationTasks: { field: "nextValidationTasks", step: 4 },
  materialDisclosureConsent: { field: "materialDisclosureConsent", step: 6 },
};

function getBackendRegistrationErrors(error: unknown) {
  if (!(error instanceof ApiError)) return null;

  const mappedErrors = Object.entries(error.fieldErrors)
    .map(([backendField, message]) => {
      const mapping = backendRegistrationFieldMap[backendField];
      return mapping ? { ...mapping, message } : null;
    })
    .filter((entry) => entry !== null);

  if (!mappedErrors.length) return null;

  const step = Math.min(...mappedErrors.map((entry) => entry.step)) as
    ProjectRegistrationStep;
  const errors = Object.fromEntries(
    mappedErrors
      .filter((entry) => entry.step === step)
      .map((entry) => [entry.field, entry.message]),
  );

  return { step, errors };
}

export function detectAssetLinkProvider(url: string): AssetLinkProvider {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (isHostnameWithin(hostname, "figma.com")) return "FIGMA";
    if (isHostnameWithin(hostname, "github.com")) return "GITHUB";
    if (isHostnameWithin(hostname, "gitlab.com")) return "GITLAB";
    if (
      isHostnameWithin(hostname, "notion.so") ||
      isHostnameWithin(hostname, "notion.site")
    ) {
      return "NOTION";
    }
    if (
      isHostnameWithin(hostname, "drive.google.com") ||
      isHostnameWithin(hostname, "docs.google.com")
    ) {
      return "GOOGLE_DRIVE";
    }
    if (
      isHostnameWithin(hostname, "youtube.com") ||
      isHostnameWithin(hostname, "youtu.be")
    ) {
      return "YOUTUBE";
    }
    if (isHostnameWithin(hostname, "vimeo.com")) return "VIMEO";
  } catch {
    return "GENERAL";
  }
  return "GENERAL";
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function useProjectRegistrationWizard() {
  const { user } = useAuthSession();
  const queryClient = useQueryClient();
  const draftKey = getProjectRegistrationDraftKey(user?.userId);
  const [initialState] = useState(() =>
    readProjectRegistrationDraft(window.localStorage, draftKey),
  );
  const [draft, setDraft] = useState<ProjectRegistrationDraft>(
    initialState?.draft ?? defaultProjectRegistrationDraft,
  );
  const [step, setStep] = useState<ProjectRegistrationStep>(
    (initialState?.currentStep as ProjectRegistrationStep | undefined) ?? 1,
  );
  const [errors, setErrors] = useState<ProjectRegistrationFieldErrors>({});
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>(
    initialState ? "saved" : "idle",
  );
  const [savedAt, setSavedAt] = useState<string | null>(
    initialState?.savedAt ?? null,
  );
  const [representativeImageUrl, setRepresentativeImageUrl] = useState<string | null>(null);
  const hasChanged = useRef(false);
  const representativeImageFileRef = useRef<File | null>(null);
  const assetFilesRef = useRef<Map<string, File>>(new Map());
  const latestDraftRef = useRef(draft);
  const latestStepRef = useRef(step);
  const registrationMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("프로젝트를 등록하려면 먼저 로그인해 주세요.");
      return registerProject({ draft: latestDraftRef.current, userId: user.userId, representativeImage: representativeImageFileRef.current, assetFiles: assetFilesRef.current });
    },
    retry: false,
    onSuccess: async (result) => {
      if (result.recruitmentCreated !== false) {
        window.localStorage.removeItem(draftKey);
        hasChanged.current = false;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mypage.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all }),
      ]);
    },
    onError: (error) => {
      const backendErrors = getBackendRegistrationErrors(error);
      if (!backendErrors) return;

      setStep(backendErrors.step);
      setErrors(backendErrors.errors);
      focusFirstError(backendErrors.errors);
    },
  });
  const recruitmentRetryMutation = useMutation({
    mutationFn: async () => {
      const result = registrationMutation.data;
      if (!user || !result || result.recruitmentCreated !== false) throw new Error("재시도할 모집글이 없습니다.");
      return createRecruitment(result.project.projectId, latestDraftRef.current, user.userId);
    },
    retry: false,
    onSuccess: async () => {
      window.localStorage.removeItem(draftKey);
      hasChanged.current = false;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
      ]);
    },
  });

  useEffect(() => {
    latestDraftRef.current = draft;
    latestStepRef.current = step;
  }, [draft, step]);

  const persistLatestDraft = useCallback(
    (announceResult: boolean) => {
      try {
        const nextSavedAt = storeProjectRegistrationDraft(
          window.localStorage,
          draftKey,
          latestDraftRef.current,
          latestStepRef.current,
        );
        if (announceResult) {
          setSavedAt(nextSavedAt);
          setSaveStatus("saved");
        }
      } catch {
        if (announceResult) {
          setSaveStatus("unavailable");
        }
      }
    },
    [draftKey],
  );

  useEffect(() => {
    if (!hasChanged.current) {
      return;
    }

    setSaveStatus("saving");
    const timeoutId = window.setTimeout(() => {
      persistLatestDraft(true);
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [draft, persistLatestDraft, step]);

  useEffect(() => {
    const flushPendingDraft = () => {
      if (hasChanged.current) {
        persistLatestDraft(false);
      }
    };

    window.addEventListener("pagehide", flushPendingDraft);
    return () => {
      window.removeEventListener("pagehide", flushPendingDraft);
      flushPendingDraft();
    };
  }, [persistLatestDraft]);

  useEffect(
    () => () => {
      if (representativeImageUrl) {
        URL.revokeObjectURL(representativeImageUrl);
      }
    },
    [representativeImageUrl],
  );

  function markChanged() {
    hasChanged.current = true;
  }

  function clearError(field: string) {
    setErrors((previousErrors) => {
      if (!previousErrors[field]) {
        return previousErrors;
      }
      const nextErrors = { ...previousErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function updateField<Field extends keyof ProjectRegistrationDraft>(
    field: Field,
    value: ProjectRegistrationDraft[Field],
  ) {
    markChanged();
    clearError(String(field));
    if (field === "purpose") {
      clearError("materialDisclosureConsent");
    }
    setDraft((previousDraft) => ({
      ...previousDraft,
      [field]: value,
      ...(field === "purpose" && previousDraft.purpose !== value
        ? { materialDisclosureConsent: false }
        : {}),
    }));
  }

  function toggleListField(
    field:
      | "categories"
      | "problemAreas"
      | "methods"
      | "recruitmentRoles",
    value: string,
  ) {
    updateField(field, toggleValue(draft[field], value));
  }

  function addCustomTag(tag: string) {
    const normalizedTag = tag.trim();
    if (!normalizedTag || draft.customTags.includes(normalizedTag) || draft.customTags.length >= 5) {
      return;
    }
    updateField("customTags", [...draft.customTags, normalizedTag]);
  }

  function removeCustomTag(tag: string) {
    updateField(
      "customTags",
      draft.customTags.filter((item) => item !== tag),
    );
  }

  function addAward() {
    const award: ProjectAwardDraft = {
      id: createEntityId("award"),
      title: "",
      awardedAt: "",
    };
    updateField("awards", [...draft.awards, award]);
  }

  function updateAward(id: string, values: Partial<ProjectAwardDraft>) {
    updateField(
      "awards",
      draft.awards.map((award) => (award.id === id ? { ...award, ...values } : award)),
    );
  }

  function removeAward(id: string) {
    updateField(
      "awards",
      draft.awards.filter((award) => award.id !== id),
    );
  }

  function setRepresentativeImage(file: File | null) {
    markChanged();
    clearError("representativeImageName");
    if (representativeImageUrl) {
      URL.revokeObjectURL(representativeImageUrl);
    }
    representativeImageFileRef.current = file;
    setRepresentativeImageUrl(file ? URL.createObjectURL(file) : null);
    setDraft((previousDraft) => ({
      ...previousDraft,
      representativeImageName: file?.name ?? "",
    }));
  }

  function addAsset() {
    const asset: ProjectAssetDraft = {
      id: createEntityId("asset"),
      category: "",
      title: "",
      projectRole: "",
      description: "",
      versionLabel: "",
      updatedAt: "",
      sources: [],
    };
    updateField("assets", [...draft.assets, asset]);
  }

  function updateAsset(id: string, values: Partial<ProjectAssetDraft>) {
    updateField(
      "assets",
      draft.assets.map((asset) => (asset.id === id ? { ...asset, ...values } : asset)),
    );
  }

  function removeAsset(id: string) {
    markChanged();
    draft.assets
      .find((asset) => asset.id === id)
      ?.sources.forEach((source) => {
        if (source.kind === "UPLOAD") {
          assetFilesRef.current.delete(source.id);
        }
      });
    setDraft((previousDraft) => ({
      ...previousDraft,
      assets: previousDraft.assets.filter((asset) => asset.id !== id),
    }));
  }

  function addAssetFiles(assetId: string, files: FileList | null) {
    if (!files?.length) return;
    const asset = draft.assets.find((item) => item.id === assetId);
    if (!asset) return;
    clearError(`asset-${assetId}-sources`);
    const sources = [...asset.sources];
    const reattachedSourceIds = new Set<string>();

    Array.from(files).forEach((file) => {
      const detachedSourceIndex = sources.findIndex(
        (source) =>
          source.kind === "UPLOAD" &&
          source.needsReattach &&
          !reattachedSourceIds.has(source.id) &&
          source.fileName === file.name &&
          source.sizeInBytes === file.size,
      );

      if (detachedSourceIndex >= 0) {
        const detachedSource = sources[detachedSourceIndex];
        if (detachedSource.kind === "UPLOAD") {
          sources[detachedSourceIndex] = {
            ...detachedSource,
            needsReattach: false,
          };
          reattachedSourceIds.add(detachedSource.id);
          assetFilesRef.current.set(detachedSource.id, file);
        }
        return;
      }

      const sourceId = createEntityId("source");
      sources.push({
        id: sourceId,
        kind: "UPLOAD",
        fileName: file.name,
        sizeInBytes: file.size,
        needsReattach: false,
      });
      assetFilesRef.current.set(sourceId, file);
    });

    updateAsset(assetId, { sources });
  }

  function addAssetLink(
    assetId: string,
    url: string,
  ) {
    const asset = draft.assets.find((item) => item.id === assetId);
    if (!asset) return false;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") return false;
    } catch {
      return false;
    }
    clearError(`asset-${assetId}-sources`);
    updateAsset(assetId, {
      sources: [
        ...asset.sources,
        {
          id: createEntityId("source"),
          kind: "EXTERNAL_LINK",
          url: url.trim(),
          provider: detectAssetLinkProvider(url.trim()),
        },
      ],
    });
    return true;
  }

  function removeAssetSource(assetId: string, sourceId: string) {
    const asset = draft.assets.find((item) => item.id === assetId);
    if (!asset) return;
    assetFilesRef.current.delete(sourceId);
    updateAsset(assetId, {
      sources: asset.sources.filter((source) => source.id !== sourceId),
    });
  }

  function goToNextStep() {
    const nextErrors = validateProjectRegistrationStep(step, draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }
    if (step < 6) {
      markChanged();
      setStep((step + 1) as ProjectRegistrationStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToPreviousStep() {
    if (step > 1) {
      markChanged();
      setErrors({});
      setStep((step - 1) as ProjectRegistrationStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToCompletedStep(nextStep: ProjectRegistrationStep) {
    if (nextStep > step) return;
    markChanged();
    setErrors({});
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reviewAllSteps() {
    const invalidStep = findFirstInvalidRegistrationStep(draft);
    if (!invalidStep) return true;
    setStep(invalidStep.step);
    setErrors(invalidStep.errors);
    focusFirstError(invalidStep.errors);
    return false;
  }

  function discardDraft() {
    if (!window.confirm("이 브라우저에 저장된 프로젝트 작성 내용을 모두 지울까요?")) {
      return;
    }
    window.localStorage.removeItem(draftKey);
    if (representativeImageUrl) URL.revokeObjectURL(representativeImageUrl);
    representativeImageFileRef.current = null;
    assetFilesRef.current.clear();
    setRepresentativeImageUrl(null);
    setDraft(defaultProjectRegistrationDraft);
    setStep(1);
    setErrors({});
    setSavedAt(null);
    setSaveStatus("idle");
    hasChanged.current = false;
  }

  function submitRegistration() {
    if (!reviewAllSteps()) return;
    registrationMutation.mutate();
  }

  return {
    draft,
    step,
    errors,
    saveStatus,
    savedAt,
    representativeImageUrl,
    updateField,
    toggleListField,
    addCustomTag,
    removeCustomTag,
    addAward,
    updateAward,
    removeAward,
    setRepresentativeImage,
    addAsset,
    updateAsset,
    removeAsset,
    addAssetFiles,
    addAssetLink,
    removeAssetSource,
    goToNextStep,
    goToPreviousStep,
    goToCompletedStep,
    reviewAllSteps,
    discardDraft,
    submitRegistration,
    registrationMutation,
    recruitmentRetryMutation,
  };
}
