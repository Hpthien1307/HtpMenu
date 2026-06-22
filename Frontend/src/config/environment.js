const isProduction = import.meta.env.PROD

export const ENV = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || (isProduction ? "https://localshop-backend.vercel.app" : "http://localhost:5001"),
  FRONTEND_URL:
    import.meta.env.VITE_FRONTEND_URL || (isProduction ? "https://localshop-frontend-orcin.vercel.app" : "http://localhost:5173")
}

export const API_URL = `${ENV.BACKEND_URL}/api`
