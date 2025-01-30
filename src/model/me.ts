'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { User } from "@prisma/client";

export const useMe = () => {
  const { data, error, isLoading } = useSWR<User>('/api/auth/me/', fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};