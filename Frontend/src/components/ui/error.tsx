import { Alert, AlertDescription } from "@/components/ui/alert"
import { CircleAlert } from "lucide-react"

function Error() {
  return (
    <Alert variant="destructive" className="w-fit mx-auto flex items-center bg-[#e7000b]/10">
      <CircleAlert className="size-10 align-middle" />
      <AlertDescription>Không thể tải dữ liệu</AlertDescription>
    </Alert>
  )
}

export default Error
