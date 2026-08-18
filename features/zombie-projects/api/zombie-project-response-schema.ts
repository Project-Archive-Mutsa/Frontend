import { z } from "zod";
import type { ZombieProjectResponseItem } from "@/features/zombie-projects/types";

export const zombieProjectResponseItemSchema: z.ZodType<ZombieProjectResponseItem> =
  z.object({
    projectId: z.number().int().nonnegative(),
    projectName: z.string(),
    description: z.string(),
    registeredDate: z.string(),
    representativeImageUrl: z.string().nullable(),
    tags: z.array(z.string()),
    viewCount: z.number().int().nonnegative(),
    likeCount: z.number().int().nonnegative(),
    bookmarkCount: z.number().int().nonnegative(),
    sellerName: z.string(),
    price: z.number().nonnegative(),
    zipFile: z
      .object({
        originalFileName: z.string(),
        fileSize: z.number().int().nonnegative(),
        downloadUrl: z.string(),
      })
      .nullable(),
    detailPath: z.string(),
  });
