// Local storage service layer to keep code ready for future backend swap
// All data is stored under one key namespace

const KEYS = {
  tasks: 'focus_tasks',
  sessions: 'focus_sessions'
}

export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.tasks)) || []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEYS.tasks, JSON.stringify(tasks))
}

export function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.sessions)) || []
  } catch {
    return []
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions))
}

export function upsertTask(tasks, task) {
  const idx = tasks.findIndex(t => t.id === task.id)
  if (idx >= 0) {
    const next = [...tasks]
    next[idx] = task
    return next
  }
  return [task, ...tasks]
}

export function removeTask(tasks, id) {
  return tasks.filter(t => t.id !== id)
}
