/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { use, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuctionDetail } from "@/model/auction";
import { mutate } from "swr";

export default function Auction_Detail({ params }: { params: Promise<{ auctionId: number }> }) {
  const { auctionId } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoinButton, setIsJoinButton] = useState(false);
  const [isOwnerSetting, setIsOwnerSetting] = useState(false);
  const [resiNumber, setResiNumber] = useState('');

  const { user: authUser, isAuthenticated } = useAuth();
  const { data: dataAuction, isLoading: loadingAuctionDetail } = useAuctionDetail(auctionId);

  if (loadingAuctionDetail) {
    return (
      <div className="flex justify-center items-center bg-base-100 min-h-svh">
        <div className="flex flex-col items-center gap-4">
          <span className="text-primary loading loading-lg loading-spinner"></span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !authUser || !dataAuction) {
    return <>Error</>;
  }

  const startAuction = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/api/user/auction/detail/${auctionId}/start`);
      mutate((key: string) => key.startsWith('/api/user/auction/detail/'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAuction = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/api/user/auction/detail/${auctionId}/close`);
      mutate((key: string) => key.startsWith('/api/user/auction/detail/'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinAuction = async (amount: number) => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/api/user/auction/detail/${auctionId}/addBid`, {
        amount
      });
      mutate((key: string) => key.startsWith('/api/user/auction/detail/'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sentStuff = async (resi: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/api/user/auction/detail/${auctionId}/sentStuff`, {
        resi
      });
      mutate((key: string) => key.startsWith('/api/user/auction/detail/'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between px-4 pt-4 pb-2 text-xl">
        <Link href={"/user"} className="btn btn-circle btn-ghost btn-sm">
          <FaArrowLeft />
        </Link>
        <Link href={""} className="btn btn-circle btn-ghost btn-sm">
          <BsThreeDotsVertical />
        </Link>
      </div>
      <div className="space-y-2 pb-8 min-h-svh">
        <div className="shadow-md py-2">
          <Image
            width={1000}
            height={225}
            src={dataAuction.icon || "/images/unknown4x4.png"}
            className="w-full"
            alt={"Image"}
          />
          <div className="p-2">
            <h1 className="font-bold text-2xl">
              {dataAuction.bids.length > 0 ? dataAuction.bids[0].amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : dataAuction.startingBid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </h1>
            <h2 className="pt-2 text-sm">{dataAuction.title}</h2>
          </div>
        </div>
        {
          !dataAuction.isOpen && dataAuction.bids.length > 0 && dataAuction.bids[0].user.id === authUser.id ? (
            dataAuction.status === 'Closed_Unpaid' ? (
              <div role="alert" className="flex flex-col justify-center items-center text-center alert alert-error">
                <span>Kamu telah memenangkan lelang ini!, Silahkan untuk menyelesaikan pembayaran!</span>
                <span>BRI: 0023 4567 8910 234 <br />ATAS NAMA: PT. LELANG YUK SEJAHTERA</span>
                <span>Kirim Bukti Pembayaran Dengan Kode Lelang <b>{dataAuction.code}</b> ke Whatsapp: 08123456789</span>
              </div>
            ) : (
              dataAuction.status === 'Closed_Done' ? (
                <div role="alert" className="alert alert-success">
                  <span>Transaksi telah diselesaikan!</span>
                </div>
              ) : (
                <div role="alert" className="alert alert-success">
                  <span>Kamu telah menyelesaikan pembayaran, Barang akan segera dikirim!</span>
                </div>
              )
            )
          ) : undefined
        }
        {
          dataAuction.bids.length > 0 && !dataAuction.isOpen && dataAuction.userId === authUser.id ? (
            dataAuction.resi ? (
              dataAuction.status === 'Closed_OnSent' ? (
                <div role="alert" className="alert alert-success">
                  <span>Kamu telah menyelesaikan pengiriman, Sedang menunggu pihak ekspedisi untuk menyelesaikan pengiriman!</span>
                </div>
              ) : (
                <div role="alert" className="alert alert-success">
                  <span>Transaksi telah berhasil diselesaikan!</span>
                </div>
              )
            ) : (
              dataAuction.status === 'Closed_Unpaid' ? (
                <div role="alert" className="alert alert-warning">
                  <span>Menunggu Pemenang untuk menyelesaikan pembayaran!</span>
                </div>
              ) : (

                <div role="alert" className="alert alert-warning">
                  <span>Pemenang telah menyelesaikan pembayaran, Silahkan kirim barang setelah itu submit Kode Resi di Manajemen Penyelenggara!</span>
                </div>
              )
            )
          ) : undefined
        }
        {
          !dataAuction.isOpen && dataAuction.bids.length > 0 ? (
            <div className="shadow-md p-2">
              <h1 className="font-bold text-base">Pemenang Lelang</h1>
              <div className="px-2 text-sm">
                <div className="flex py-2 border-b border-base-content">
                  <div className="min-w-32">Nama</div>
                  <div className="w-full font-medium">{dataAuction.bids[0].user.fullName}</div>
                </div>
                <div className="flex py-2 border-b border-base-content">
                  <div className="min-w-32">Penawaran</div>
                  <div className="w-full font-medium">{dataAuction.bids[0].amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                </div>
              </div>
            </div>
          ) : undefined
        }
        <div className="shadow-md p-2">
          <h1 className="font-bold text-base">Detail Lelang</h1>
          <div className="px-2 text-sm">
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Status</div>
              <div className="w-full font-medium">{dataAuction.isOpen ? dataAuction.status : 'Telah Berakhir'}</div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Metode</div>
              <div className="w-full font-medium">{dataAuction.method}</div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Kategori</div>
              <div className="w-full font-medium">{dataAuction.category.name || 'Lainnya...'}</div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Jaminan Lelang</div>
              <div className="w-full font-medium">{dataAuction.startingBid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Batas Jaminan</div>
              <div className="w-full font-medium">
                {new Date(dataAuction.endsAt).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Penyelenggara</div>
              <div className="w-full font-medium">{dataAuction.user.fullName}</div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Kode Lelang</div>
              <div className="w-full font-medium">{dataAuction.code}</div>
            </div>
          </div>
        </div>
        <div className="shadow-md p-2">
          <h1 className="font-bold text-base">Deskripsi Lelang</h1>
          <p className="px-2 text-xs">{dataAuction.description || 'Deskripsi Tidak Tersedia.'}</p>
        </div>
        <div className="shadow-md p-2">
          <h1 className="font-bold text-base">Para Penawar</h1>
          <div className="px-2 text-sm">
            {dataAuction.bids.length > 0 ? (
              dataAuction.bids.map((bid) => (
                <div key={bid.id} className="flex py-2">
                  <div className="min-w-32">
                    {dataAuction.method === 'Open_Bid'
                      ? bid.user.fullName
                      : bid.user.fullName.slice(0, 3) + '*'.repeat(bid.user.fullName.length - 3)}
                  </div>
                  <div className="w-full font-medium">{bid.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                </div>
              ))
            ) : (
              <div className="py-2 text-center">
                Belum ada penawar
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bottom-0 sticky bg-base-100 p-2">
        {
          authUser.id === dataAuction.userId ? (
            <div>
              {
                isOwnerSetting ? (
                  <div>
                    <div className="flex justify-between items-center">
                      <h1 className="font-bold text-lg">Manajemen Penyelenggara</h1>
                      <button onClick={() => setIsOwnerSetting(false)} className="btn btn-circle btn-ghost btn-sm">
                        <FaArrowLeft />
                      </button>
                    </div>
                    <div className="gap-2 grid grid-cols-2 py-2">
                      <button className={"btn btn-neutral btn-sm grow"} disabled={!dataAuction.isOpen} onClick={() => closeAuction()}>Tutup Lelang</button>
                      <button className={"btn btn-neutral btn-sm grow"} disabled={!dataAuction.isOpen || dataAuction.status != 'Unstarted'} onClick={() => startAuction()}>Mulai Lelang</button>
                    </div>
                    {
                      dataAuction.resi ? (
                        <button className={"btn btn-neutral btn-sm w-full"} disabled>
                          {
                            dataAuction.status === 'Closed_OnSent' ? 'Barang Dalam Perjalanan' : (
                              dataAuction.status === 'Closed_Done' ? 'Barang Diterima' : 'Error1'
                            )
                          }
                        </button>
                      ) : (
                        <div>
                          <h1 className="mb-2 font-bold text-sm">Kirim Barang</h1>
                          <label className="flex items-center gap-2 input-bordered input input-sm">
                            Resi
                            <input
                              type="text"
                              className="grow"
                              placeholder="1D2P3"
                              onChange={(e) => {
                                const input = e.target as HTMLInputElement;
                                setResiNumber(input.value);
                              }}
                            />
                            <button onClick={() => sentStuff(resiNumber)} className={"btn btn-sm grow"} disabled={dataAuction.status === 'Closed_Unpaid' || dataAuction.status === 'Closed_NoBid' || dataAuction.isOpen}>Kirim</button>
                          </label>
                          {
                            dataAuction.status === 'Closed_Unpaid' ?
                              <h1 className="my-2 text-error text-xs">Pemenang belum menyelesaikan pembayaran.</h1> : undefined
                          }
                        </div>
                      )
                    }
                    <div className="form-control pb-2">
                      <label className="cursor-pointer label">
                        <span className="label-text">Saya menyetujui Syarat Dan Ketentuan Aplikasi</span>
                        <input type="checkbox" defaultChecked disabled className="checkbox checkbox-success" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <button className="btn-block btn btn-primary" onClick={() => setIsOwnerSetting(true)}>
                    Manajemen Penyelenggara
                  </button>
                )
              }
            </div >
          ) : (
            !isJoinButton ? (
              dataAuction.isOpen ? (
                dataAuction.status === 'Unstarted' ? (
                  <button className="btn-block btn btn-ghost" disabled>
                    Lelang Belum Dimulai
                  </button>
                ) : (
                  <button className="btn-block btn btn-primary" disabled={isLoading} onClick={() => setIsJoinButton(true)}>
                    {isLoading ? 'Loading...' : 'Ikut Lelang'}
                  </button>
                )
              ) : (
                <button className="btn-block btn btn-ghost" disabled>
                  Lelang Telah Berakhir
                </button>
              )
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-lg">Pilih Nilai Penawaran</h1>
                  <button onClick={() => setIsJoinButton(false)} className="btn btn-circle btn-ghost btn-sm">
                    <FaArrowLeft />
                  </button>
                </div>
                <div className="gap-2 grid grid-cols-2 py-2">
                  {
                    Array.from({ length: 6 }, (_, i) => (dataAuction.bids[0]?.amount || dataAuction.startingBid) + (i + 1) * 50000).map((amount) => (
                      <button key={amount} onClick={() => joinAuction(amount)} className={"btn btn-neutral btn-sm grow"}>{amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</button>
                    ))
                  }
                </div>
                <div className="form-control pb-2">
                  <label className="cursor-pointer label">
                    <span className="label-text">Saya menyetujui Syarat Dan Ketentuan Aplikasi</span>
                    <input type="checkbox" defaultChecked disabled className="checkbox checkbox-success" />
                  </label>
                </div>
              </div>
            )
          )
        }
      </div >
    </>
  );
}
