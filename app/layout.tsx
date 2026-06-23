import type { Metadata } from 'next'
import './globals.css'
import BottomNav from './BottomNav'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'MyRyouri — 基本のレシピを、手元に。',
  description: '定番料理の基本をまとめたデジタルレシピ帳。料理中もスクロールなしで材料・手順をサクサク確認できます。肉じゃが、パスタ、本格中華、彩り豊かなサラダまで。',
  openGraph: {
    type: 'website',
    title: 'MyRyouri — 基本のレシピを、手元に。',
    description: '定番料理の基本をまとめたデジタルレシピ帳。料理中もスクロールなしで材料・手順をサクサク確認できます。肉じゃが、パスタ、本格中華、彩り豊かなサラダまで。',
    siteName: 'MyRyouri',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'MyRyouri — 基本のレシピを、手元に。',
    description: '定番料理の基本をまとめたデジタルレシピ帳。料理中もスクロールなしで確認できます。',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J5VGY9WDGY"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J5VGY9WDGY');
        `}</Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9734373274053854"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}