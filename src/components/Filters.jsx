import { useMemo } from 'react'

function Filters({ rawTasks, filters, setFilters, categories }) {
  const statuses = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'Dalam Proses' },
    { value: 'completed', label: 'Selesai' },
  ]

  const priorities = [
    { value: 'all', label: 'Semua' },
    { value: 'high', label: 'Tinggi' },
    { value: 'medium', label: 'Sedang' },
    { value: 'low', label: 'Rendah' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-slate-300 text-sm mb-2">Status</h4>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s.value} onClick={() => setFilters(f => ({...f, status: s.value}))} className={`px-3 py-1.5 rounded-lg text-sm border ${filters.status===s.value? 'bg-slate-700 text-white border-slate-600' : 'text-slate-300 border-slate-700 hover:bg-slate-800'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-slate-300 text-sm mb-2">Prioritas</h4>
        <div className="flex flex-wrap gap-2">
          {priorities.map(s => (
            <button key={s.value} onClick={() => setFilters(f => ({...f, priority: s.value}))} className={`px-3 py-1.5 rounded-lg text-sm border ${filters.priority===s.value? 'bg-slate-700 text-white border-slate-600' : 'text-slate-300 border-slate-700 hover:bg-slate-800'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-slate-300 text-sm mb-2">Kategori</h4>
        <div className="flex flex-col gap-1">
          <button onClick={() => setFilters(f=>({...f, category:'all'}))} className={`text-left px-2 py-1 rounded ${filters.category==='all'? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>Semua</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilters(f=>({...f, category:c}))} className={`text-left px-2 py-1 rounded ${filters.category===c? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-slate-300 text-sm mb-2">Rentang</h4>
        <div className="flex flex-wrap gap-2">
          {['semua','hari_ini','minggu_ini'].map(key => (
            <button key={key} onClick={() => setFilters(f=>({...f, range:key}))} className={`px-3 py-1.5 rounded-lg text-sm border ${filters.range===key? 'bg-slate-700 text-white border-slate-600' : 'text-slate-300 border-slate-700 hover:bg-slate-800'}`}>{key.replace('_',' ')}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-slate-300 text-sm mb-2">Urutkan</h4>
        <select value={filters.sort} onChange={(e)=>setFilters(f=>({...f, sort:e.target.value}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100">
          <option value="deadline">Deadline</option>
          <option value="priority">Prioritas</option>
          <option value="created_at">Dibuat</option>
        </select>
      </div>
    </div>
  )
}

export default Filters
