"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";

import { getSignupParts } from "../api/get-signup-parts";

const signupPartsQueryKey = ["signup-parts"] as const;

export const signupPartsQueryOptions = queryOptions({
  queryKey: signupPartsQueryKey,
  queryFn: getSignupParts,
  staleTime: 5 * 60 * 1000,
});

export default function useSignupParts() {
  const signupPartsQuery = useQuery(signupPartsQueryOptions);

  return {
    parts: signupPartsQuery.data ?? [],
    partsError: signupPartsQuery.error,
    isPartsPending: signupPartsQuery.isPending,
  };
}
