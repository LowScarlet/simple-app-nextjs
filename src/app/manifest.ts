import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LelangYuk',
    short_name: 'LelangYuk',
    description: 'Aplikasi Khusus Untuk Pelelangan Barang',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logo333.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}