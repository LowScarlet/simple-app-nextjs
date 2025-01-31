/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

'use client'

import { useAuth } from "@/context/AuthContext";
import { AuctionModel, usePortfolio } from "@/model/portfolio";
import { User } from "@prisma/client";
import Link from "next/link";

const Portfolios = ({ dataPortfolio, isLoading, authUser }: { dataPortfolio?: AuctionModel[], isLoading: boolean, authUser: User }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-32">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    )
  }
  if (!dataPortfolio || dataPortfolio.length <= 0) {
    return (
      <div className="my-32 text-center">
        Kamu Belum Mengikuti Pelelangan Apapun, Yuk Ikuti Pelelangan Sekarang!
      </div>
    )
  }
  return (
    <div className="z-0 space-y-2">
      {
        dataPortfolio?.map((item, index) => (
          <Link href={'/user/auction/' + item.id} className="block shadow-md py-2" key={index}>
            <div className="flex gap-2 p-2">
              <div className="flex-none">
                <div className="avatar">
                  <div className="rounded w-12">
                    <img src={item.icon || "/images/unknown4x4.png"} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between grow">
                <div className="grow">
                  <h2 className="text-sm">{item.title}</h2>
                  <h1 className="font-bold text-sm">Nilai: {item.bids.length > 0 ? item.bids[0].amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : item.startingBid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h1>
                  {
                    item.resi ? (
                      <h1 className="mt-4 font-medium text-xs">Resi: {item.resi}</h1>
                    ) : undefined
                  }
                  <div className="flex justify-between items-end mt-4">
                    <button className="btn btn-neutral btn-xs">
                      {
                        item.isOpen ? (
                          item.status
                        ) : (
                          item.bids[0].userId === authUser.id ? (
                            item.status
                          ) : (
                            'Kalah - Telah Berakhir'
                          )
                        )
                      }
                    </button>
                    <h1 className="font-medium text-xs">Anda: <span>{item.bids.filter(bid => bid.userId === authUser.id)[0].amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span></h1>
                  </div>
                </div>
              </div>
            </div>
            {
              item.bids[0].userId === authUser.id && item.status === 'Closed_Unpaid' ? (
                <div role="alert" className="alert alert-warning">
                  <span>Kamu Memenangkan Lelang ini, Klik untuk menyelesaikan pembayaran!</span>
                </div>
              ) : undefined
            }
          </Link>
        ))
      }
    </div>
  )
}

export default function Portfolio() {
  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataPortfolio,
    isLoading
  } = usePortfolio();

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <h1 className="font-bold text-base">Portfolio Saya</h1>
      </div>
      <Portfolios dataPortfolio={dataPortfolio} isLoading={isLoading} authUser={authUser} />
    </div>
  );
}
