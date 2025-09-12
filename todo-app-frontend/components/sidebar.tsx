"use client"

import { useState } from "react"
import { Home, CheckSquare, BarChart3, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: "home" | "todolist" | "dashboard") => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const navigationItems = [
    {
      id: "home" as const,
      label: "Home",
      icon: Home,
    },
    {
      id: "todolist" as const,
      label: "TodoList",
      icon: CheckSquare,
    },
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: BarChart3,
    },
  ]

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    logout()
    setIsSigningOut(false)
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = currentPage === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 text-left",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => onPageChange(item.id)}
            >
              <IconComponent className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}

        <div className="pt-4 border-t border-sidebar-border mt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-left text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </nav>
    </aside>
  )
}
