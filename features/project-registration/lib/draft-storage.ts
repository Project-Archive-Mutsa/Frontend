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
    const legacyTransferMode = storedDraft.transferMode;
    const legacyTransferAssetIds = storedDraft.transferAssetIds;
    const legacyTransferRightsScope = storedDraft.transferRightsScope;
    const normalizedPurpose =
      storedDraft.purpose === "TRANSFER"
        ? legacyTransferMode === "SALE"
          ? "SELL"
          : ""
        : storedDraft.purpose;
    const assets = Array.isArray(storedDraft.assets)
      ? storedDraft.assets.map((asset) => {
          if (!asset || typeof asset !== "object") {
            return asset;
          }

          const typedAsset = asset as { sources?: unknown[] };
          return {
            ...typedAsset,
            sources: Array.isArray(typedAsset.sources)
              ? typedAsset.sources.map((source) => {
                  if (!source || typeof source !== "object") {
                    return source;
                  }
                  const typedSource = source as { kind?: string };
                  return typedSource.kind === "UPLOAD"
                    ? { ...typedSource, needsReattach: true }
                    : typedSource;
                })
              : [],
          };
        })
      : [];

    return {
      draft: {
        ...defaultProjectRegistrationDraft,
        ...storedDraft,
        purpose: normalizedPurpose,
        saleAssetIds:
          legacyTransferMode === "SALE" && Array.isArray(legacyTransferAssetIds)
            ? legacyTransferAssetIds.filter((assetId): assetId is string => typeof assetId === "string")
            : Array.isArray(storedDraft.saleAssetIds)
              ? storedDraft.saleAssetIds.filter((assetId): assetId is string => typeof assetId === "string")
              : [],
        saleRightsScope:
          legacyTransferMode === "SALE" && typeof legacyTransferRightsScope === "string"
            ? legacyTransferRightsScope
            : typeof storedDraft.saleRightsScope === "string"
              ? storedDraft.saleRightsScope
              : "",
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
