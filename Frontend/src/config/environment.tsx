const isProduction = import.meta.env.PROD
const URL_VERCEL_BACKEND = ""
const URL_VERCEL_FRONTEND = ""

export const ENV = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || (isProduction ? URL_VERCEL_BACKEND : "http://localhost:3000"),
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || (isProduction ? URL_VERCEL_FRONTEND : "http://localhost:5173")
}

export const API_URL = `${ENV.BACKEND_URL}/api`
