import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import type { SelectedEquipment } from "../../App"

interface ConfirmSummaryProps {
  cartItems: SelectedEquipment[]
  setCartItems?: (items: SelectedEquipment[]) => void
}

export default function ConfirmSummary({ cartItems }: ConfirmSummaryProps) {
  const navigate = useNavigate()
  const totalItems = cartItems.reduce((sum, item) => sum + item.selectedQuantity, 0)

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
      <Header title="ตรวจสอบรายการก่อนยืนยัน" />

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

          {/* Equipment Summary List */}
          <div className="w-full mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">รายการยืมทั้งหมด ({totalItems} รายการ)</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                    <p className="text-xs text-green-600 font-medium">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{item.selectedQuantity}</p>
                    <p className="text-xs text-gray-500">ชิ้น</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-800">รวมจำนวนอุปกรณ์ทั้งหมด</span>
              <span className="text-lg font-bold text-orange-500">{totalItems} รายการ</span>
            </div>
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
              onClick={() => navigate('/borrow/completion')}
              className="
                flex-1
                px-4 py-2
                rounded-full
                bg-orange-500
                text-white
                text-sm font-medium
                hover:bg-orange-600
                transition
              "
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
