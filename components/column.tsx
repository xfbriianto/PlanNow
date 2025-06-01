"use client"

import { Draggable } from "@hello-pangea/dnd"
import TaskCard from "./task-card"
import type { Task } from "@/lib/types"

interface ColumnProps {
  title: string
  tasks: Task[]
  provided: any
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export default function Column({ title, tasks, provided, onEdit, onDelete }: ColumnProps) {
  // Clean, minimal styling like Notion
  const styles = {
    bg: "bg-white dark:bg-slate-900",
    border: "border-gray-200 dark:border-slate-700",
    headerText: "text-slate-800 dark:text-slate-200",
    countBg: "bg-gray-100 dark:bg-slate-800",
    countText: "text-slate-600 dark:text-slate-400"
  }

  return (
    <div className={`
      ${styles.bg} ${styles.border}
      border rounded-lg 
      shadow-sm hover:shadow-md transition-shadow duration-200
      flex flex-col h-[calc(100vh-16rem)] overflow-hidden
    `}>
      {/* Clean Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className={`font-medium text-sm ${styles.headerText}`}>
            {title}
          </h2>
          <div className={`
            ${styles.countBg} ${styles.countText}
            text-xs font-medium px-2 py-1 rounded
            min-w-[20px] text-center
          `}>
            {tasks.length}
          </div>
        </div>
      </div>

      {/* Tasks Container */}
      <div 
        className="flex-1 overflow-y-auto p-3"
        ref={provided.innerRef} 
        {...provided.droppableProps}
      >
        <div className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps}
                    className={`
                      transition-transform duration-150
                      ${snapshot.isDragging ? 'rotate-1 scale-105' : ''}
                    `}
                  >
                    <TaskCard 
                      task={task} 
                      onEdit={() => onEdit(task)} 
                      onDelete={() => onDelete(task.id)} 
                    />
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <div className="w-4 h-4 rounded bg-gray-300 dark:bg-slate-600"></div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No tasks
              </p>
            </div>
          )}
        </div>
        {provided.placeholder}
      </div>
    </div>
  )
}