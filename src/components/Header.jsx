import { useState } from 'react'
import { Plus, Timer, LayoutGrid } from 'lucide-react'

function Header({ onAdd, onToggleFocus, onSwitchTab, activeTab }) {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow">
          F
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-100 leading-5">Fokus</h1>
          <p className="text-xs text-slate-400">Todo & Pomodoro</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onSwitchTab('tasks')}
          className={`px-3 py-2 rounded-lg text-sm transition ${activeTab==='tasks' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/60'}`}
        >
          Tugas
        </button>
        <button
          onClick={() => onSwitchTab('dashboard')}
          className={`px-3 py-2 rounded-lg text-sm transition ${activeTab==='dashboard' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/60'}`}
        >
          Dashboard
        </button>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow"
        >
          <Plus className="w-4 h-4" /> Tambah Tugas
        </button>
      </div>
    </header>
  )
}

export default Header
