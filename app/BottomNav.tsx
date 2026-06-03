'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function BottomNav() {
  const pathname = usePathname()
  const isRecipe = pathname.startsWith('/recipe')

  if (!isRecipe) return null

  const handleRecipeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // 何もしない＝今のページに留まる
  }

  return (
    <nav className="bottom-nav visible" id="bottomNavGlobal">
      <a href="/" className="nav-btn">
        <span className="nav-icon">🏠</span>
        <span className="nav-label">ホーム</span>
      </a>
      <a href="/#sSearch" className="nav-btn">
        <span className="nav-icon">🔍</span>
        <span className="nav-label">検索</span>
      </a>
      <a href="#" className="nav-btn active" onClick={handleRecipeClick}>
        <span className="nav-icon">📋</span>
        <span className="nav-label">レシピ</span>
      </a>
      <a href="/#sMypage" className="nav-btn">
        <span className="nav-icon">👤</span>
        <span className="nav-label">マイページ</span>
      </a>
    </nav>
  )
}
