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

export const useAdminAuction = () => {
  const url = '/api/user/adminAuction/all';
  const { data, error, isLoading } = useSWR<AuctionModel[]>(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};