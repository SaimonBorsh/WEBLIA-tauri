export interface Project {
  id: string
  name: string
  directory: string
  default_model: string
  created_at: string
}
export interface Session {
  id: string
  project_id: string
  created_at: string
  model: string
  messages: Message[]
}
export interface Message {
  id: string
  role: string
  content: string
  attachments: Attachment[]
  created_at: string
}
export interface Attachment {
  url: string
  mime: string
  name: string
}
export interface AppSettings {
  telegram_token: string
  manager_port: number
  opencode_path: string
}
export interface ModelInfo {
  id: string
  name: string
  context?: number
  source: string
}
