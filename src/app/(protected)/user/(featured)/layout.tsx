'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdLogout, MdOutlineAdminPanelSettings } from "react-icons/md";
import Cookies from 'js-cookie';
import { useAuth } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (
    <>
      <div className="px-4 pt-4">
        <h3 className="font-medium text-xs">Hi, {authUser.fullName}</h3>
        <div className="flex justify-between">
          <h1 className="font-bold text-xl">LelangYuk</h1>
          <div className="flex justify-end items-center gap-x-4 text-xl">
            {
              authUser.role === 'Admin' ? (
                <Link href={'/user/admin'}>
                  <MdOutlineAdminPanelSettings />
                </Link>
              ) : undefined
            }
            <button onClick={() => {
              Cookies.remove('userId');
              window.location.reload();
            }}>
              <MdLogout />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2">
        <Image
          width={1000}
          height={225}
          src="/images/bg.jpg"
          className="shadow-md rounded-md w-full h-20 object-cover"
          alt={"Image"}
        />
      </div>
      <div className="gap-2 grid grid-cols-3 px-4 py-2">
        <Link
          href={'/user'}
          className={`btn btn-ghost btn-neutral btn-sm w-full ${pathname === '/user' ? 'btn-active' : ''}`}
        >
          Beranda
        </Link>
        <Link
          href={'/user/portfolio'}
          className={`btn btn-ghost btn-neutral btn-sm w-full ${pathname === '/user/portfolio' ? 'btn-active' : ''}`}
        >
          Portfolio
        </Link>
        <Link
          href={'/user/myAuction'}
          className={`btn btn-ghost btn-neutral btn-sm w-full ${pathname === '/user/myAuction' ? 'btn-active' : ''}`}
        >
          Lelang Saya
        </Link>
      </div>
      {children}
    </>
  );
}
