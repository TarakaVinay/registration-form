"use client"

import { Facebook, Twitter, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
      color: "hover:text-pink-500",
    },
    {
      name: "Skype",
      icon: MessageCircle,
      url: "https://skype.com",
      color: "hover:text-blue-500",
    },
  ]

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">TodoList App</h1>
        </div>

        <div className="flex items-center space-x-2">
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            return (
              <Button
                key={social.name}
                variant="ghost"
                size="sm"
                className={`text-muted-foreground ${social.color} transition-colors`}
                onClick={() => window.open(social.url, "_blank")}
              >
                <IconComponent className="h-4 w-4" />
                <span className="sr-only">{social.name}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
