export type TaskStatus = "todo" | "inProgress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  deadline?: string
  status: TaskStatus
  labels?: string[]
}

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "INITIALIZE"; payload: Task[] }
