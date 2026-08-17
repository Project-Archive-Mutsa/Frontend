"use client";

import { useQueryClient } from "@tanstack/react-query";

import { signupPartsQueryOptions } from "./use-signup-parts";

export default function usePrefetchSignupParts() {
  const queryClient = useQueryClient();

  function prefetchSignupParts() {
    return queryClient.prefetchQuery(signupPartsQueryOptions);
  }

  return { prefetchSignupParts };
}
