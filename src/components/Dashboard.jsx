import { useMemo } from 'react'

function MiniStat({ label, value, accent }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  )
}

function SimpleBar({ data }) {
  const max = Math.max(1, ...data)
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((v, i) => (
        <div key={i} className="flex-1 bg-slate-800 rounded" style={{ height: `${(v/max)*100}%` }}>
          <div className="w-full h-full bg-gradient-to-t from-indigo-600 to-violet-600 rounded"></div>
        </div>
      ))}
    </div>
  )
}

function Dashboard({ tasks, sessions }) {
  const counts = useMemo(() => {
    return {
      pending: tasks.filter(t=>t.status==='pending').length,
      in_progress: tasks.filter(t=>t.status==='in_progress').length,
      completed: tasks.filter(t=>t.status==='completed').length,
    }
  }, [tasks])

  const today = new Date().toDateString()
  const todaySessions = sessions.filter(s => new Date(s.start_time).toDateString() === today)
  const minutesToday = todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)

  // last 7 days simple aggregate
  const last7 = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - idx))
    const key = d.toDateString()
    return sessions.filter(s => new Date(s.start_time).toDateString() === key).length
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="Pending" value={counts.pending} accent="text-amber-300" />
        <MiniStat label="Dalam Proses" value={counts.in_progress} accent="text-indigo-300" />
        <MiniStat label="Selesai" value={counts.completed} accent="text-emerald-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="text-slate-300 font-medium mb-2">Sesi fokus 7 hari terakhir</div>
          <SimpleBar data={last7} />
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="text-sm text-slate-400">Fokus hari ini</div>
          <div className="text-3xl font-semibold text-slate-100">{minutesToday} menit</div>
          <div className="text-sm text-slate-400 mt-2">{`Hari ini kamu sudah fokus selama ${minutesToday} menit`}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
