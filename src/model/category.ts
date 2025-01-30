'use client'

import fetcher from "@/lib/fetcher";
import { Category } from "@prisma/client";
import useSWR from "swr";

export const useCategory = () => {
  const { data, error, isLoading } = useSWR<Category[]>('/api/user/category/all', fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};