import { useQuery } from "@tanstack/react-query"

interface UseQueryProps {
  url: string
  key: string[]
}

const useFetch = ({ url, key }: UseQueryProps) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error("Lỗi gọi dữ liệu hệ thống")
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 1
  })
}

export default useFetch
