"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, BarChart3, User } from "lucide-react"

export function HomePage() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Tasks",
      value: "12",
      icon: CheckSquare,
      color: "text-primary",
    },
    {
      title: "Completed",
      value: "8",
      icon: BarChart3,
      color: "text-secondary",
    },
    {
      title: "In Progress",
      value: "4",
      icon: User,
      color: "text-accent",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to todo-list</h1>
        <p className="text-lg text-muted-foreground">Hello {user?.name}! Ready to organize your day?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-card-foreground">
            Welcome to your personal todo list application! Here you can manage all your tasks efficiently.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold text-card-foreground">Quick Actions:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Navigate to TodoList to manage your tasks</li>
              <li>Check your Dashboard for analytics and insights</li>
              <li>Use the sidebar to quickly switch between sections</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
