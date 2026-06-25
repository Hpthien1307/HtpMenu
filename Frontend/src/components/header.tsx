import { Search, BookText, MessageCircle, XCircle } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import useFetch from "@/hooks/useFetch"
import { Skeleton } from "@/components/ui/skeleton"
import Error from "@/components/ui/error"
import { API_URL } from "@/config/environment"
import { ProductsItem } from "@/components/productItem"

interface HeaderProps {
  activeCategoryId?: string
  onCategoryClick?: (id: string) => void
}

const Header = ({ activeCategoryId, onCategoryClick }: HeaderProps) => {
  const {
    data: categories,
    isPending: isPendingCategories,
    error: errorCategories
  } = useFetch({ url: `${API_URL}/categories`, key: ["categories"] })
  const { data: combos, isPending: isPendingCombos, error: errorCombos } = useFetch({ url: `${API_URL}/products/combos`, key: ["combos"] })
  const [toggle, setToggle] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const isPending = isPendingCategories || isPendingCombos
  const error = errorCategories || errorCombos

  const mergedCategories =
    categories?.data && combos?.data && combos.data.length > 0
      ? [{ id: "combo-category-id", categoryName: "Combo" }, ...categories.data]
      : categories?.data || []

  const handleToggle = () => {
    setToggle(prev => {
      const nextToggle = !prev
      if (!nextToggle) {
        setSearchQuery("")
        setSearchResults([])
      }
      return nextToggle
    })
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/products/search?keyword=${encodeURIComponent(searchQuery)}`)
        const resData = await response.json()
        if (resData && resData.data) {
          setSearchResults(resData.data)
        } else {
          setSearchResults([])
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm sản phẩm:", err)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    if (activeCategoryId) {
      const activeElement = document.getElementById(`header-cate-${activeCategoryId}`)
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        })
      }
    }
  }, [activeCategoryId])

  const { tableId: routeTableId } = useParams()
  const [tableNumber, setTableNumber] = useState("...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const currentTableId = params.get("tableId") || routeTableId || localStorage.getItem("tableId")

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentTableId || "")

    if (currentTableId && isUuid) {
      localStorage.setItem("tableId", currentTableId)
      fetch(`${API_URL}/tables/${currentTableId}`)
        .then(res => res.json())
        .then(resData => {
          if (resData && resData.data && resData.data.tableNumber) {
            setTableNumber(resData.data.tableNumber)
          } else {
            setTableNumber(currentTableId)
          }
        })
        .catch(() => {
          setTableNumber("...")
        })
    } else {
      // Fallback: Fetch all tables and default to "Bàn 10" or the first available table
      fetch(`${API_URL}/tables`)
        .then(res => res.json())
        .then(resData => {
          if (resData && resData.data && resData.data.length > 0) {
            const table10 = resData.data.find((t: any) => t.tableNumber.includes("10"))
            const fallbackTable = table10 || resData.data[0]

            localStorage.setItem("tableId", fallbackTable.id)
            setTableNumber(fallbackTable.tableNumber)
          } else {
            setTableNumber("Chưa chọn bàn")
          }
        })
        .catch(() => {
          setTableNumber("Chưa chọn bàn")
        })
    }
  }, [routeTableId])

  return (
    <header className="header sticky z-50 top-0 left-0 w-full mb-6">
      {/* header main */}
      <div className="header-in rounded-b-4xl bg-blue-600">
        <div className="container">
          <div className="header-wrap h-full flex flex-col gap-y-4 py-6">
            <span className="font-semibold uppercase text-3xl text-white">
              {tableNumber.toLowerCase().startsWith("bàn") ? tableNumber : `bàn ${tableNumber}`}
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleToggle}
                className={`${toggle ? "hidden" : "flex"} p-4 bg-white flex items-center justify-center rounded-2xl w-[4.8rem] h-[4.8rem] max-md:h-[4rem]`}
              >
                <Search size={24} />
              </button>
              <div
                className={`${toggle ? "hidden" : "flex"} items-center gap-4 p-6 bg-white flex items-center justify-center 
                rounded-2xl w-full h-[4.8rem] max-md:h-[4rem]`}
              >
                <Link to="/gop-y" className="flex-1 flex items-center gap-2 max-sm:justify-center">
                  <MessageCircle size={20} />
                  <span>Góp ý</span>
                </Link>
                |
                <Link to="/gio-hang" className="flex-1 flex items-center gap-2 max-sm:justify-center">
                  <BookText size={20} />
                  <span>Món đã gọi</span>
                </Link>
              </div>
              <div className={`w-full items-center gap-4 ${toggle ? "flex" : "hidden"} relative`}>
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-full h-[4.8rem] max-md:h-[4rem] px-4 py-6 bg-white rounded-2xl text-black font-normal"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="button" onClick={handleToggle}>
                  <XCircle className="text-white" size={30} />
                </button>
                {searchQuery.trim() && (
                  <div className="absolute top-[110%] left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[30rem] overflow-y-auto p-4 flex flex-col gap-4 text-black">
                    {isSearching ? (
                      <div className="text-xl text-gray-500 text-center py-4">Đang tìm kiếm...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-xl text-gray-500 text-center py-4">Không tìm thấy món ăn nào</div>
                    ) : (
                      searchResults.map((product: any) => (
                        <ProductsItem
                          key={product.id}
                          product={{
                            id: product.id,
                            productName: product.productName,
                            price: product.price,
                            thumbnail: product.thumbnail,
                            isActive: product.isActive,
                            layout: "list"
                          }}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* categories */}
      <div className="header-cate overflow-hidden py-6 border-b border-gray-3 bg-white">
        <div className="container">
          <div className="flex flex-nowrap gap-4 overflow-x-auto no-scrollbar max-md:gap-2">
            {isPending ? (
              Array.from({ length: 5 }).map((_, index) => <Skeleton className="w-[20rem] h-[4.8rem] rounded-full" key={index} />)
            ) : error ? (
              <Error />
            ) : (
              mergedCategories?.map((category: any) => (
                <button
                  key={category.id}
                  id={`header-cate-${category.id}`}
                  type="button"
                  onClick={() => onCategoryClick?.(category.id)}
                  className={`w-fit uppercase py-3 px-6 rounded-full text-2xl transition-all duration-300 whitespace-nowrap border ${
                    activeCategoryId === category.id
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "bg-white text-gray-700 border-gray-400 font-normal hover:text-blue-600 hover:border-blue-600"
                  }`}
                >
                  <span>{category.categoryName}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
