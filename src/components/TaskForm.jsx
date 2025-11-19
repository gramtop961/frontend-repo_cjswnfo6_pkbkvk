import { useEffect, useState } from 'react'

const emptyTask = {
  id: '',
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  category: '',
  deadline: '',
  estimated_focus_sessions: 1,
  created_at: '',
  subtasks: []
}

function TaskForm({ initial, onCancel, onSave }) {
  const [task, setTask] = useState(initial || emptyTask)

  useEffect(() => {
    setTask(initial || emptyTask)
  }, [initial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask((t) => ({ ...t, [name]: name === 'estimated_focus_sessions' ? Number(value) : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!task.title.trim()) return
    const now = new Date().toISOString()
    const payload = {
      ...task,
      id: task.id || crypto.randomUUID(),
      created_at: task.created_at || now,
      subtasks: task.subtasks || []
    }
    onSave(payload)
  }

  const addSubtask = () => {
    setTask((t) => ({
      ...t,
      subtasks: [...(t.subtasks || []), { id: crypto.randomUUID(), title: '', is_done: false }]
    }))
  }

  const updateSubtask = (id, patch) => {
    setTask((t) => ({
      ...t,
      subtasks: t.subtasks.map((s) => (s.id === id ? { ...s, ...patch } : s))
    }))
  }

  const removeSubtask = (id) => {
    setTask((t) => ({ ...t, subtasks: t.subtasks.filter((s) => s.id !== id) }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-300 mb-1">Judul</label>
        <input name="title" value={task.title} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" placeholder="Tambah tugas baru" />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Deskripsi</label>
        <textarea name="description" value={task.description} onChange={handleChange} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" placeholder="Opsional" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Prioritas</label>
          <select name="priority" value={task.priority} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100">
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Kategori</label>
          <input name="category" value={task.category} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" placeholder="Contoh: Pekerjaan" />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Deadline</label>
          <input type="date" name="deadline" value={task.deadline || ''} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Perkiraan Sesi</label>
          <input type="number" min={1} name="estimated_focus_sessions" value={task.estimated_focus_sessions} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm text-slate-300">Subtask</label>
          <button type="button" onClick={addSubtask} className="text-xs text-indigo-400 hover:text-indigo-300">Tambah Subtask</button>
        </div>
        <div className="space-y-2">
          {(task.subtasks || []).map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <input value={s.title} onChange={(e) => updateSubtask(s.id, { title: e.target.value })} className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" placeholder="Judul subtask" />
              <button type="button" onClick={() => removeSubtask(s.id)} className="text-xs text-slate-400 hover:text-slate-200">Hapus</button>
            </div>
          ))}
          {(!task.subtasks || task.subtasks.length === 0) && (
            <p className="text-xs text-slate-400">Belum ada subtask</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 text-sm text-slate-300 hover:text-white">Batal</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Simpan</button>
      </div>
    </form>
  )
}

export default TaskForm
