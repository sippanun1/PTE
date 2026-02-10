import Header from "../../../components/Header"
import UserInfoBox from "../../../components/UserInfoBox"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface EquipmentItem {
  id: string
  name: string
  code: string
  checked: boolean
  quantity: number
  status: string
}

interface ReturnSummaryProps {
  returnEquipment: EquipmentItem[]
  setReturnEquipment: (equipment: EquipmentItem[]) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ปกติ":
      return "bg-green-500"
    case "ชำรุด":
      return "bg-red-500"
    case "สูญหาย":
      return "bg-yellow-500"
    default:
      return "bg-gray-400"
  }
}

export default function ReturnSummary({ returnEquipment, setReturnEquipment }: ReturnSummaryProps) {
  const navigate = useNavigate()
  const checkedItems = returnEquipment.filter(item => item.checked)
  const totalItems = checkedItems.length
  const totalQuantity = checkedItems.reduce((sum, item) => sum + item.quantity, 0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

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
      <Header title="สรุปรายการคืนอุปกรณ์" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* User Info Box */}
          <UserInfoBox 
            userName="User (ชื่อ-สกุล)"
            date="จำหน่าย 30/05/68"
            time="เวลา: "
          />

          {/* Equipment Summary Items */}
          <div className="w-full mb-6 space-y-3">
            {checkedItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-xs text-blue-500 font-medium">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">จำนวน</p>
                    <p className="text-sm font-semibold text-gray-800">x{item.quantity}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">สภาพ:</span>
                  <span className={`${getStatusColor(item.status)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">รวมรายการคืนทั้งหมด:</span>
              <span className="text-gray-800 font-semibold">{totalItems} รายการ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">รวมจำนวนทั้งหมด:</span>
              <span className="text-gray-800 font-semibold">{totalQuantity} ชิ้น</span>
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
              onClick={() => setShowConfirmModal(true)}
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
              ยืนยืน
            </button>
          </div>
        </div>
      </div>

      {/* ===== CONFIRM MODAL ===== */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[320px] mx-4 flex flex-col items-center overflow-hidden">
            {/* Modal Header - Orange */}
            <Header title="" />

            {/* Modal Content */}
            <div className="pt-5 w-full px-6 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-sm font-semibold">โปรดตรวจสอบข้อมูลให้ถูกต้อง<br />เมื่อกดยืนยันแล้ว จะไม่สามารถแก้ไขได้</p>
              </div>
            {/* Modal Buttons */}
            <div className="w-full px-6 py-6 flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setReturnEquipment([])
                  navigate('/home')
                }}
                className="
                  flex-1
                  py-2
                  rounded-full
                  bg-orange-500
                  text-white
                  text-sm font-medium
                  hover:bg-orange-600
                  transition
                "
              >
                ยืนยัน
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="
                  flex-1
                  py-2
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
