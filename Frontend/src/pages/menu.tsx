import Header from "@/components/header"
import WrapperMain from "@/components/wrapperMain"
import useFetch from "@/hooks/useFetch"
import { LayoutGrid, List } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Error from "@/components/ui/error"
import { ProductsItem, type ProductProps } from "@/components/productItem"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { FormatPrice } from "@/utils/formatters."
import { useCart } from "@/hooks/useCart"
import { API_URL } from "@/config/environment"

const Menu = () => {
  const { tableId: routeTableId } = useParams()
  const tableId = new URLSearchParams(window.location.search).get("tableId") || routeTableId
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list")
  const [activeCategoryId, setActiveCategoryId] = useState("")
  const [randomTable, setRandomTable] = useState<any>(null)
  const { cart, cartItemCount } = useCart()

  const handleDisplayMode = () => {
    setDisplayMode(prev => (prev === "list" ? "grid" : "list"))
  }

  const {
    data: products,
    isPending: isPendingProducts,
    error: errorProducts
  } = useFetch({
    url: `${API_URL}/products`,
    key: ["products"]
  })

  const {
    data: categories,
    isPending: isPendingCategories,
    error: errorCategories
  } = useFetch({
    url: `${API_URL}/categories`,
    key: ["categories"]
  })

  const {
    data: combos,
    isPending: isPendingCombos,
    error: errorCombos
  } = useFetch({
    url: `${API_URL}/products/combos`,
    key: ["combos"]
  })

  const { data: tables } = useFetch({
    url: `${API_URL}/tables`,
    key: ["tables"]
  })

  useEffect(() => {
    if (tables?.data && tables.data.length > 0 && !randomTable) {
      const randomIndex = Math.floor(Math.random() * tables.data.length)
      setRandomTable(tables.data[randomIndex])
    }
  }, [tables, randomTable])

  const currentFrontendUrl = window.location.origin
  const dynamicQrUrl = randomTable 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${currentFrontendUrl}/?tableId=${randomTable.id}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${currentFrontendUrl}/`

  const mergedCategories =
    categories?.data && combos?.data && combos.data.length > 0
      ? [...categories.data, { id: "combo-category-id", categoryName: "Combo" }]
      : categories?.data || []

  const mergedProducts =
    products?.data && combos?.data
      ? [
          ...products.data,
          ...combos.data.map((combo: any) => ({
            id: combo.id,
            productName: combo.comboName,
            price: combo.price,
            thumbnail: combo.thumbnail,
            isActive: combo.isActive,
            categoryId: "combo-category-id"
          }))
        ]
      : products?.data || []

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tableId = params.get("tableId") || routeTableId
    if (tableId) {
      localStorage.setItem("tableId", tableId)
    }
  }, [routeTableId])

  useEffect(() => {
    if (mergedCategories && mergedCategories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(mergedCategories[0].id)
    }
  }, [mergedCategories, activeCategoryId])

  useEffect(() => {
    const handleScroll = () => {
      if (!mergedCategories || mergedCategories.length === 0) return

      const header = document.querySelector(".header")
      const threshold = (header ? header.clientHeight : -580) + 100
      let currentActiveId = mergedCategories[0].id

      for (const category of mergedCategories) {
        const element = document.getElementById(`category-${category.id}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= threshold) {
            currentActiveId = category.id
          }
        }
      }

      setActiveCategoryId(currentActiveId)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [mergedCategories])

  const handleCategoryClick = (id: string) => {
    const element = document.getElementById(`category-${id}`)
    if (element) {
      const header = document.querySelector(".header")
      const headerOffset = header ? header.clientHeight : 180
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset + 10

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const totalPrice =
    (mergedProducts as ProductProps[] | undefined)?.reduce((sum: number, product) => {
      const qty = cart[product.id] || 0
      return sum + qty * (product.price || 0)
    }, 0) || 0

  const isPending = isPendingProducts || isPendingCategories || isPendingCombos
  const error = errorProducts || errorCategories || errorCombos

  return (
    <WrapperMain classCustom="page-menu">
      {window.innerWidth > 1024 && !tableId ? (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-y-6">
          <p className="font-semibold text-3xl">Vui lòng quét mã QR để order</p>
          <Link to={randomTable ? `/?tableId=${randomTable.id}` : "#"} className="w-[36rem] h-[36rem] aspect-square">
            <img src={dynamicQrUrl} alt="QRCode" className="contain-default w-full h-full" />
          </Link>
        </div>
      ) : (
        <>
          {/* header */}
          <Header activeCategoryId={activeCategoryId} onCategoryClick={handleCategoryClick} />

          {/* menu main */}
          <section className="sec-menu-main">
            <div className="menu-main">
              <div className="container">
                <div className="flex flex-col gap-y-6 ">
                  <div className="menu-main__header pb-6 border-b border-gray-200 flex justify-between gap-2 items-center">
                    <p>
                      Tất cả
                      <span className="font-semibold"> {mergedProducts?.length || 0} </span>
                      món
                    </p>
                    <div className="inline-flex items-center gap-4 rounded-full bg-gray-100 py-3 px-6">
                      <button type="button" onClick={handleDisplayMode} className={` ${displayMode === "list" ? "text-blue-600" : ""}`}>
                        <List size={20} />
                      </button>
                      |
                      <button type="button" onClick={handleDisplayMode} className={` ${displayMode === "grid" ? "text-blue-600" : ""}`}>
                        <LayoutGrid size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="menu-menu__body">
                    <div className="flex flex-col gap-y-8">
                      {isPending ? (
                        Array.from({ length: 5 }).map((_, index) => <Skeleton className="w-full h-[12rem] rounded-2xl" key={index} />)
                      ) : error ? (
                        <Error />
                      ) : (
                        mergedCategories?.map((category: any) => {
                          const categoryProducts =
                            mergedProducts?.filter((product: ProductProps) => product.categoryId === category.id) || []

                          if (categoryProducts.length === 0) return null

                          return (
                            <div key={category.id} id={`category-${category.id}`} className="flex flex-col gap-y-4">
                              <h3 className="text-3xl font-medium capitalize border-l-3 border-black pl-3 mb-4">
                                {category.categoryName}
                                <span> ({categoryProducts?.length})</span>
                              </h3>
                              <div className={`${displayMode === "list" ? "flex flex-col" : "grid grid-cols-2"} gap-6`}>
                                {categoryProducts.map((product: ProductProps) => (
                                  <ProductsItem key={product.id} product={{ ...product, layout: displayMode }} />
                                ))}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {cartItemCount > 0 && (
            <div className="fixed w-full bottom-6 left-1/2 -translate-x-1/2">
              <div className="container">
                <Link to={"/gio-hang"} className="flex justify-between items-center gap-2 bg-blue-600 p-4 text-white rounded-md shadow-lg">
                  <span>Xác nhận gọi món</span>
                  <div className="inline-flex items-center gap-4">
                    <span>{`${cartItemCount} món`}</span>|<span className="font-semibold">{FormatPrice(totalPrice)}</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </WrapperMain>
  )
}

export default Menu
