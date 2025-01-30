/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Auth() {
  const { login } = useAuth();

  const [signinLoading, setSigninLoading] = useState(false);

  const defaultFormData = { phoneNumber: "", password: "" };

  const [formData, setFormData] = useState(defaultFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSigninLoading(true);

    try {
      const response = await axiosInstance.post("/api/auth/login", formData);

      login(response.data);
    } catch (err: any) {
      const { data } = err.response;
      const { message } = data;

      console.log(message);
    } finally {
      setSigninLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 min-h-svh">
      <h1 className="font-bold text-2xl">Masuk</h1>
      <p className="text-center text-sm">
        Silahkan Masukan Kredentials Yang Valid Untuk Melanjutkan!
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-12 w-full">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Nomor Telepon</span>
          </div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="8123456789"
            className="input-bordered w-full input"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Kata Sandi</span>
          </div>
          <input
            type="password"
            name="password"
            placeholder="@Password123"
            className="input-bordered w-full input"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <button
          type="submit"
          className={`mt-4 w-full btn btn-neutral ${signinLoading ? "loading" : ""}`}
        >
          {signinLoading ? "Memuat..." : "Masuk"}
        </button>
      </form>
      <Link href={"/auth/register"} className="mt-4 w-full btn">
        Daftar
      </Link>
    </div>
  );
}
