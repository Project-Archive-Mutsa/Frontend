"use client";

import { useEffect, useRef, useState } from "react";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import {
  getProjectRegistrationDraftKey,
  readProjectRegistrationDraft,
  storeProjectRegistrationDraft,
} from "../lib/draft-storage";
import { defaultProjectRegistrationDraft } from "../model/default-draft";
import type {
  AssetAccessRequirement,
  AssetLinkProvider,
  DraftSaveStatus,
  ProjectAssetDraft,
  ProjectAwardDraft,
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
  ProjectRegistrationStep,
  ZombieAssetTermsDraft,
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

export function detectAssetLinkProvider(url: string): AssetLinkProvider {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname === "figma.com" || hostname.endsWith(".figma.com")) return "FIGMA";
    if (hostname === "github.com" || hostname.endsWith(".github.com")) return "GITHUB";
    if (hostname === "gitlab.com" || hostname.endsWith(".gitlab.com")) return "GITLAB";
    if (hostname === "notion.so" || hostname.endsWith(".notion.site")) return "NOTION";
    if (hostname === "drive.google.com" || hostname === "docs.google.com") return "GOOGLE_DRIVE";
    if (hostname === "youtube.com" || hostname === "youtu.be") return "YOUTUBE";
    if (hostname === "vimeo.com" || hostname.endsWith(".vimeo.com")) return "VIMEO";
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

  useEffect(() => {
    if (!hasChanged.current) {
      return;
    }

    setSaveStatus("saving");
    const timeoutId = window.setTimeout(() => {
      try {
        const nextSavedAt = storeProjectRegistrationDraft(
          window.localStorage,
          draftKey,
          draft,
          step,
        );
        setSavedAt(nextSavedAt);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unavailable");
      }
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [draft, draftKey, step]);

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
    setDraft((previousDraft) => ({ ...previousDraft, [field]: value }));
  }

  function toggleListField(
    field:
      | "categories"
      | "problemAreas"
      | "methods"
      | "recruitmentRoles"
      | "zombieAssetIds"
      | "saleAssetIds"
      | "recruitmentReferenceAssetIds",
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
      ownershipStatus: "",
      rightsDescription: "",
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
    setDraft((previousDraft) => ({
      ...previousDraft,
      assets: previousDraft.assets.filter((asset) => asset.id !== id),
      zombieAssetIds: previousDraft.zombieAssetIds.filter((assetId) => assetId !== id),
      zombieAssetTerms: Object.fromEntries(
        Object.entries(previousDraft.zombieAssetTerms).filter(([assetId]) => assetId !== id),
      ),
      saleAssetIds: previousDraft.saleAssetIds.filter((assetId) => assetId !== id),
      recruitmentReferenceAssetIds: previousDraft.recruitmentReferenceAssetIds.filter(
        (assetId) => assetId !== id,
      ),
    }));
  }

  function addAssetFiles(assetId: string, files: FileList | null) {
    if (!files?.length) return;
    const asset = draft.assets.find((item) => item.id === assetId);
    if (!asset) return;
    const fileSources = Array.from(files).map((file) => ({
      id: createEntityId("source"),
      kind: "UPLOAD" as const,
      fileName: file.name,
      sizeInBytes: file.size,
      needsReattach: false,
    }));
    updateAsset(assetId, { sources: [...asset.sources, ...fileSources] });
  }

  function addAssetLink(
    assetId: string,
    url: string,
    accessRequirement: AssetAccessRequirement,
  ) {
    const asset = draft.assets.find((item) => item.id === assetId);
    if (!asset) return false;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") return false;
    } catch {
      return false;
    }
    updateAsset(assetId, {
      sources: [
        ...asset.sources,
        {
          id: createEntityId("source"),
          kind: "EXTERNAL_LINK",
          url: url.trim(),
          provider: detectAssetLinkProvider(url.trim()),
          accessRequirement,
        },
      ],
    });
    return true;
  }

  function removeAssetSource(assetId: string, sourceId: string) {
    const asset = draft.assets.find((item) => item.id === assetId);
    if (!asset) return;
    updateAsset(assetId, {
      sources: asset.sources.filter((source) => source.id !== sourceId),
    });
  }

  function updateZombieAssetTerms(
    assetId: string,
    values: Partial<ZombieAssetTermsDraft>,
  ) {
    markChanged();
    clearError(`zombie-${assetId}-license`);
    clearError(`zombie-${assetId}-terms`);
    setDraft((previousDraft) => {
      const currentTerms = previousDraft.zombieAssetTerms[assetId] ?? {
        licenseName: "",
        attribution: "",
        reuseTerms: "",
      };
      return {
        ...previousDraft,
        zombieAssetTerms: {
          ...previousDraft.zombieAssetTerms,
          [assetId]: {
            ...currentTerms,
            ...values,
          },
        },
      };
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
    setRepresentativeImageUrl(null);
    setDraft(defaultProjectRegistrationDraft);
    setStep(1);
    setErrors({});
    setSavedAt(null);
    setSaveStatus("idle");
    hasChanged.current = false;
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
    updateZombieAssetTerms,
    goToNextStep,
    goToPreviousStep,
    goToCompletedStep,
    reviewAllSteps,
    discardDraft,
  };
}
