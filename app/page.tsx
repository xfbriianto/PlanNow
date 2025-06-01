"use client"

import { useState, useEffect, useReducer } from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { Plus, Moon, Sun, Calendar } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import Column from "@/components/column"
import TaskForm from "@/components/task-form"
import type { Task, TaskStatus } from "@/lib/types"
import { taskReducer } from "@/lib/task-reducer"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [tasks, dispatch] = useReducer(taskReducer, [])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load tasks from localStorage on initial render
  useEffect(() => {
    if (!isClient) return;
    const savedTasks = localStorage.getItem("kanban-tasks")
    if (savedTasks) {
      dispatch({ type: "INITIALIZE", payload: JSON.parse(savedTasks) })
    }
  }, [isClient])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks))
  }, [tasks, isClient])

  const handleAddTask = (task: Omit<Task, "id" | "status">) => {
    if (!isClient) return;
    
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      status: "todo" as TaskStatus
    }
    dispatch({ type: "ADD_TASK", payload: newTask })
    setIsFormOpen(false)
  }

  const handleEditTask = (task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: task })
    setEditingTask(null)
    setIsFormOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: taskId })
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the task that was dragged
    const task = tasks.find((task) => task.id === draggableId)
    if (!task) return

    // Create a new task with the updated status
    const updatedTask = {
      ...task,
      status: destination.droppableId as TaskStatus,
    }

    dispatch({ type: "UPDATE_TASK", payload: updatedTask })
  }

  const getTotalTasks = () => tasks.length
  const getCompletedTasks = () => tasks.filter(task => task.status === "done").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(15,23,42,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <main className="relative z-10 min-h-screen p-4 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Modern Header */}
          <header className="mb-8 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    PlanNow
                  </h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                  Organize your workflow with modern task management
                </p>
              </div>
              
              {/* Stats and Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-6 px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border border-white/20 dark:border-slate-700/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{getTotalTasks()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">{getCompletedTasks()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Done</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setIsFormOpen(true)} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-200"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <Droppable droppableId="todo">
                {(provided) => (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-lg">To Do</h2>
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                        {tasks.filter((task) => task.status === "todo").length}
                      </span>
                    </div>
                    <Column
                      title="To Do"
                      tasks={tasks.filter((task) => task.status === "todo")}
                      provided={provided}
                      onEdit={openEditForm}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="inProgress">
                {(provided) => (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-lg">In Progress</h2>
                      <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                        {tasks.filter((task) => task.status === "inProgress").length}
                      </span>
                    </div>
                    <Column
                      title="In Progress"
                      tasks={tasks.filter((task) => task.status === "inProgress")}
                      provided={provided}
                      onEdit={openEditForm}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="done">
                {(provided) => (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-lg">Done</h2>
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                        {tasks.filter((task) => task.status === "done").length}
                      </span>
                    </div>
                    <Column
                      title="Done"
                      tasks={tasks.filter((task) => task.status === "done")}
                      provided={provided}
                      onEdit={openEditForm}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>

          {/* Task Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
                setIsFormOpen(false)
                setEditingTask(null)
              }}></div>
              <div className="relative z-10 w-full max-w-md">
                <TaskForm
                  onSubmit={editingTask ? handleEditTask : handleAddTask}
                  onCancel={() => {
                    setIsFormOpen(false)
                    setEditingTask(null)
                  }}
                  initialData={editingTask}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}