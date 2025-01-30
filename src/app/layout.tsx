import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Coba Lelang",
  description: "Coba Lelang Apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" data-theme="business" className="scroll-smooth">
        <body
          className={`antialiased`}
        >
          <div className="sm:shadow-md mx-auto rounded-md max-w-sm min-h-svh container dd">
            {children}
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
