import { useState, useEffect } from 'react'
import { listProjects, createProject, startProject } from './api'
import type { Project } from './types'

function App() {
  const [projects, setProjects] = useState<Record<string, Project>>({})
  const [view, setView] = useState<'projects' | 'chat' | 'settings'>('projects')

  useEffect(() => { loadProjects() }, [])

  async function loadProjects() {
    try { setProjects(await listProjects()) } catch (e) { console.error(e) }
  }

  async function handleCreate(name: string, dir: string) {
    const p = await createProject({ name, directory: dir })
    setProjects({ ...projects, [p.id]: p })
  }

  async function handleStart(id: string) {
    await startProject(id, 4100 + Math.floor(Math.random() * 100))
    await loadProjects()
  }

  const projList = Object.values(projects)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">WEBAIA</h1>
        <div className="flex gap-2">
          <button onClick={() => setView('projects')} className={`px-4 py-2 rounded ${view==='projects'?'bg-blue-600':'bg-gray-800'}`}>Проекты</button>
          <button onClick={() => setView('settings')} className={`px-4 py-2 rounded ${view==='settings'?'bg-blue-600':'bg-gray-800'}`}>Настройки</button>
        </div>
      </header>
      {view === 'projects' && (
        <div>
          <h2 className="text-xl mb-4">Ваши проекты</h2>
          <div className="grid gap-4">
            {projList.map(p => (
              <div key={p.id} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-400">{p.directory}</p>
                </div>
                <button onClick={() => handleStart(p.id)} className="bg-green-600 px-4 py-2 rounded">▶ Старт</button>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Новый проект</h3>
            <NewProjectForm onCreate={handleCreate} />
          </div>
        </div>
      )}
      {view === 'settings' && <SettingsView />}
    </div>
  )
}

function NewProjectForm({ onCreate }: { onCreate: (name: string, dir: string) => void }) {
  const [name, setName] = useState('')
  const [dir, setDir] = useState('')
  return (
    <div className="flex gap-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Название" className="bg-gray-800 text-white px-3 py-2 rounded border" />
      <input value={dir} onChange={e => setDir(e.target.value)} placeholder="Путь" className="bg-gray-800 text-white px-3 py-2 rounded border" />
      <button onClick={() => { if (name && dir) { onCreate(name, dir); setName(''); setDir('') } }} className="bg-blue-600 px-4 py-2 rounded">Создать</button>
    </div>
  )
}

function SettingsView() { return <div className="text-gray-400">Настройки (скоро)</div> }

export default App
