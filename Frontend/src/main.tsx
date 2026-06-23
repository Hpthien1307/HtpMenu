import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "@/App"
import "@/global.css"
import { Provider } from "@/provider"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
      <Toaster position="top-right" richColors />
    </Provider>
  </StrictMode>
)
