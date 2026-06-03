import type { Metadata } from 'next'
import './globals.css'
import BottomNav from './BottomNav'

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
      </head>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
