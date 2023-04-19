import { SetMetadata } from "@nestjs/common";
import { Policy } from "../policies/interfaces/policy.interface";

export const POLICY_KEY = 'policies'
export const Policies = (...policies: Policy[]) => SetMetadata(POLICY_KEY, policies)