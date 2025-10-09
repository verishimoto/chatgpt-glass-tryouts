import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import data from './data/platforms.json'

// Referral placeholder (Alignerr)
const REFERRAL = 'https://app.alignerr.com/signin?referral-code=31c398e4-1e87-4be5-933d-7483da9b1bf2'
const LINKEDIN = 'https://www.linkedin.com/in/verishimoto'

export default function App(){
  const [platforms, setPlatforms] = useState(data)
  const [qty, setQty] = useState(5)
  const [country, setCountry] = useState('ALL')
  const [open, setOpen] = useState(null)
  const [themeLight, setThemeLight] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(()=>{
    setLastUpdate(new Date())
  },[])

  const list = useMemo(()=>{
    return platforms
      .filter(p => country === 'ALL' ? true : p.countries.includes(country))
      .sort((a,b)=> b.score - a.score)
      .slice(0, qty)
  },[platforms, qty, country])

  function toggle(id){ setOpen(prev => prev === id ? null : id) }
  function markAccessed(id){ try{ localStorage.setItem('accessed:'+id,'1') }catch(e){} }
  function accessed(id){ try{ return localStorage.getItem('accessed:'+id) === '1' }catch(e){return false} }

  return (
    <div className={`min-h-screen ${themeLight? 'bg-white text-slate-900':'bg-[#07122a] text-slate-100'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div style={{position:'fixed',top:16,right:16,zIndex:60}}>
          <button aria-pressed={themeLight} onClick={()=>setThemeLight(t=>!t)} style={{width:56,height:30,borderRadius:999,background: 'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',padding:4}}>
            <div style={{width:22,height:22,borderRadius:999,background: themeLight ? '#021' : '#fff', transform: themeLight ? 'translateX(26px)':'translateX(0)', transition:'transform .24s cubic-bezier(.2,1,.36,1)'}}></div>
          </button>
        </div>

        <header className="flex flex-col items-center text-center mt-6">
          <h1 className="font-extralight" style={{fontSize:'clamp(72px,22vw,220px)',lineHeight:0.78,letterSpacing:'0.18em',color:'rgba(250,250,250,0.35)'}}>AI</h1>
          <div style={{marginTop:8}} className="inline-block px-4 py-1 rounded-lg" aria-hidden>
            <div style={{background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',padding:'8px 18px',borderRadius:12,border:'1px solid rgba(255,255,255,0.06)'}}>
              <span style={{letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:700}}>2025 SIDE HUSTLES ▪︎ AI TRENDING PLATFORMS</span>
            </div>
          </div>

          <div className="mt-4 flex gap-4 flex-wrap justify-center items-center">
            <div className="flex bg-[rgba(255,255,255,0.02)] p-2 rounded-xl border border-[rgba(255,255,255,0.04)]">
              {[5,10,15,20,25,50].map(n=> (
                <button key={n} onClick={()=>setQty(n)} className={`px-3 py-1 rounded-lg font-semibold ${qty===n? 'bg-gradient-to-r from-[#63A1F2] to-[#22d3ee] text-[#021]':''}`} style={{marginRight:6}}>{n}</button>
              ))}
            </div>

            <div className="flex bg-[rgba(255,255,255,0.02)] p-2 rounded-xl border border-[rgba(255,255,255,0.04)]">
              {[['ALL','🌐 All'],['US','🇺🇸 US'],['GB','🇬🇧 UK'],['KE','🇰🇪 Kenya'],['IN','🇮🇳 India']].map(([code,label])=> (
                <button key={code} onClick={()=>setCountry(code)} className={`px-3 py-1 rounded-lg font-semibold ${country===code? 'bg-gradient-to-r from-[#63A1F2] to-[#22d3ee] text-[#021]':''}`} style={{marginRight:6}}>{label}</button>
              ))}
            </div>
          </div>

          <div className="mt-3 text-[#63A1F2]">▾</div>
        </header>

        <main className="mt-6 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
          {list.map((p, idx)=> (
            <motion.article key={p.id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className={`glass p-4`} style={{borderRadius:14}}>
              <div className="card-head" onClick={()=>toggle(p.id)} style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                <div className="rank">#{idx+1}</div>
                <div className="title" style={{fontWeight:700}}>{p.name}</div>
                <div style={{marginLeft:'auto',fontWeight:800,color:'#63A1F2'}}>{p.score}%</div>
                <div className="chev" style={{color:'#94a3b8'}}>▾</div>
              </div>

              <motion.div animate={open===p.id? 'open':'closed'} variants={{open:{height:'auto',opacity:1},closed:{height:0,opacity:0}}} transition={{duration:0.38}} style={{overflow:'hidden'}}>
                <div style={{paddingTop:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.02)',color:'#94a3b8'}}>
                    <div>Availability</div><div style={{fontWeight:800}}>{p.countries.join(', ')}</div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.02)',color:'#94a3b8'}}>
                    <div>Pay</div><div style={{fontWeight:800}}>${p.pay[0]}–${p.pay[1]}/hr</div>
                  </div>
                  <div style={{padding:'8px 0',color:'#94a3b8'}}>
                    <div style={{fontWeight:700,color:'inherit'}}>Notes</div>
                    <div style={{marginTop:6}}>{p.desc}</div>
                  </div>

                  <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={()=>markAccessed(p.id)} className={`apply ${accessed(p.id)? 'accessed':''}`} style={{display:'block',marginTop:10,padding:10,borderRadius:10,textAlign:'center',background:'linear-gradient(90deg,#63A1F2,#22d3ee)',color:'#021',fontWeight:800,textDecoration:'none'}}>{accessed(p.id)? 'Already Accessed':'Apply / Visit →'}</a>
                </div>
              </motion.div>
            </motion.article>
          ))}
          </AnimatePresence>
        </main>

        <div className="glass" style={{marginTop:18,padding:14,borderRadius:12}}>
          <div style={{textAlign:'center',color:'#94a3b8'}}>Made and updated by ChatGPT — prompt-engineered by <strong>verishimoto</strong>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{marginLeft:8,display:'inline-block',verticalAlign:'middle'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.98 3.5C4.98 4.60457 4.07357 5.5 2.98 5.5C1.88643 5.5 0.98 4.60457 0.98 3.5C0.98 2.39543 1.88643 1.5 2.98 1.5C4.07357 1.5 4.98 2.39543 4.98 3.5Z" fill="currentColor"/><path d="M0.98 8.5H4.98V24H0.98V8.5Z" fill="currentColor"/><path d="M8.98 8.5H12.76V10.62H12.82C13.4 9.58 14.86 8.5 17.14 8.5C21.28 8.5 22 11.34 22 15.6V24H17V16.6C17 14.82 16.98 12.36 14.2 12.36C11.4 12.36 11 14.52 11 16.44V24H5.98V8.5H8.98Z" fill="currentColor"/></svg>
            </a>
          </div>
          <div style={{marginTop:8,color:'#94a3b8',textAlign:'center'}}>Cards updated daily • Last update (GMT): {new Date(lastUpdate).toUTCString()}</div>
          <div style={{marginTop:8,color:'#94a3b8',textAlign:'center',fontSize:13}}>Generated and maintained with the help of ChatGPT. Fonts and resources are user-trusted only. No data collection of any kind.</div>
        </div>

      </div>
    </div>
  )
}
