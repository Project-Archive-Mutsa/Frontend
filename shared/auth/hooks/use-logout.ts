"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { logout } from "../api/logout";
import useAuthSession from "./use-auth-session";

export default function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signOut } = useAuthSession();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      signOut();
      await queryClient.cancelQueries();
      queryClient.removeQueries();
      router.refresh();
    },
  });
}
