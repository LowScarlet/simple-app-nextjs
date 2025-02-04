/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

'use client'

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { AuctionModel, useAdminAuction } from "@/model/adminAuction";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { mutate } from "swr";

const Portfolios = ({ dataPortfolio, isLoading }: { dataPortfolio?: AuctionModel[], isLoading: boolean }) => {
  const [isLoading2, setIsLoading2] = useState(false);

  const closeAuction = async (id: number) => {
    try {
      setIsLoading2(true);
      await axiosInstance.post(`/api/user/adminAuction/${id}/close`);
      mutate((key: string) => key.startsWith('/api/user/adminAuction/all'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading2(false);
    }
  };

  const deleteAuction = async (id: number) => {
    try {
      setIsLoading2(true);
      await axiosInstance.post(`/api/user/adminAuction/${id}/del`);
      mutate((key: string) => key.startsWith('/api/user/adminAuction/all'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading2(false);
    }
  };

  const makeDoneAuction = async (id: number) => {
    try {
      setIsLoading2(true);
      await axiosInstance.post(`/api/user/adminAuction/${id}/isDone`);
      mutate((key: string) => key.startsWith('/api/user/adminAuction/all'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading2(false);
    }
  };

  const makeIsPaidAuction = async (id: number) => {
    try {
      setIsLoading2(true);
      await axiosInstance.post(`/api/user/adminAuction/${id}/isPaid`);
      mutate((key: string) => key.startsWith('/api/user/adminAuction/all'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading2(false);
    }
  };

  const startAuction = async (id: number) => {
    try {
      setIsLoading2(true);
      await axiosInstance.post(`/api/user/adminAuction/${id}/start`);
      mutate((key: string) => key.startsWith('/api/user/adminAuction/all'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading2(false);
    }
  };

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
        Belum ada Pelelangan
      </div>
    )
  }
  return (
    <div className="z-0 space-y-2">
      {
        dataPortfolio?.map((item, index) => (
          <div className="block shadow-md py-2" key={index}>
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
                  <h1 className="font-bold text-sm">{item.bids.length > 0 ? item.bids[0].amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : item.startingBid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h1>
                  <div className="flex justify-between items-end mt-4">
                    <h1 className="font-bold text-xs">
                      {item.status}
                    </h1>
                    <h1 className="font-bold text-xs">Kode: {item.code}</h1>
                  </div>
                </div>
                <button className="block text-xl" onClick={()=>deleteAuction(item.id)} >
                  <MdDelete />
                </button>
              </div>
            </div>
            <div className="p-2 text-sm">
              <h1>Ubah Status:</h1>
              <div className="mt-2">
                {
                  item.status === 'OnGoing' ? (
                    <button onClick={() => closeAuction(item.id)} className="btn btn-neutral btn-xs">
                      Tutup Lelang
                    </button>
                  ) : (
                    item.status === 'Closed_Unpaid' ? (
                      <button onClick={() => makeIsPaidAuction(item.id)} className="btn btn-neutral btn-xs">
                        Pemenang Menyelesaikan Pembayaran
                      </button>
                    ) : (
                      item.status === 'Closed_OnSent' ? (
                        <button onClick={() => makeDoneAuction(item.id)} className="btn btn-neutral btn-xs">
                          Pemenang Telah Menerima Barang
                        </button>
                      ) : (
                        item.status === 'Unstarted' ? (
                          <button onClick={() => startAuction(item.id)} className="btn btn-neutral btn-xs">
                            Mulai Lelang
                          </button>
                        ) : (
                          item.status === 'Closed_OnPreparation' ? (
                            <button disabled className="btn btn-neutral btn-xs">
                              Sedang menunggu pemiliki lelang menyelesaikan pengiriman
                            </button>
                          ) : (
                            <h1 className="text-center text-xs">Pelelangan telah selesai.</h1>
                          )
                        )
                      )
                    )
                  )
                }
              </div>
            </div>
          </div>
        ))
      }
    </div >
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
  } = useAdminAuction();

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <h1 className="font-bold text-base">Manajemen Admin</h1>
      </div>
      <Portfolios dataPortfolio={dataPortfolio} isLoading={isLoading} />
    </div>
  );
}
