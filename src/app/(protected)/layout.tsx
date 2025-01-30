'use client';

import { useAuth } from '@/context/AuthContext';
import { useMe } from '@/model/me';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();

  const {
    user: authUser,
    login,
    isAuthenticated,
  } = useAuth();

  const { data: clientData, isLoading } = useMe();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        push('/auth/login');
        return;
      }

      if (!authUser && clientData) {
        login(clientData);
      }
    };

    initializeAuth();
  }, [authUser, clientData, isAuthenticated, isLoading, login, push]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-base-100 min-h-svh">
        <div className="flex flex-col items-center gap-4">
          <span className="text-primary loading loading-lg loading-spinner"></span>
          <p className="text-base-content">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
