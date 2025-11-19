import { Play, Clock, CheckCircle2 } from 'lucide-react'

function PriorityBadge({ priority }) {
  const map = {
    low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    high: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
  }
  const label = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi' }[priority]
  return <span className={`text-xs px-2 py-1 rounded border ${map[priority]}`}>{label}</span>
}

function TaskCard({ task, onToggleDone, onStartFocus, onEdit, onDelete }) {
  const completedSub = (task.subtasks || []).filter(s => s.is_done).length
  const totalSub = (task.subtasks || []).length

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-slate-600 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={task.status==='completed'} onChange={() => onToggleDone(task)} className="mt-1.5 w-4 h-4 rounded border-slate-600 bg-slate-800" />
          <div>
            <h3 className="text-slate-100 font-medium leading-6">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-400 text-sm line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <PriorityBadge priority={task.priority} />
              {task.deadline && (
                <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {new Date(task.deadline).toLocaleDateString()}
                </span>
              )}
              <span className="text-xs text-slate-400">Perkiraan: {task.estimated_focus_sessions} sesi</span>
            </div>
            {totalSub > 0 && (
              <div className="text-xs text-slate-400 mt-2">Subtask: {completedSub}/{totalSub}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onStartFocus(task)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
            <Play className="w-4 h-4" /> Mulai fokus
          </button>
          <button onClick={() => onEdit(task)} className="text-sm text-slate-300 hover:text-white">Edit</button>
          <button onClick={() => onDelete(task)} className="text-sm text-rose-400 hover:text-rose-300">Hapus</button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
