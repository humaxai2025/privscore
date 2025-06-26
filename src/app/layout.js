import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PrivScore - Personal Cybersecurity Assessment',
  description: 'Discover your cybersecurity vulnerabilities in 5 minutes with our comprehensive privacy-first assessment tool.',
  keywords: 'cybersecurity, privacy, security assessment, password security, digital safety',
  authors: [{ name: 'HumanXAI' }],
  creator: 'HumanXAI',
  publisher: 'HumanXAI',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'PrivScore - Personal Cybersecurity Assessment',
    description: 'Discover your cybersecurity vulnerabilities in 5 minutes',
    url: 'https://privscore.vercel.app',
    siteName: 'PrivScore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrivScore - Personal Cybersecurity Assessment',
    description: 'Discover your cybersecurity vulnerabilities in 5 minutes',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}