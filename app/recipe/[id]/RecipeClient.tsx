'use client'

import { useState, useEffect } from 'react'

type Recipe = {
  id: number
  name: string
  sub: string
  genre: string
  ingredients: string[]
  time: number
  easy: boolean
  img?: string
  fallback: string
  ing: string[]
  steps: string[]
  tips?: string[]
}

type Props = {
  recipe: Recipe
  allRecipes: Recipe[]
}

export default function RecipeClient({ recipe, allRecipes }: Props) {
  const [activePanel, setActivePanel] = useState<'rcIngredients' | 'rcSteps' | null>(null)
  const [liked, setLiked] = useState(false)
  const [cooked, setCooked] = useState(false)
  const [cookedDate, setCookedDate] = useState<string | null>(null)
  const [showRecord, setShowRecord] = useState(false)
  const [trayIds, setTrayIds] = useState<number[]>([])

  useEffect(() => {
    // 現在のレシピURLをlocalStorageに保存
    localStorage.setItem('lastRecipeUrl', `/recipe/${recipe.id}`)

    try {
      const favs = JSON.parse(localStorage.getItem('cf-guest-favs') || '[]')
      setLiked(favs.includes(recipe.id))
      const recs = JSON.parse(localStorage.getItem('cf-records') || '{}')
      if (recs[recipe.id]) {
        setCooked(recs[recipe.id].cooked)
        setCookedDate(recs[recipe.id].cookedDate)
      }
    } catch {}
    const shuffled = [
      ...allRecipes.filter(r => r.genre === recipe.genre),
      ...allRecipes.filter(r => r.genre !== recipe.genre),
    ].map(r => r.id)
    setTrayIds(shuffled)
  }, [recipe.id])

  const toggleLike = () => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem('cf-guest-favs') || '[]')
      const next = liked ? favs.filter(id => id !== recipe.id) : [...favs, recipe.id]
      localStorage.setItem('cf-guest-favs', JSON.stringify(next))
      setLiked(!liked)
    } catch {}
  }

  const toggleCooked = () => {
    try {
      const recs = JSON.parse(localStorage.getItem('cf-records') || '{}')
      const newVal = !cooked
      const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
      recs[recipe.id] = { cooked: newVal, cookedDate: newVal ? today : null }
      localStorage.setItem('cf-records', JSON.stringify(recs))
      setCooked(newVal)
      setCookedDate(newVal ? today : null)
    } catch {}
  }

  const togglePanel = (panel: 'rcIngredients' | 'rcSteps') => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <>
      <style>{`
        .recipe-page-wrap {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          padding-bottom: var(--nav-h);
        }
        .sRecipe-inner {
          width: 340px;
          max-width: 92vw;
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin: 0 auto;
        }
        .recipe-card-wrap {
          position: relative;
          width: 340px;
          max-width: 92vw;
          aspect-ratio: 9/16;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.55);
          flex-shrink: 0;
        }
        .recipe-card-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 26%, transparent 50%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
          z-index: 5;
        }
        .rc-fallback { position: absolute; inset: 0; transition: background .5s; }
        .rc-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity .45s; }
        .rc-header {
          position: absolute; top: 16px; left: 18px; right: 18px;
          display: flex; justify-content: space-between; align-items: center; z-index: 20;
        }
        .rc-logo {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: 18px; color: white; text-shadow: 0 1px 6px rgba(0,0,0,0.5);
        }
        .rc-actions {
          position: absolute; top: 60px; right: 13px;
          display: flex; flex-direction: column; gap: 10px; z-index: 20;
        }
        .rc-action-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(0,0,0,0.42); backdrop-filter: blur(8px);
          color: white; font-size: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .rc-action-btn.liked { background: var(--accent); border-color: var(--accent); }
        .record-badge {
          position: absolute; top: -2px; right: -2px;
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--green); border: 2px solid var(--bg); display: none;
        }
        .has-record .record-badge { display: block; }
        .rc-meta { position: absolute; bottom: 64px; left: 18px; right: 18px; z-index: 8; }
        .rc-name { font-size: 22px; font-weight: 900; line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,0.4); }
        .rc-sub  { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 4px; }
        .rc-controls {
          position: absolute; bottom: 14px; left: 18px; right: 18px;
          display: flex; gap: 8px; z-index: 20;
        }
        .rc-ctrl-btn {
          flex: 1; padding: 10px 0; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.38); backdrop-filter: blur(10px);
          color: white; font-size: 13px; font-weight: 700;
          font-family: 'Zen Kaku Gothic New', sans-serif;
          cursor: pointer; transition: background .2s;
        }
        .rc-ctrl-btn.active { background: rgba(255,107,53,0.75); border-color: var(--accent); }
        .rc-panel {
          position: absolute; top: 0; bottom: 0; left: 0; width: 68%;
          background: rgba(252,248,242,0.93); backdrop-filter: blur(20px);
          border-radius: 20px; padding: 24px 18px 80px;
          overflow-y: auto; z-index: 15;
          transform: translateX(-105%);
          transition: transform .35s cubic-bezier(.4,0,.2,1);
          scrollbar-width: none;
        }
        .rc-panel.steps { left: unset; right: 0; transform: translateX(105%); }
        .rc-panel.active { transform: translateX(0); }
        .rc-panel-title {
          font-size: 16px; font-weight: 900; color: #1a1208;
          margin-bottom: 14px; padding-bottom: 10px;
          border-bottom: 1.5px solid rgba(0,0,0,0.08);
        }
        .rc-panel ul, .rc-panel ol { padding-left: 16px; display: flex; flex-direction: column; gap: 10px; }
        .rc-panel li { font-size: 13px; color: #3a2a1a; line-height: 1.6; }
        .ing-section { list-style: none; margin-left: -16px; font-size: 11px; font-weight: 900; color: var(--accent); }
        .record-panel {
          position: absolute; bottom: 68px; left: 12px; z-index: 25;
          background: rgba(10,8,5,0.86); backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 16px;
          padding: 14px 16px 12px; width: 190px;
          flex-direction: column; gap: 10px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
          display: none;
        }
        .record-panel.open { display: flex; }
        .record-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .record-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.65); }
        .cooked-toggle {
          width: 36px; height: 22px; border-radius: 999px;
          background: rgba(255,255,255,0.12); border: none; cursor: pointer;
          position: relative; transition: background .2s; flex-shrink: 0;
        }
        .cooked-toggle::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: white; transition: transform .2s;
        }
        .cooked-toggle.on { background: var(--green); }
        .cooked-toggle.on::after { transform: translateX(14px); }
        .cooked-date { font-size: 10px; color: rgba(255,255,255,0.35); padding-left: 2px; min-height: 12px; }
        .tray-wrapper { width: 340px; max-width: 92vw; margin-top: 16px; flex-shrink: 0; }
        .tips-card {
          width: 340px; max-width: 92vw; margin-top: 16px; flex-shrink: 0;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 22px; padding: 24px 22px 26px;
        }
        @media (min-width: 768px) { .tips-card { display: none; } }
        .tips-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 6px;
        }
        .tips-card-header-left { display: flex; align-items: center; gap: 10px; }
        .tips-icon-chip {
          width: 30px; height: 30px; border-radius: 9px;
          background: var(--accent-dim);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .tips-card-title { font-size: 17px; font-weight: 700; color: var(--text); letter-spacing: 0.3px; }
        .tips-card-count { font-size: 12px; font-weight: 600; color: var(--text-sub); }
        .tips-card-desc { font-size: 12.5px; color: var(--text-sub); line-height: 1.6; margin: 0 0 20px; }
        .tips-list { display: flex; flex-direction: column; }
        .tips-item {
          display: flex; gap: 14px;
          padding: 18px 0;
        }
        .tips-item:first-child { padding-top: 0; }
        .tips-item:last-child { padding-bottom: 0; }
        .tips-item + .tips-item { border-top: 1px solid var(--border); }
        .tips-number {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          background: var(--accent-dim); color: var(--accent);
          font-size: 13px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        .tips-body { flex: 1; min-width: 0; font-size: 13.5px; line-height: 1.85; color: rgba(255,255,255,0.72); }
        .topbar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .toggle-btn {
          padding: 7px 16px; border-radius: 999px;
          border: 1px solid var(--border); background: transparent;
          color: var(--text-sub); font-size: 12px; font-weight: 700;
          font-family: 'Zen Kaku Gothic New', sans-serif; cursor: pointer;
        }
        .toggle-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
        .tray {
          display: flex; gap: 10px; overflow-x: auto;
          padding-bottom: 4px; scrollbar-width: none; min-height: 90px;
        }
        .tray::-webkit-scrollbar { display: none; }
        .thumb {
          position: relative; flex-shrink: 0; width: 66px; height: 88px;
          border-radius: 12px; overflow: hidden; cursor: pointer;
          border: 2.5px solid transparent; transition: border-color .22s, transform .18s;
          text-decoration: none; display: block;
        }
        .thumb:hover { transform: translateY(-3px); }
        .thumb.active { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
        .thumb-fallback { position: absolute; inset: 0; }
        .thumb::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 55%; background: linear-gradient(transparent, rgba(0,0,0,0.68));
          pointer-events: none;
        }
        .thumb-name {
          position: absolute; bottom: 5px; left: 0; right: 0;
          text-align: center; font-size: 9px; font-weight: 700;
          color: white; line-height: 1.3; padding: 0 3px; z-index: 2;
        }
        .rc-detail-panel { display: none; }
        @media (min-width: 768px) {
          .sRecipe-inner {
            flex-direction: row !important;
            align-items: flex-start !important;
            justify-content: center !important;
            padding: 40px !important;
            gap: 40px;
            max-width: none;
            width: 100%;
            margin: 0;
          }
          .recipe-card-wrap { width: 360px; }
          .tray-wrapper { width: 360px; }
          .rc-detail-panel {
            display: flex !important;
            flex-direction: column;
            gap: 20px;
            width: 320px;
            padding-top: 24px;
            flex-shrink: 0;
          }
        }
      `}</style>

      <div className="recipe-page-wrap">
        <div className="sRecipe-inner">
          <div>
            {/* レシピカード */}
            <div className="recipe-card-wrap">
              <div className="rc-fallback" style={{ background: recipe.fallback }} />
              {recipe.img && (
                <img
                  src={`/images/${recipe.id}.webp`}
                  className="rc-img"
                  alt={`${recipe.name}の完成写真`}
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
              )}
              <header className="rc-header">
                <div className="rc-logo">MyRyouri</div>
              </header>
              <div className="rc-actions">
                <button className={`rc-action-btn ${liked ? 'liked' : ''}`} onClick={toggleLike} aria-label="お気に入り">
                  {liked ? '♥' : '♡'}
                </button>
                <button
                  className={`rc-action-btn ${cooked ? 'has-record' : ''}`}
                  onClick={() => setShowRecord(!showRecord)}
                  aria-label="調理記録"
                  style={{ position: 'relative' }}
                >
                  📋<span className="record-badge" />
                </button>
                <button className="rc-action-btn" aria-label="シェア">↗</button>
              </div>

              <div className={`record-panel ${showRecord ? 'open' : ''}`}>
                <div className="record-row">
                  <span className="record-label">✅ 調理済み</span>
                  <button className={`cooked-toggle ${cooked ? 'on' : ''}`} onClick={toggleCooked} aria-label="調理済みトグル" />
                </div>
                <div className="cooked-date">{cooked && cookedDate ? `最終調理：${cookedDate}` : ''}</div>
              </div>

              <div className="rc-meta">
                <h1 className="rc-name">{recipe.name}</h1>
                <div className="rc-sub">{recipe.sub}</div>
              </div>

              <div className="rc-controls">
                <button className={`rc-ctrl-btn ${activePanel === 'rcIngredients' ? 'active' : ''}`} onClick={() => togglePanel('rcIngredients')}>材料</button>
                <button className={`rc-ctrl-btn ${activePanel === 'rcSteps' ? 'active' : ''}`} onClick={() => togglePanel('rcSteps')}>作り方</button>
              </div>

              <section className={`rc-panel ingredients ${activePanel === 'rcIngredients' ? 'active' : ''}`}>
                <h2 className="rc-panel-title">材料</h2>
                <ul>
                  {recipe.ing.map((item, i) =>
                    item.startsWith('──') ? <li key={i} className="ing-section">{item}</li> : <li key={i}>{item}</li>
                  )}
                </ul>
              </section>

              <section className={`rc-panel steps ${activePanel === 'rcSteps' ? 'active' : ''}`}>
                <h2 className="rc-panel-title">作り方</h2>
                <ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
              </section>
            </div>

            {/* トレイ */}
            <div className="tray-wrapper">
              <div className="topbar">
                <button className="toggle-btn active">✦ おすすめ</button>
              </div>
              <div className="tray">
                {trayIds.map(id => {
                  const r = allRecipes.find(x => x.id === id)
                  if (!r) return null
                  return (
                    <a key={id} href={`/recipe/${id}`} className={`thumb ${id === recipe.id ? 'active' : ''}`}>
                      <div className="thumb-fallback" style={{ background: r.fallback }} />
                      {r.img && (
                        <img
                          src={`/images/${r.id}.webp`}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          alt={r.name}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      )}
                      <div className="thumb-name">{r.name}</div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* モバイル用コツカード */}
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="tips-card">
                <div className="tips-card-header">
                  <div className="tips-card-header-left">
                    <span className="tips-icon-chip">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V15h6v1.7c0 .8.4 1.5 1 2A7 7 0 0 0 12 2Z"/>
                      </svg>
                    </span>
                    <span className="tips-card-title">コツ・ポイント</span>
                  </div>
                  <span className="tips-card-count">{recipe.tips.length} ポイント</span>
                </div>
                <p className="tips-card-desc">仕上がりを左右する{recipe.tips.length}つのポイント。</p>
                <div className="tips-list">
                  {recipe.tips.map((tip, i) => (
                    <div key={i} className="tips-item">
                      <span className="tips-number">{i + 1}</span>
                      <div className="tips-body">{tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PC用サイドパネル */}
          <div className="rc-detail-panel">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '20px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-sub)', letterSpacing: '.1em', marginBottom: '14px' }}>📋 材料</div>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'disc' }}>
                {recipe.ing.map((item, i) =>
                  item.startsWith('──') ? (
                    <li key={i} style={{ listStyle: 'none', marginLeft: '-16px', fontSize: '11px', fontWeight: 900, color: 'var(--accent)' }}>{item}</li>
                  ) : (
                    <li key={i} style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>{item}</li>
                  )
                )}
              </ul>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '20px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-sub)', letterSpacing: '.1em', marginBottom: '14px' }}>🍳 作り方</div>
              <ol style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recipe.steps.map((step, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </div>
            {recipe.tips && recipe.tips.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '22px', padding: '24px 22px 26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V15h6v1.7c0 .8.4 1.5 1 2A7 7 0 0 0 12 2Z"/>
                      </svg>
                    </span>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.3px' }}>コツ・ポイント</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-sub)' }}>{recipe.tips.length} ポイント</span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-sub)', lineHeight: 1.6, margin: '0 0 20px' }}>仕上がりを左右する{recipe.tips.length}つのポイント。</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {recipe.tips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px', padding: i === 0 ? '0 0 18px' : i === recipe.tips!.length - 1 ? '18px 0 0' : '18px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0, fontSize: '13.5px', lineHeight: 1.85, color: 'rgba(255,255,255,0.72)' }}>{tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
