import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"

interface BorrowRecord {
  id: string
  borrowCode: string
  quantity: number
  equipmentName: string
  equipmentType: "asset" | "consumable"
  borrowDate: string
  returnDate: string
  status: "borrowed" | "returned"
}

export default function BorrowReturnHistory() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<"borrow" | "return" | "history">("borrow")
  const [selectedType, setSelectedType] = useState<"asset" | "consumable">("asset")

  const [borrowHistory] = useState<BorrowRecord[]>([
    {
      id: "1",
      borrowCode: "A001",
      quantity: 5,
      equipmentName: "หนังสือสาย",
      equipmentType: "asset",
      borrowDate: "19/09/2025",
      returnDate: "21/09/2025",
      status: "returned"
    },
    {
      id: "2",
      borrowCode: "A002",
      quantity: 3,
      equipmentName: "คอมพิวเตอร์",
      equipmentType: "asset",
      borrowDate: "18/09/2025",
      returnDate: "20/09/2025",
      status: "borrowed"
    },
    {
      id: "3",
      borrowCode: "C001",
      quantity: 10,
      equipmentName: "กระดาษA4",
      equipmentType: "consumable",
      borrowDate: "17/09/2025",
      returnDate: "19/09/2025",
      status: "returned"
    },
    {
      id: "4",
      borrowCode: "C002",
      quantity: 5,
      equipmentName: "ปากกา",
      equipmentType: "consumable",
      borrowDate: "16/09/2025",
      returnDate: "18/09/2025",
      status: "borrowed"
    },
    {
      id: "5",
      borrowCode: "A003",
      quantity: 2,
      equipmentName: "โปรเจคเตอร์",
      equipmentType: "asset",
      borrowDate: "15/09/2025",
      returnDate: "17/09/2025",
      status: "returned"
    }
  ])

  const filteredHistory = borrowHistory.filter(record => record.equipmentType === selectedType)

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HEADER ===== */}
      <Header title="ประวัติการยืม/คืน" />

      {/* ===== BACK BUTTON ===== */}
      <div className="mt-8 px-4">
        <div className="w-full max-w-4xl mx-auto mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm font-semibold transition"
          >
            ← ย้อนกลับ
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* View Mode Buttons */}
          <div className="flex gap-4 mb-8 justify-center">
                        <button
              onClick={() => setViewMode("history")}
              className={`
                px-8 py-3 rounded-full text-base font-semibold transition
                ${viewMode === "history"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              ประวัติ
            </button>
            <button
              onClick={() => setViewMode("borrow")}
              className={`
                px-8 py-3 rounded-full text-base font-semibold transition
                ${viewMode === "borrow"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              ยืม
            </button>
            <button
              onClick={() => setViewMode("return")}
              className={`
                px-8 py-3 rounded-full text-base font-semibold transition
                ${viewMode === "return"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              คืน
            </button>
          </div>

          {/* Borrow View - Equipment being borrowed */}
          {viewMode === "borrow" && (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      รหัสการยืม
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      จำนวนยืม
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      ชื่ออุปกรณ์
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      ประเภท
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      วันที่ยืม
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      กำหนดคืน
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      การดำเนิน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {borrowHistory.filter(r => r.status === "borrowed").length > 0 ? (
                    borrowHistory
                      .filter(r => r.status === "borrowed")
                      .map((record) => (
                        <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                              {record.borrowCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.equipmentName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.equipmentType === "asset" ? "ครุภัณฑ์" : "วัสดุสิ้นเปลือง"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.borrowDate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.returnDate}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-medium transition">
                              บันทึกคืน
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        ไม่มีอุปกรณ์ที่ยืมอยู่
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Return View - Equipment that has been returned */}
          {viewMode === "return" && (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      รหัสการยืม
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      จำนวนยืม
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      ชื่ออุปกรณ์
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      ประเภท
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      วันที่ยืม
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      วันที่คืน
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      การดำเนิน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {borrowHistory.filter(r => r.status === "returned").length > 0 ? (
                    borrowHistory
                      .filter(r => r.status === "returned")
                      .map((record) => (
                        <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              {record.borrowCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.equipmentName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.equipmentType === "asset" ? "ครุภัณฑ์" : "วัสดุสิ้นเปลือง"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.borrowDate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.returnDate}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition">
                              ดูรายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        ไม่มีอุปกรณ์ที่คืนแล้ว
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* History View - All borrow and return records */}
          {viewMode === "history" && (
            <>
              {/* Equipment Type Filter Buttons */}
              <div className="flex gap-4 mb-8 justify-center">
                <button
                  onClick={() => setSelectedType("asset")}
                  className={`
                    px-8 py-3 rounded-full text-base font-semibold transition
                    ${selectedType === "asset"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  ครุภัณฑ์
                </button>
                <button
                  onClick={() => setSelectedType("consumable")}
                  className={`
                    px-8 py-3 rounded-full text-base font-semibold transition
                    ${selectedType === "consumable"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  วัสดุสิ้นเปลือง
                </button>
              </div>

              {/* History Table */}
              <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        รหัสการยืม
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        จำนวนยืม
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ชื่ออุปกรณ์
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        วันที่ยืม
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        วันที่คืน
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record) => (
                        <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  record.status === "borrowed"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                                }`}
                              ></span>
                              {record.borrowCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.equipmentName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.borrowDate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.returnDate}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                record.status === "borrowed"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {record.status === "borrowed" ? "ยังจะคืน" : "คืนแล้ว"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          ไม่มีข้อมูลการยืม/คืน
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
