import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PrivScore - Personal Cybersecurity Assessment',
  description: 'Discover your cybersecurity vulnerabilities in 5 minutes with our comprehensive privacy-first assessment tool.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}