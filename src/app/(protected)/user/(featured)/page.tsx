'use client'

import { useAuth } from "@/context/AuthContext";
import { AuctionModel, useAuction } from "@/model/auction";
import { useCategory } from "@/model/category";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Auctions = ({ dataAuction, isLoading }: { dataAuction?: AuctionModel[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-32">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    )
  }
  if (!dataAuction || dataAuction.length <= 0) {
    return (
      <div className="my-32 text-center">
        Lelang Tidak Ditemukan!
      </div>
    )
  }
  return (
    <div className="gap-4 grid grid-cols-2 py-2">
      {
        dataAuction?.map((item, index) => (
          <Link href={`/user/auction/${item.id}`} key={index} className="bg-base-100 shadow-md rounded-md overflow-hidden">
            <figure>
              <Image
                width={500}
                height={300}
                src={item.icon || "/images/unknown4x4.png"}
                className="w-full h-24 object-cover"
                alt="Shoes" />
            </figure>
            <div className="p-2">
              <h2 className="text-xs">
                {!item.isOpen ? '[BERAKHIR]' : ''} {item.title}
              </h2>
              <h4 className="mt-2 font-bold text-xs">
                {item.bids.length > 0 ? item.bids[0].amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : item.startingBid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </h4>
            </div>
          </Link>
        ))
      }
    </div>
  )
}

export default function Home() {
  const [filterCategory, setFilterCategory] = useState<number | null>(null)

  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataAuction,
    isLoading: loadingAuction
  } = useAuction({ categoryId: filterCategory });

  const {
    data: dataCategory,
  } = useCategory();

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value ? parseInt(event.target.value) : null);
  };

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (<>
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <h1 className="font-bold text-base">List Lelang Terbuka</h1>
        <div className="flex justify-end items-center text-base">
          <select
            className="w-full select-bordered select-xs select"
            value={filterCategory || ''}
            onChange={handleCategoryChange}
          >
            <option value="">Semua</option>
            {
              dataCategory?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))
            }
          </select>
        </div>
      </div>
      <Auctions dataAuction={dataAuction} isLoading={loadingAuction} />
    </div>
  </>);
}
