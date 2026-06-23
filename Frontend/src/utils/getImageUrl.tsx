import { ENV } from "@/config/environment"

export const getImageUrl = (path: string) => {
  if (!path) return "/default.jpg"

  return `${ENV.BACKEND_URL}/uploads/${path}`
}
