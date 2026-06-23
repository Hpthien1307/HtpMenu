import { Plus, Minus } from "lucide-react"
import { showToast } from "@/utils/showToasts"
import { useCart } from "@/hooks/useCart"

interface QuantityProps {
  productId: string
}

const Quantity = ({ productId }: QuantityProps) => {
  const { getQuantity, handleIncrease, handleDecrease } = useCart()
  const amount = getQuantity(productId)

  const increase = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleIncrease(productId)
  }

  const decrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (amount <= 0) {
      showToast.warning("Số lượng tối thiểu là 1")
      return
    }
    handleDecrease(productId)
  }

  return (
    <div className="quantity-block w-fit">
      <div className="flex items-center gap-6">
        <div className="quantity-block flex items-center gap-6 w-[10rem] h-[3.2rem]">
          <div className="flex space-x-2 h-full border rounded-[.4rem]">
            <button type="button" className=" w-[3rem] shrink-0 flex justify-center items-center bg-gray-100" onClick={decrease}>
              <Minus className="h-8 w-8" />
            </button>
            <div className="ip-value font-semibold text-black w-[2rem] h-full flex items-center justify-center text-center">{amount}</div>
            <button type="button" className=" w-[3rem] shrink-0 flex justify-center items-center bg-gray-100" onClick={increase}>
              <Plus className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quantity
