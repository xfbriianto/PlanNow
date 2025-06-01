"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  onSubmit: (task: any) => void
  onCancel: () => void
  initialData?: Task | null
}

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [priority, setPriority] = useState(initialData?.priority || "medium")
  const [deadline, setDeadline] = useState<Date | undefined>(
    initialData?.deadline ? new Date(initialData.deadline) : undefined,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const task = {
      ...(initialData && { id: initialData.id, status: initialData.status }),
      title,
      description,
      priority,
      deadline: deadline?.toISOString(),
    }

    onSubmit(task)
  }

  const getPriorityColor = (value: string) => {
    switch (value) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-orange-600 dark:text-orange-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        {/* Clean Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {initialData ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Task Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 bg-white dark:bg-slate-900"
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task description..."
              rows={3}
              className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 bg-white dark:bg-slate-900 resize-none"
            />
          </div>

          {/* Priority and Deadline */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <Select value={priority} onValueChange={(value: string) => setPriority(value as "low" | "medium" | "high")}>
                <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 bg-white dark:bg-slate-900">
                  <SelectValue placeholder="Priority">
                    <span className={getPriorityColor(priority)}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  <SelectItem value="low" className="focus:bg-slate-50 dark:focus:bg-slate-800">
                    <span className="text-green-600 dark:text-green-400">Low</span>
                  </SelectItem>
                  <SelectItem value="medium" className="focus:bg-slate-50 dark:focus:bg-slate-800">
                    <span className="text-orange-600 dark:text-orange-400">Medium</span>
                  </SelectItem>
                  <SelectItem value="high" className="focus:bg-slate-50 dark:focus:bg-slate-800">
                    <span className="text-red-600 dark:text-red-400">High</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                    <span className={deadline ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}>
                      {deadline ? format(deadline, "MMM d, yyyy") : "Select date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  <Calendar 
                    mode="single" 
                    selected={deadline} 
                    onSelect={setDeadline} 
                    initialFocus 
                    className="bg-white dark:bg-slate-900"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </form>

        {/* Clean Footer */}
        <DialogFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 sm:flex-none border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="flex-1 sm:flex-none bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}