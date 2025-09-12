"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HomePage } from "@/components/pages/home-page"
// Update the import to match the actual export name from Registration-page.tsx
import { Registrationpage } from "@/components/pages/Registration-page"
import { DashboardPage } from "@/components/pages/dashboard-page"

type Page = "home" | "todolist" | "dashboard"

export function AppLayout() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
         return <HomePage /> 
      case "todolist":
        return <Registrationpage />
        // return <TodoListPage />
      case "dashboard":
        return <DashboardPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  )
}
