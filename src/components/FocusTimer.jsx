import { useEffect, useMemo, useRef, useState } from 'react'

// Accurate timer using base timestamp + drift correction
function useAccurateTimer(isRunning, totalMs, onFinish) {
  const [remaining, setRemaining] = useState(totalMs)
  const baseRef = useRef({ startAt: 0, pauseAt: 0, elapsed: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    setRemaining(totalMs)
    baseRef.current = { startAt: 0, pauseAt: 0, elapsed: 0 }
  }, [totalMs])

  useEffect(() => {
    if (!isRunning) {
      cancelAnimationFrame(rafRef.current)
      baseRef.current.pauseAt = performance.now()
      baseRef.current.elapsed += Math.max(0, baseRef.current.pauseAt - baseRef.current.startAt)
      return
    }

    baseRef.current.startAt = performance.now()

    const loop = () => {
      const elapsed = baseRef.current.elapsed + (performance.now() - baseRef.current.startAt)
      const rem = Math.max(0, totalMs - elapsed)
      setRemaining(rem)
      if (rem <= 0) {
        cancelAnimationFrame(rafRef.current)
        onFinish?.()
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isRunning, totalMs, onFinish])

  return remaining
}

function format(ms) {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function FocusTimer({ task, preset, onEnd, onMarkProgress, onCompleteTask }) {
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const [custom, setCustom] = useState({ focus: 25, break: 5 })

  const presets = {
    '25/5': { focus: 25, break: 5 },
    '45/10': { focus: 45, break: 10 },
    custom: custom
  }

  const current = presets[preset] || presets['25/5']
  const totalMs = (mode === 'focus' ? current.focus : current.break) * 60 * 1000

  const remaining = useAccurateTimer(running, totalMs, () => {
    if (mode === 'focus') {
      setMode('break')
      setRunning(false)
      onEnd?.('focus')
    } else {
      onEnd?.('break')
      setRunning(false)
    }
  })

  useEffect(() => {
    // Persist simple session state to survive reload
    const key = 'focus_session_state'
    const data = { taskId: task?.id, mode, preset, running }
    localStorage.setItem(key, JSON.stringify(data))
  }, [task?.id, mode, preset, running])

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-1">Sedang fokus pada</div>
        <div className="text-slate-100 font-medium">{task?.title || 'Pilih tugas terlebih dahulu'}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {['25/5','45/10','custom'].map(p => (
            <button key={p} onClick={() => setRunning(false) || (p==='custom'? null : null)} className={`px-3 py-1.5 rounded-lg text-sm border ${preset===p? 'bg-indigo-600 text-white border-transparent' : 'text-slate-300 border-slate-700 hover:bg-slate-700/60'}`}>{p}</button>
          ))}
        </div>
        {preset==='custom' && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <label>Fokus</label>
            <input type="number" min={1} value={custom.focus} onChange={(e)=>setCustom(c=>({...c, focus:Number(e.target.value)}))} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1" />
            <label>Break</label>
            <input type="number" min={1} value={custom.break} onChange={(e)=>setCustom(c=>({...c, break:Number(e.target.value)}))} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1" />
          </div>
        )}
      </div>

      <div className="text-center py-6">
        <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">{mode === 'focus' ? 'Fokus' : 'Istirahat'}</div>
        <div className="text-6xl font-bold text-slate-100 mb-4">{format(remaining)}</div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: `${100 - (remaining/totalMs)*100}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          {!running ? (
            <button onClick={()=>setRunning(true)} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Mulai fokus sekarang</button>
          ) : (
            <button onClick={()=>setRunning(false)} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">Jeda</button>
          )}
          <button onClick={()=>{setRunning(false); setMode('focus')}} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm">Reset</button>
        </div>
      </div>

      {/* Simple modal placeholder after session end could be added via parent onEnd */}
    </div>
  )
}

export default FocusTimer
