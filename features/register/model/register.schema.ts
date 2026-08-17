import { z } from "zod";

import { registerAccountStepSchema } from "../components/steps/account/model/register-account-step.schema";
import { registerInterestStepSchema } from "../components/steps/interest/model/register-interest-step.schema";
import { registerProfileStepSchema } from "../components/steps/profile/model/register-profile-step.schema";

export const registerSchema = registerAccountStepSchema
  .safeExtend(registerProfileStepSchema.shape)
  .safeExtend(registerInterestStepSchema.shape);

export type RegisterRequest = z.infer<typeof registerSchema>;
