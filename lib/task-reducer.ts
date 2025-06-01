import type { Task, TaskAction } from "./types"

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.payload]

    case "UPDATE_TASK":
      return state.map((task) => (task.id === action.payload.id ? action.payload : task))

    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload)

    case "INITIALIZE":
      return action.payload

    default:
      return state
  }
}
