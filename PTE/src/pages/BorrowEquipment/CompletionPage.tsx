import Header from "../../components/Header"
import { type Equipment } from "../../data/equipment"

interface SelectedEquipment extends Equipment {
  selectedQuantity: number
}

interface CompletionPageProps {
  selectedItems: SelectedEquipment[]
  onNavigateHome: () => void
}

export default function CompletionPage({ selectedItems, onNavigateHome }: CompletionPageProps) {
  const totalItems = selectedItems.reduce((sum, item) => sum + item.selectedQuantity, 0)

  return (
    <div
      className="
        min-h-screen
        bg-white
        bg-[radial-gradient(#dbeafe_1px,transparent_1px)]
        bg-[length:18px_18px]
      "
    >
      {/* ===== SUCCESS HEADER ===== */}
      <Header title="ทำการยืมสำเร็จ" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* Borrowing Details */}
          <div className="w-full bg-gray-100 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">👤</span>
              <span className="text-gray-700">User (ชื่อ-สกุล)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>📅</span>
              <span>30/05/68 (วันที่ยืม)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>⏰</span>
              <span>เวลายืม</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>📋</span>
              <span>30/05/68 (กำหนดวันคืน)</span>
            </div>
          </div>

          {/* Equipment Summary */}
          <div className="w-full mb-6">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
              >
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {item.code} (รหัสปริมาณประกาศณ์บัญชีที่)
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  ประเภท: ยืมในคาบเรียน  ({selectedItems.length} รายการสิ่งของ)
                </p>
              </div>
            ))}
          </div>

          {/* Completion Button */}
          <button
            onClick={onNavigateHome}
            className="
              w-full
              px-6 py-2
              rounded-full
              bg-orange-500
              text-white
              text-sm font-medium
              hover:bg-orange-600
              transition
              mb-6
            "
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  )
}
