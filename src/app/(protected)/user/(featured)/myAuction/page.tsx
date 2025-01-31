/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

'use client'

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useCategory } from "@/model/category";
import { AuctionModel, useMyAuction } from "@/model/myAuction";
import { AuctionMethod } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const MyAuctions = ({ dataMyAuction, isLoading }: { dataMyAuction?: AuctionModel[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-32">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    )
  }
  if (!dataMyAuction || dataMyAuction.length <= 0) {
    return (
      <div className="my-32 text-center">
        Kamu Belum Memiliki Pelelangan Apapun, Yuk Buat Lelang Sekarang!
      </div>
    )
  }
  return (
    <div className="z-0 space-y-2">
      {
        dataMyAuction?.map((item, index) => (
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
                      {item.status}
                    </button>
                    <h1 className="font-medium text-xs">{item.bids.length}x Penawaran</h1>
                  </div>
                </div>
              </div>
            </div>
            {
              item.status === 'Closed_OnPreparation' && !item.resi ? (
                <div role="alert" className="alert alert-warning">
                  <span>Pemenang telah menyelesaikan pembayaran, Klik untuk menyelesaikan lelang!</span>
                </div>
              ) : undefined
            }
          </Link>
        ))
      }
    </div>
  )
}

export default function MyAuction() {
  const router = useRouter();
  const [createMenu, setCreateMenu] = useState(false)

  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataMyAuction,
  } = useMyAuction();

  const {
    data: categories,
  } = useCategory();

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    startingBid: 0,
    endsAt: '',
    method: '',
    categoryId: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'startingBid' || name === 'categoryId'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axiosInstance.post('/api/user/myAuction/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setFormData(prev => ({
            ...prev,
            icon: response.data.filepath
          }));
        }
      } catch (error) {
        alert('Error uploading image: ' + (error as Error).message);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert the datetime to ISO string with timezone
      const endsAtDate = new Date(formData.endsAt);
      
      const formattedData = {
        ...formData,
        endsAt: endsAtDate.toISOString(), // This will format to full ISO-8601 with timezone
        categoryId: isNewCategory ? undefined : formData.categoryId,
        newCategory
      };

      const response = await axiosInstance.post(`/api/user/myAuction/create`, formattedData);

      if (response.status === 200) {
        mutate((key: string) => key.startsWith('/api/user/myAuction'));
        router.push('/user/auction/'+response.data.id);
      }
    } catch (error) {
      alert('Error updating product: ' + (error as Error).message);
    }
  };

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (<>
    {
      createMenu ? (
        <div className="px-4 py-2">
          <div className="flex justify-between">
            <h1 className="font-bold text-base">Buat Lelang</h1>
            <button onClick={() => setCreateMenu(false)} className="btn btn-neutral btn-sm">Batal</button>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-2 p-4 pb-32 min-h-svh">
              <div>
                <Image
                  width={1000}
                  height={225}
                  src={formData.icon || "/images/unknown4x4.png"}
                  className="w-full"
                  alt={"Product Image"}
                  priority
                />
              </div>
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Foto Lelang</span>
                  </div>
                  <input
                    type="file"
                    className="file-input-bordered w-full file-input"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Nama Lelang</span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nama Lelang"
                    className="input-bordered w-full input"
                  />
                </label>
              </div>
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Deskripsi Lelang</span>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea-bordered h-24 textarea"
                    placeholder="Deskripsi Barang"
                  ></textarea>
                </label>
              </div>
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Nilai Awal</span>
                  </div>
                  <input
                    type="number"
                    name="startingBid"
                    value={formData.startingBid}
                    onChange={handleInputChange}
                    placeholder="Nilai Awal"
                    className="input-bordered w-full input"
                  />
                </label>
              </div>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Metode Lelang</span>
                </div>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full select-bordered select"
                >
                  <option value="">Pilih Metode</option>
                  {Object.values(AuctionMethod).map((method: string) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </label >
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Tanggal Berakhir</span>
                  </div>
                  <input
                    type="datetime-local"
                    name="endsAt"
                    value={formData.endsAt}
                    onChange={handleInputChange}
                    className="input-bordered w-full input"
                  />
                </label>
              </div>
              <div>
                {
                  isNewCategory ? (
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Nama Kategori</span>
                      </div>
                      <input
                        type="text"
                        name="category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nama Kategori"
                        className="input-bordered w-full input"
                      />
                    </label>
                  ) : (
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Kategori</span>
                      </div>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full select-bordered select"
                      >
                        <option value="">Pilih Kategori</option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label >
                  )
                }
              </div >
              <div>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">Buat Kategori Baru</span>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={isNewCategory}
                      onChange={(e) => {
                        setIsNewCategory(e.target.checked);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full btn btn-primary">
                  Buat Lelang
                </button>
              </div>
            </form >
          </div>
        </div>
      ) : (
        <div className="px-4 py-2">
          <div className="flex justify-between">
            <h1 className="font-bold text-base">Lelang Saya</h1>
            <button onClick={() => setCreateMenu(true)} className="btn btn-neutral btn-sm">Buat Lelang</button>
          </div>
          <MyAuctions 
            dataMyAuction={dataMyAuction} 
            isLoading={false} 
          />
        </div>
      )
    }
  </>);
}
