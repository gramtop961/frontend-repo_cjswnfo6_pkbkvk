import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Filters from './components/Filters'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import FocusTimer from './components/FocusTimer'
import Dashboard from './components/Dashboard'
import { loadTasks, saveTasks, upsertTask, removeTask, loadSessions, saveSessions } from './services/storage'

function App() {
  // state
  const [tasks, setTasks] = useState([])
  const [sessions, setSessions] = useState([])
  const [activeTab, setActiveTab] = useState('tasks')
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all', range: 'semua', sort: 'deadline' })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [focusedTask, setFocusedTask] = useState(null)
  const [preset, setPreset] = useState('25/5')
  const [sessionModal, setSessionModal] = useState(null)

  // load/persist
  useEffect(() => { setTasks(loadTasks()) }, [])
  useEffect(() => { setSessions(loadSessions()) }, [])
  useEffect(() => { saveTasks(tasks) }, [tasks])
  useEffect(() => { saveSessions(sessions) }, [sessions])

  const categories = useMemo(() => {
    const set = new Set(tasks.map(t => t.category).filter(Boolean))
    return Array.from(set)
  }, [tasks])

  const filtered = useMemo(() => {
    let list = [...tasks]
    if (filters.status !== 'all') list = list.filter(t => t.status === filters.status)
    if (filters.priority !== 'all') list = list.filter(t => t.priority === filters.priority)
    if (filters.category !== 'all') list = list.filter(t => t.category === filters.category)
    if (filters.range !== 'semua') {
      const today = new Date()
      const start = new Date(today)
      const end = new Date(today)
      if (filters.range === 'hari_ini') {
        start.setHours(0,0,0,0); end.setHours(23,59,59,999)
      } else if (filters.range === 'minggu_ini') {
        const day = today.getDay(); // 0-6
        const diffToMonday = (day === 0 ? -6 : 1) - day
        start.setDate(today.getDate() + diffToMonday); start.setHours(0,0,0,0)
        end.setDate(start.getDate() + 6); end.setHours(23,59,59,999)
      }
      list = list.filter(t => t.deadline && new Date(t.deadline) >= start && new Date(t.deadline) <= end)
    }
    const sorters = {
      deadline: (a,b) => new Date(a.deadline||'9999-12-31') - new Date(b.deadline||'9999-12-31'),
      priority: (a,b) => ({high:0,medium:1,low:2}[a.priority]-({high:0,medium:1,low:2}[b.priority])),
      created_at: (a,b) => new Date(b.created_at) - new Date(a.created_at)
    }
    list.sort(sorters[filters.sort])
    return list
  }, [tasks, filters])

  const handleSaveTask = (task) => {
    setTasks(prev => upsertTask(prev, task))
    setShowForm(false); setEditing(null)
  }

  const handleDeleteTask = (task) => {
    setTasks(prev => removeTask(prev, task.id))
  }

  const toggleDone = (task) => {
    const next = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
    setTasks(prev => upsertTask(prev, next))
  }

  const startFocus = (task) => {
    setFocusedTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const endSession = (phase) => {
    // Prompt modal-like UX using simple state
    setSessionModal({ phase, task: focusedTask })
  }

  const confirmSession = (wasProductive, action) => {
    if (!focusedTask) { setSessionModal(null); return }
    const now = new Date()
    const duration = preset === '45/10' ? (sessionModal.phase==='focus' ? 45 : 10) : (preset==='25/5' ? (sessionModal.phase==='focus' ? 25 : 5) : 0)
    const record = {
      id: crypto.randomUUID(),
      task_id: focusedTask.id,
      start_time: now.toISOString(),
      end_time: now.toISOString(),
      duration_minutes: duration,
      is_productive: wasProductive
    }
    setSessions(prev => [record, ...prev])
    if (action === 'progress') {
      const next = { ...focusedTask, status: focusedTask.status === 'pending' ? 'in_progress' : focusedTask.status }
      setTasks(prev => upsertTask(prev, next))
    } else if (action === 'complete') {
      const next = { ...focusedTask, status: 'completed' }
      setTasks(prev => upsertTask(prev, next))
    }
    setSessionModal(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Header onAdd={() => { setEditing(null); setShowForm(true) }} onToggleFocus={() => {}} onSwitchTab={setActiveTab} activeTab={activeTab} />

        {activeTab === 'tasks' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <aside className="md:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sticky top-4 h-fit">
              <Filters rawTasks={tasks} filters={filters} setFilters={setFilters} categories={categories} />
            </aside>

            <main className="md:col-span-6 space-y-4">
              {showForm && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                  <TaskForm initial={editing} onCancel={() => { setShowForm(false); setEditing(null) }} onSave={handleSaveTask} />
                </div>
              )}

              <TaskList tasks={filtered} onToggleDone={toggleDone} onStartFocus={startFocus} onEdit={(t)=>{ setEditing(t); setShowForm(true) }} onDelete={handleDeleteTask} />
            </main>

            <section className="md:col-span-3 space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <div className="text-sm text-slate-400 mb-2">Mode Fokus</div>
                {focusedTask ? (
                  <FocusTimer task={focusedTask} preset={preset} onEnd={endSession} />
                ) : (
                  <div className="text-slate-400 text-sm">Pilih tugas lalu klik “Mulai fokus”.</div>
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <div className="text-sm text-slate-400 mb-2">Riwayat Fokus</div>
                <div className="space-y-2 max-h-72 overflow-auto pr-2">
                  {sessions.slice(0,20).map(s => (
                    <div key={s.id} className="text-xs flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-2">
                      <div>
                        <div className="text-slate-300">{tasks.find(t=>t.id===s.task_id)?.title || 'Tugas'}</div>
                        <div className="text-slate-400">{new Date(s.start_time).toLocaleString()} • {s.duration_minutes} menit</div>
                      </div>
                      <div className={`text-xs ${s.is_productive? 'text-emerald-300' : 'text-slate-400'}`}>{s.is_productive? 'Produktif' : 'Biasa'}</div>
                    </div>
                  ))}
                  {sessions.length === 0 && (<div className="text-sm text-slate-400">Belum ada sesi fokus.</div>)}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="py-4">
            <Dashboard tasks={tasks} sessions={sessions} />
          </div>
        )}
      </div>

      {sessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="text-slate-200 font-semibold mb-1">Sesi {sessionModal.phase === 'focus' ? 'fokus' : 'istirahat'} selesai, good job!</div>
            <div className="text-slate-400 text-sm mb-4">Apakah sesi ini produktif?</div>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => confirmSession(true, 'progress')} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm">Tandai progress naik</button>
              <button onClick={() => confirmSession(true, 'complete')} className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Tandai selesai</button>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setSessionModal(null)} className="text-slate-300 text-sm">Nanti saja</button>
              <button onClick={() => confirmSession(false)} className="text-slate-400 text-sm">Tidak produktif</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
