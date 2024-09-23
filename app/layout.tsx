import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] }) // specifying normal and bold weights
const robotoMono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '700'] }) // specifying normal and bold weights

export const metadata: Metadata = {
  title: 'AI Proposal Interface',
  description: 'Record and submit your thoughts on AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-100`}>
        {children}
      </body>
    </html>
  )
}