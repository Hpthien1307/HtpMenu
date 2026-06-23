import React from "react"
import Menu from "@/pages/menu"
import Cart from "@/pages/cart"
import Feedback from "@/pages/feedback/index"

interface RouteConfig {
  path: string
  component: React.ComponentType
}

const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    component: Menu
  },
  {
    path: "/gio-hang",
    component: Cart
  },
  {
    path: "/gop-y",
    component: Feedback
  }
]

export default publicRoutes
