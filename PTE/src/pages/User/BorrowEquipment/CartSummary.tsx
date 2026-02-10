import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../components/Header"
import type { SelectedEquipment } from "../../../App"

interface CartSummaryProps {
  cartItems: SelectedEquipment[]
  setCartItems: (items: SelectedEquipment[]) => void
}

export default function CartSummary({ cartItems, setCartItems }: CartSummaryProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<SelectedEquipment[]>(cartItems)

  const handleAddQuantity = (equipmentId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === equipmentId
          ? { ...item, selectedQuantity: item.selectedQuantity + 1 }
          : item
      )
    )
  }

  const handleRemoveQuantity = (equipmentId: string) => {
    setItems(prev =>
      prev
        .map(item =>
          item.id === equipmentId
            ? { ...item, selectedQuantity: Math.max(1, item.selectedQuantity - 1) }
            : item
        )
        .filter(item => item.selectedQuantity > 0)
    )
  }

  const handleRemoveItem = (equipmentId: string) => {
    setItems(prev => prev.filter(item => item.id !== equipmentId))
  }
  const handleConfirm = () => {
    setCartItems(items)
    navigate('/borrow/confirm')
  }

  return (
    <div
      className="
        min-h-screen
        bg-white
        bg-[radial-gradient(#dbeafe_1px,transparent_1px)]
        bg-[length:18px_18px]
      "
    >
      {/* ===== HEADER ===== */}
      <Header title="รายการยืม" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* Summary Header */}
          <div className="w-full bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👤</span>
                <span className="text-sm text-gray-700">User (ชื่อ-สกุล)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>30/05/68 (วันที่ยืม)</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span className="text-blue-600 font-medium">30/05/68 (กำหนดวันคืน)</span>
              </div>
            </div>
          </div>

          {/* Equipment Items */}
          <div className="w-full mb-6 space-y-3">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {item.code}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        สต็อค {item.available} ชิ้น
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRemoveQuantity(item.id)}
                          className="
                            w-7 h-7
                            rounded
                            border border-gray-400
                            text-gray-600
                            hover:bg-gray-100
                            transition
                            flex items-center justify-center
                          "
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.selectedQuantity}
                        </span>
                        <button
                          onClick={() => handleAddQuantity(item.id)}
                          className="
                            w-7 h-7
                            rounded
                            border border-gray-400
                            text-gray-600
                            hover:bg-gray-100
                            transition
                            flex items-center justify-center
                          "
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="
                          px-6 py-2
                          rounded-full
                          bg-orange-500
                          text-white
                          text-xs font-medium
                          hover:bg-orange-600
                          transition
                        "
                      >
                        ลบรายการ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                ไม่มีรายการสิ่งที่เลือก
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="w-full flex gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="
                flex-1
                px-4 py-2
                rounded-full
                border border-gray-400
                text-sm text-gray-600
                font-medium
                hover:bg-gray-100
                transition
              "
            >
              ย้อนกลับ
            </button>
            <button
              onClick={handleConfirm}
              disabled={items.length === 0}
              className={`
                flex-1
                px-4 py-2
                rounded-full
                text-sm font-medium
                text-white
                transition
                ${
                  items.length > 0
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              ทำรายการ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
