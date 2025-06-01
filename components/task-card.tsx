"use client"

import { Calendar, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import type { Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // Define priority badge colors with more subtle styling
  const getPriorityColor = () => {
    switch (task.priority) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800"
      default:
        return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
    }
  }

  return (
    <Card className="group border border-slate-200/90 dark:border-slate-700/90 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg hover:border-slate-300/80 dark:hover:border-slate-600/80 transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
            {task.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${getPriorityColor()} capitalize text-xs font-medium px-2 py-1 rounded-full shrink-0`}
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
          {task.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {task.deadline ? format(new Date(task.deadline), "MMM d, yyyy") : "No deadline"}
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit} 
            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 rounded-lg transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Edit task</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete} 
            className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}