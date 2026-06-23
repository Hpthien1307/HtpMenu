// utils/toast.js
import { toast } from "sonner"

export const showToast = {
  success: (msg: string) =>
    toast.success(msg, {
      style: {
        background: "#052e16",
        color: "#86efac",
        border: "1px solid #166534",
        borderRadius: "0.6rem",
        fontSize: "1.4rem",
        fontWeight: "500"
      },
      icon: "✓"
    }),

  error: (msg: string) =>
    toast.error(msg, {
      style: {
        background: "#450a0a",
        color: "#fca5a5",
        border: "1px solid #7f1d1d",
        borderRadius: "0.6rem",
        fontSize: "1.4rem",
        fontWeight: "500"
      },
      icon: "✕"
    }),

  warning: (msg: string) =>
    toast.warning(msg, {
      style: {
        background: "#422006",
        color: "#fcd34d",
        border: "1px solid #92400e",
        borderRadius: "0.6rem",
        fontSize: "1.4rem",
        fontWeight: "500"
      },
      icon: "⚠"
    }),

  info: (msg: string) =>
    toast.info(msg, {
      style: {
        background: "#172554",
        color: "#93c5fd",
        border: "1px solid #1e40af",
        borderRadius: "0.6rem",
        fontSize: "1.4rem",
        fontWeight: "500"
      },
      icon: "ℹ"
    })
}
