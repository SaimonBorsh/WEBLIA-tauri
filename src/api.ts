import type { Project, ModelInfo, Session, Message, Attachment, AppSettings } from './types'
export async function listProjects(): Promise<Record<string, Project>> { return (await fetch('/api/projects')).json() }
export async function createProject(args: { name: string; directory: string; default_model?: string }): Promise<Project> { return (await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(args) })).json() }
export async function deleteProject(id: string): Promise<void> { await fetch(`/api/projects/${id}`, { method: 'DELETE' }) }
export async function startProject(id: string, port: number): Promise<{ ok: boolean; port: number }> { return (await fetch(`/api/projects/${id}/start`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ port }) })).json() }
export async function getModels(): Promise<{ models: ModelInfo[] }> { return (await fetch('/api/models')).json() }
export async function listSessions(): Promise<Record<string, Session>> { return (await fetch('/api/sessions')).json() }
export async function createSession(args: { project_id: string; model?: string }): Promise<Session> { return (await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(args) })).json() }
export async function getMessages(sessionId: string): Promise<Message[]> { return (await fetch(`/api/sessions/${sessionId}/messages`)).json() }
export async function sendMessage(args: { session_id: string; role: string; content: string; attachments: Attachment[] }): Promise<Message> { return (await fetch(`/api/sessions/${args.session_id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(args) })).json() }
export async function getSettings(): Promise<AppSettings> { return (await fetch('/api/settings')).json() }
export async function setSettings(args: AppSettings): Promise<AppSettings> { return (await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(args) })).json() }
