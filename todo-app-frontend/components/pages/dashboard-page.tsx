"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, TrendingUp, Target, Calendar, BarChart3 } from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  activeTasks: number
  completionRate: number
  todayTasks: number
  weekTasks: number
}

export function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    completionRate: 0,
    todayTasks: 0,
    weekTasks: 0,
  })

  useEffect(() => {
    // Load todos from localStorage
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }))
      setTodos(parsedTodos)
      calculateStats(parsedTodos)
    }
  }, [])

  const calculateStats = (todoList: Todo[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const totalTasks = todoList.length
    const completedTasks = todoList.filter((todo) => todo.completed).length
    const activeTasks = totalTasks - completedTasks
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const todayTasks = todoList.filter((todo) => todo.createdAt >= today).length

    const weekTasks = todoList.filter((todo) => todo.createdAt >= weekAgo).length

    setStats({
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      todayTasks,
      weekTasks,
    })
  }

  const recentTodos = todos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const productivityLevel = () => {
    if (stats.completionRate >= 80) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
    if (stats.completionRate >= 60) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
    if (stats.completionRate >= 40) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-100" }
  }

  const productivity = productivityLevel()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Badge variant="secondary" className={`${productivity.bg} ${productivity.color}`}>
          {productivity.level}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">{stats.completionRate.toFixed(1)}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Pending completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weekTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks created</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion</span>
                <span>{stats.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{stats.completedTasks}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.activeTasks}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTodos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks yet</p>
            ) : (
              <div className="space-y-3">
                {recentTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between">
                    <div className="flex-1 truncate">
                      <p className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.text}
                      </p>
                      <p className="text-xs text-muted-foreground">{todo.createdAt.toLocaleDateString()}</p>
                    </div>
                    <Badge variant={todo.completed ? "secondary" : "default"} className="ml-2">
                      {todo.completed ? "Done" : "Active"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">Today</div>
              <div className="text-2xl font-bold text-primary">{stats.todayTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks created</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">This Week</div>
              <div className="text-2xl font-bold text-secondary">{stats.weekTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks created</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">Productivity</div>
              <div className={`text-2xl font-bold ${productivity.color}`}>{productivity.level}</div>
              <div className="text-sm text-muted-foreground">Current level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}