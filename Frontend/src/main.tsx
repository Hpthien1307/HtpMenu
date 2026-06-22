import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "@/App"
import "@/global.css"
import "@/scss/style.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
