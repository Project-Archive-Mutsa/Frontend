import { z } from "zod";
import { defaultProjectRegistrationDraft } from "../model/default-draft";
import type { ProjectRegistrationDraft } from "../model/types";

const DRAFT_VERSION = 1;

const storedDraftSchema = z.object({
  version: z.literal(DRAFT_VERSION),
  savedAt: z.string(),
  currentStep: z.number().int().min(1).max(6),
  draft: z.record(z.string(), z.unknown()),
});

export function getProjectRegistrationDraftKey(userId?: number) {
  return `project-archive.project-registration-draft.v${DRAFT_VERSION}.${userId ?? "guest"}`;
}

export function readProjectRegistrationDraft(
  storage: Storage,
  key: string,
): { draft: ProjectRegistrationDraft; currentStep: number; savedAt: string } | null {
  try {
    const storedValue = storage.getItem(key);
    if (!storedValue) {
      return null;
    }

    const parsedValue = storedDraftSchema.safeParse(JSON.parse(storedValue));
    if (!parsedValue.success) {
      storage.removeItem(key);
      return null;
    }

    const storedDraft = parsedValue.data.draft;
    const legacyAttempts = storedDraft.attempts;
    const legacyDifficulties = storedDraft.difficulties;
    const legacyNextSteps = storedDraft.nextSteps;
    const currentStoredDraft = { ...storedDraft };
    delete currentStoredDraft.attempts;
    delete currentStoredDraft.difficulties;
    delete currentStoredDraft.nextSteps;
    delete currentStoredDraft.zombieAssetIds;
    delete currentStoredDraft.zombieAssetTerms;
    delete currentStoredDraft.saleAssetIds;
    delete currentStoredDraft.saleRightsScope;
    delete currentStoredDraft.fullTransferConfirmed;
    delete currentStoredDraft.recruitmentReferenceAssetIds;
    delete currentStoredDraft.transferAssetIds;
    delete currentStoredDraft.transferRightsScope;
    delete currentStoredDraft.transferMode;
    const legacyTransferMode = storedDraft.transferMode;
    const transferredPurpose =
      storedDraft.purpose === "TRANSFER"
        ? legacyTransferMode === "SALE"
          ? "SELL"
          : ""
        : storedDraft.purpose;
    const normalizedPurpose =
      transferredPurpose === "ARCHIVE" || transferredPurpose === "REGISTER"
        ? "ZOMBIE"
        : transferredPurpose;
    const assets = Array.isArray(storedDraft.assets)
      ? storedDraft.assets.map((asset) => {
          if (!asset || typeof asset !== "object") {
            return asset;
          }

          const typedAsset = asset as Record<string, unknown> & {
            sources?: unknown[];
          };
          const assetWithoutLegacyRights = { ...typedAsset };
          delete assetWithoutLegacyRights.ownershipStatus;
          delete assetWithoutLegacyRights.rightsDescription;
          return {
            ...assetWithoutLegacyRights,
            sources: Array.isArray(typedAsset.sources)
              ? typedAsset.sources.map((source) => {
                  if (!source || typeof source !== "object") {
                    return source;
                  }
                  const typedSource = source as Record<string, unknown> & {
                    kind?: string;
                  };
                  const sourceWithoutLegacyAccess = { ...typedSource };
                  delete sourceWithoutLegacyAccess.accessRequirement;
                  if (typedSource.kind === "UPLOAD") {
                    return {
                      ...sourceWithoutLegacyAccess,
                      needsReattach: true,
                    };
                  }
                  return sourceWithoutLegacyAccess;
                })
              : [],
          };
        })
      : [];

    return {
      draft: {
        ...defaultProjectRegistrationDraft,
        ...currentStoredDraft,
        purpose: normalizedPurpose,
        approaches:
          typeof currentStoredDraft.approaches === "string"
            ? currentStoredDraft.approaches
            : typeof legacyAttempts === "string"
              ? legacyAttempts
              : "",
        constraints:
          typeof currentStoredDraft.constraints === "string"
            ? currentStoredDraft.constraints
            : typeof legacyDifficulties === "string"
              ? legacyDifficulties
              : "",
        nextValidationTasks:
          typeof currentStoredDraft.nextValidationTasks === "string"
            ? currentStoredDraft.nextValidationTasks
            : typeof legacyNextSteps === "string"
              ? legacyNextSteps
              : "",
        materialDisclosureConsent:
          typeof storedDraft.materialDisclosureConsent === "boolean"
            ? storedDraft.materialDisclosureConsent
            : false,
        assets,
      } as ProjectRegistrationDraft,
      currentStep: parsedValue.data.currentStep,
      savedAt: parsedValue.data.savedAt,
    };
  } catch {
    return null;
  }
}

export function storeProjectRegistrationDraft(
  storage: Storage,
  key: string,
  draft: ProjectRegistrationDraft,
  currentStep: number,
) {
  const savedAt = new Date().toISOString();
  storage.setItem(
    key,
    JSON.stringify({ version: DRAFT_VERSION, savedAt, currentStep, draft }),
  );
  return savedAt;
}
