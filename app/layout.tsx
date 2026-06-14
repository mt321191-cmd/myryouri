import type { Metadata } from 'next'
import './globals.css'
import BottomNav from './BottomNav'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'MyRyouri — あなただけのレシピフィード',
  description: 'MyRyouriは、あなたの好みに合わせてAIがレシピを提案するパーソナルレシピアプリです。お気に入り保存・調理記録・ジャンル別フィルターが使えます。',
  openGraph: {
    type: 'website',
    title: 'MyRyouri — あなただけのレシピフィード',
    description: 'AIがあなた好みのレシピを提案。お気に入り保存・調理記録・ジャンル別フィルターが使えるパーソナルレシピアプリ。',
    siteName: 'MyRyouri',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'MyRyouri — あなただけのレシピフィード',
    description: 'AIがあなた好みのレシピを提案するパーソナルレシピアプリ。',
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
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥕</text></svg>"
        />
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