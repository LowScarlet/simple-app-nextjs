'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { Auction, Bid, Category, User } from "@prisma/client";

export interface BidModel extends Bid {
  user: User;
}

export interface AuctionModel extends Auction {
  category: Category;
  user: User;
  bids: BidModel[];
}

export const useAuction = ({ categoryId }: { categoryId: number | null }) => {
  const url = categoryId ? `/api/user/auction/byCategory/${categoryId}` : '/api/user/auction/all';
  const { data, error, isLoading } = useSWR<AuctionModel[]>(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useAuctionDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<AuctionModel>('/api/user/auction/detail/' + `${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};