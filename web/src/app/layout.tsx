'use client'

import { Inter } from 'next/font/google'

import '~/styles/global.scss'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
