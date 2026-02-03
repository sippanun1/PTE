import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import UserInfoBox from "../../components/UserInfoBox"

interface EquipmentItem {
  id: string
  name: string
  code: string
  checked: boolean
  quantity: number
  status: string
}

interface ReturnEquipmentProps {
  returnEquipment: EquipmentItem[]
  setReturnEquipment: (equipment: EquipmentItem[]) => void
}

export default function ReturnEquipment({ setReturnEquipment }: ReturnEquipmentProps) {
  const navigate = useNavigate()
  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    { id: "1", name: "ครุภัณฑ์", code: "T001", checked: true, quantity: 1, status: "ปกติ" },
    { id: "2", name: "ครุภัณฑ์", code: "T002", checked: true, quantity: 1, status: "ชำรุด" },
    { id: "3", name: "ชี้อุปกรณ์", code: "T003", checked: false, quantity: 0, status: "" }
  ])

  useEffect(() => {
    // Equipment initialization
  }, [])

  const handleCheckChange = (id: string) => {
    setEquipment(equipment.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const handleQuantityChange = (id: string, value: number) => {
    setEquipment(equipment.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, value) } : item
    ))
  }

  const handleStatusChange = (id: string, value: string) => {
    setEquipment(equipment.map(item =>
      item.id === id ? { ...item, status: value } : item
    ))
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
      <Header title="คืนอุปกรณ์/ครุภัณฑ์" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* User Info Box */}
          <UserInfoBox 
            userName="User (ชื่อ-สกุล)"
            date="จำหน่าย 30/05/68"
            time="เวลา: "
          />

          {/* Column Headers */}
          <div className="w-full flex justify-between text-xs font-semibold text-gray-700 mb-3 px-2">
            <div className="flex-1">รายการ</div>
            <div className="w-16 text-center">จำนวนคืน</div>
            <div className="w-24 text-center">หมายเหตุ</div>
          </div>

          {/* Equipment Items */}
          <div className="w-full space-y-3 mb-6">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3">
                {/* Single Row: Checkbox, Info, Quantity, Status */}
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckChange(item.id)}
                    className="w-5 h-5 flex-shrink-0 cursor-pointer accent-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-xs text-blue-500 font-medium">{item.code}</p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    disabled={!item.checked}
                    className="
                      w-14 h-7
                      px-2
                      border border-gray-300
                      rounded
                      text-xs text-center
                      outline-none
                      flex-shrink-0
                      disabled:bg-gray-100
                      disabled:text-gray-400
                    "
                  />

                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    disabled={!item.checked}
                    className="
                      w-28 h-7
                      px-3
                      border border-gray-300
                      rounded-full
                      text-xs
                      outline-none
                      cursor-pointer
                      flex-shrink-0
                      disabled:bg-gray-100
                      disabled:text-gray-400
                    "
                  >
                    <option value="">-- เลือก --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="ชำรุด">ชำรุด</option>
                    <option value="สูญหาย">สูญหาย</option>
                  </select>
                </div>
              </div>
            ))}
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
              ยืนยืน
            </button>
            <button
              onClick={() => {
                setReturnEquipment(equipment)
                navigate('/return/summary')
              }}
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
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
