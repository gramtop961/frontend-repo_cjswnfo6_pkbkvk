import TaskCard from './TaskCard'

function TaskList({ tasks, onToggleDone, onStartFocus, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">Tidak ada tugas, mau mulai sesuatu hari ini?</div>
    )
  }
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onToggleDone={onToggleDone} onStartFocus={onStartFocus} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default TaskList
