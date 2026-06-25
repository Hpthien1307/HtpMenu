import Header from "@/components/header"
import WrapperMain from "@/components/wrapperMain"
import useFetch from "@/hooks/useFetch"
import { LayoutGrid, List, Sparkles, ShoppingBag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Error from "@/components/ui/error"
import { ProductsItem, type ProductProps } from "@/components/productItem"
import { useState, useEffect, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { FormatPrice } from "@/utils/formatters."
import { useCart } from "@/hooks/useCart"
import { API_URL } from "@/config/environment"
import { showToast } from "@/utils/showToasts"

const Menu = () => {
  const { tableId: routeTableId } = useParams()
  const tableId = new URLSearchParams(window.location.search).get("tableId") || routeTableId
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list")
  const [activeCategoryId, setActiveCategoryId] = useState("")
  const [randomTable, setRandomTable] = useState<any>(null)
  const { cart, cartItemCount, handleIncrease, addItemsToCart } = useCart()

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

  const [weather, setWeather] = useState("Trời nắng nóng ☀️")

  const {
    data: recommendations,
    isPending: isPendingRecs,
    error: errorRecs
  } = useFetch({
    url: `${API_URL}/ai/recommendations?weather=${encodeURIComponent(weather)}`,
    key: ["recommendations", weather]
  })

  const recommendedProducts = useMemo(() => {
    if (!recommendations?.recommendedProductIds || !products?.data) return []
    return products.data.filter((p: any) => recommendations.recommendedProductIds.includes(p.id))
  }, [recommendations?.recommendedProductIds, products?.data])

  const comboProducts = useMemo(() => {
    if (!recommendations?.smartCombo?.productIds || !products?.data) return []
    return products.data.filter((p: any) => recommendations.smartCombo.productIds.includes(p.id))
  }, [recommendations?.smartCombo?.productIds, products?.data])

  const originalComboPrice = useMemo(() => {
    return comboProducts.reduce((sum: number, p: any) => sum + (p.price || 0), 0)
  }, [comboProducts])

  const mergedCategories = useMemo(() => {
    return categories?.data && combos?.data && combos.data.length > 0
      ? [{ id: "combo-category-id", categoryName: "Combo" }, ...categories.data]
      : categories?.data || []
  }, [categories?.data, combos?.data])

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
          <p className="font-semibold text-3xl">Vui lòng quét mã QR để ord</p>
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
                  {/* AI Recommendation Banner */}
                  <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-slate-900/60 dark:via-slate-950/60 dark:to-slate-900/60 border border-blue-100/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-md backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-100/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold">
                          <Sparkles size={20} className=" text-amber-500" />
                          <span>Gợi ý từ AI</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mt-2 text-slate-800 dark:text-white">Gợi ý cho ngày {weather} 🌟</h2>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { label: "Nắng nóng ☀️", value: "Trời nắng nóng" },
                          { label: "Mưa lạnh 🌧️", value: "Trời mưa lạnh" },
                          { label: "Mát mẻ 🍃", value: "Trời mát mẻ" },
                          { label: "Se lạnh 🌌", value: "Trời se lạnh" }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setWeather(opt.label)}
                            className={`px-6 py-3 text-2xl rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                              weather === opt.label
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isPendingRecs ? (
                      <div className="mt-6 space-y-4">
                        <Skeleton className="h-6 w-1/3 rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                      </div>
                    ) : errorRecs ? (
                      <div className="mt-4 text-sm text-red-500 text-center py-4">Không thể tải gợi ý món ăn từ AI lúc này.</div>
                    ) : recommendations ? (
                      <div className="mt-5 space-y-5">
                        {/* Smart Combo Card */}
                        {recommendations.smartCombo && (
                          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col md:flex-row justify-between gap-5">
                            <div className="flex-1 space-y-2">
                              <div className="inline-flex items-center gap-1 bg-amber-500 text-white text-xl font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                Combo khuyên dùng
                              </div>
                              <h3 className=" font-bold text-slate-800 dark:text-white">{recommendations.smartCombo.comboName}</h3>
                              <p className="italic text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                "{recommendations.smartCombo.reason}"
                              </p>

                              {/* Combo items list */}
                              <div className="flex items-center gap-2 mt-3 flex-wrap">
                                {comboProducts.map((p: any, idx: number) => (
                                  <div
                                    key={p.id}
                                    className="flex items-center gap-1.5 bg-white/70 dark:bg-black/30 px-2 py-1 rounded-lg font-semibold border border-amber-500/15"
                                  >
                                    {p.thumbnail && (
                                      <img src={p.thumbnail} alt={p.productName} className="w-5 h-5 rounded-full object-cover" />
                                    )}
                                    <span className="text-slate-700 dark:text-slate-200">{p.productName}</span>
                                    {idx < comboProducts.length - 1 && <span className="text-amber-500 font-bold ml-1">+</span>}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end justify-center min-w-[150px] border-t md:border-t-0 md:border-l border-amber-500/10 pt-4 md:pt-0 md:pl-5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="line-through text-smxl text-slate-400 dark:text-slate-500 font-medium">
                                  {FormatPrice(originalComboPrice)}
                                </span>
                                <span className="bg-red-100 text-2xl dark:bg-red-950/80 text-red-600 dark:text-red-300 font-bold px-1.5 py-0.5 rounded">
                                  Tiết kiệm {FormatPrice(originalComboPrice - recommendations.smartCombo.discountPrice)}
                                </span>
                              </div>
                              <span className="font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                                {FormatPrice(recommendations.smartCombo.discountPrice)}
                              </span>
                              <button
                                onClick={() => {
                                  if (recommendations.smartCombo?.productIds) {
                                    addItemsToCart(recommendations.smartCombo.productIds)
                                    showToast.success(`Đã thêm ${recommendations.smartCombo.comboName} vào giỏ hàng!`)
                                  }
                                }}
                                className="mt-3 cursor-pointer w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 uppercase tracking-wide"
                              >
                                <ShoppingBag className="size-3.5" />
                                Chọn combo này
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Recommended Individual Products */}
                        {recommendedProducts.length > 0 && (
                          <div>
                            <p className="text-xl font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                              Món lẻ gợi ý cho bạn
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {recommendedProducts.map((product: any) => (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:shadow-sm transition-all duration-150"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {product.thumbnail && (
                                      <img
                                        src={product.thumbnail}
                                        alt={product.productName}
                                        className="w-28 aspect-square rounded-lg object-cover shrink-0"
                                      />
                                    )}
                                    <div className="min-w-0">
                                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{product.productName}</h4>
                                      <p className="text-xl text-slate-500 font-medium mt-0.5">{FormatPrice(product.price)}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      handleIncrease(product.id)
                                      showToast.success(`Đã thêm ${product.productName} vào giỏ hàng!`)
                                    }}
                                    className="cursor-pointer p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 text-blue-600 dark:text-blue-400 transition-all duration-150 shrink-0"
                                  >
                                    <ShoppingBag size={20} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

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
