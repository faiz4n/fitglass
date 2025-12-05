import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FitGlass',
    short_name: 'FitGlass',
    description: 'Premium Fitness Tracker with Glassmorphism UI',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a1628',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
