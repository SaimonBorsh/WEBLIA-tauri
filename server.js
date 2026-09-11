import express from 'express'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import cors from 'cors'
import { spawn } from 'child_process'

const app = express()
const PORT = 3720
const DATA_DIR = join(process.env.APPDATA || process.env.HOME || '.', 'weblia')
const DIST_DIR = join(process.resourcesPath || process.cwd(), 'dist')

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.static(DIST_DIR))

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

function uuid() { return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36) }
function loadJSON(file) { try { return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8')) } catch { return {} } }
function saveJSON(file, data) { writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2)) }

app.get('/api/projects', (req, res) => res.json(loadJSON('projects.json')))
app.post('/api/projects', (req, res) => {
  const projects = loadJSON('projects.json')
  const id = uuid()
  projects[id] = { id, ...req.body, created_at: new Date().toISOString() }
  saveJSON('projects.json', projects)
  res.json(projects[id])
})
app.delete('/api/projects/:id', (req, res) => {
  const projects = loadJSON('projects.json')
  delete projects[req.params.id]
  saveJSON('projects.json', projects)
  res.json({ ok: true })
})
app.post('/api/projects/:id/start', (req, res) => {
  const projects = loadJSON('projects.json')
  const project = projects[req.params.id]
  if (!project) return res.status(404).json({ error: 'not found' })
  const port = req.body.port || 4100
  const proc = spawn('opencode', ['serve', `--port`, `${port}`, '--hostname', '127.0.0.1'], {
    cwd: project.directory, detached: true, stdio: 'ignore'
  })
  process.unref()
  res.json({ ok: true, port })
})
app.get('/api/models', (req, res) => res.json({ models: [
  { id: 'opencode/deepseek-v4-flash-free', name: 'DeepSeek V4 Flash' },
  { id: 'opencode/mimo-v2.5-free', name: 'MiMo V2.5' },
] }))
app.get('/api/sessions', (req, res) => res.json(loadJSON('sessions.json')))
app.post('/api/sessions', (req, res) => {
  const sessions = loadJSON('sessions.json')
  const id = uuid()
  sessions[id] = { id, ...req.body, created_at: new Date().toISOString(), messages: [] }
  saveJSON('sessions.json', sessions)
  res.json(sessions[id])
})
app.get('/api/sessions/:id/messages', (req, res) => res.json(loadJSON('sessions.json')[req.params.id]?.messages || []))
app.post('/api/sessions/:id/messages', (req, res) => {
  const sessions = loadJSON('sessions.json')
  const s = sessions[req.params.id]
  if (!s) return res.status(404).json({ error: 'not found' })
  if (!s.messages) s.messages = []
  s.messages.push(req.body)
  saveJSON('sessions.json', sessions)
  res.json(req.body)
})
app.get('/api/settings', (req, res) => res.json(loadJSON('settings.json')))
app.put('/api/settings', (req, res) => { saveJSON('settings.json', req.body); res.json(req.body) })

app.get('*', (req, res) => res.sendFile(join(DIST_DIR, 'index.html')))
app.listen(PORT, '0.0.0.0', () => { console.log(`WEBAIA running on http://localhost:${PORT}`) })
