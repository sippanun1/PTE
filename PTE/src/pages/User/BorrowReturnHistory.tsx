import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import type { BorrowTransaction } from "../../utils/borrowReturnLogger"

export default function BorrowReturnHistory() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "borrowed" | "returned">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const borrowHistoryQuery = query(
          collection(db, "borrowHistory"),
          orderBy("timestamp", "desc")
        )
        const snapshot = await getDocs(borrowHistoryQuery)
        const txns = snapshot.docs.map((doc) => doc.data() as BorrowTransaction)
        setTransactions(txns)
      } catch (error) {
        console.error("Error fetching borrow history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus = filter === "all" || txn.status === filter
    const matchesSearch =
      txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.equipmentItems.some((item) =>
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    return matchesStatus && matchesSearch
  })

  const getBorrowTypeText = (type: string) => {
    switch (type) {
      case "during-class":
        return "ยืมในคาบเรียน"
      case "teaching":
        return "ยืมใช้สอน"
      case "outside":
        return "ยืมนอกคาบเรียน"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    return status === "borrowed"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800"
  }

  const getStatusText = (status: string) => {
    return status === "borrowed" ? "ยังคืนไม่ได้" : "คืนแล้ว"
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
      <Header title="ประวัติการยืมและคืน" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center pb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="
              w-full
              py-3
              rounded-full
              border border-gray-400
              text-gray-600
              text-sm font-medium
              hover:bg-gray-100
              transition
              mb-6
            "
          >
            ย้อนกลับ
          </button>

          {/* Search Bar */}
          <div className="w-full mb-6 relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อ อีเมล หรืออุปกรณ์"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                h-10
                px-4
                border border-gray-300
                rounded-full
                outline-none
                text-sm
              "
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              🔍
            </button>
          </div>

          {/* Status Filter */}
          <div className="w-full mb-6 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-blue-500"
                }
              `}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilter("borrowed")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === "borrowed"
                    ? "bg-yellow-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-yellow-500"
                }
              `}
            >
              ยังคืนไม่ได้
            </button>
            <button
              onClick={() => setFilter("returned")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === "returned"
                    ? "bg-green-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-green-500"
                }
              `}
            >
              คืนแล้ว
            </button>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="w-full text-center text-gray-500 py-8">
              กำลังโหลด...
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="w-full flex flex-col gap-4">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.borrowId}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  {/* Header: User and Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {txn.userName}
                      </h3>
                      <p className="text-xs text-gray-600">{txn.userEmail}</p>
                      {txn.userIdNumber && (
                        <p className="text-xs text-gray-600">
                          {}รหัส: {txn.userIdNumber}
                        </p>
                      )}
                    </div>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${getStatusColor(txn.status)}
                      `}
                    >
                      {getStatusText(txn.status)}
                    </span>
                  </div>

                  {/* Borrow Type */}
                  <div className="mb-3 pb-3 border-b border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">ประเภทการยืม</p>
                    <p className="text-sm font-medium text-orange-600">
                      {getBorrowTypeText(txn.borrowType)}
                    </p>
                  </div>

                  {/* Equipment Items */}
                  <div className="mb-3 pb-3 border-b border-gray-300">
                    <p className="text-xs text-gray-600 mb-2">อุปกรณ์</p>
                    {txn.equipmentItems.map((item: any, idx: number) => (
                      <div key={idx} className="text-xs mb-1 ml-2">
                        <p className="text-gray-700">
                          • {item.equipmentName}
                          <span className="text-gray-600 ml-2">
                            ({item.quantityBorrowed} ชิ้น)
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Dates */}
                  <div className="mb-3 pb-3 border-b border-gray-300">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600">วันยืม:</span>
                      <span className="text-gray-800 font-medium">
                        {txn.borrowDate} {txn.borrowTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600">กำหนดคืน:</span>
                      <span className="text-gray-800 font-medium">
                        {txn.expectedReturnDate}
                      </span>
                    </div>
                    {txn.actualReturnDate && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">วันคืนจริง:</span>
                        <span className="text-gray-800 font-medium">
                          {txn.actualReturnDate} {txn.returnTime}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Condition */}
                  <div className="mb-3 pb-3 border-b border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">สภาพยืม</p>
                    <p className="text-xs text-gray-800">
                      {txn.conditionBeforeBorrow}
                    </p>
                    {txn.conditionOnReturn && (
                      <>
                        <p className="text-xs text-gray-600 mt-2 mb-1">
                          สภาพคืน
                        </p>
                        <p className="text-xs text-gray-800">
                          {txn.conditionOnReturn}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Damages if any */}
                  {txn.damagesAndIssues && (
                    <div className="mb-3 pb-3 border-b border-red-300 bg-red-50 p-2 rounded">
                      <p className="text-xs text-red-600 mb-1 font-semibold">
                        ⚠️ ปัญหาและความเสียหาย
                      </p>
                      <p className="text-xs text-red-800">
                        {txn.damagesAndIssues}
                      </p>
                    </div>
                  )}

                  {/* Return Info */}
                  {txn.returnedBy && (
                    <div className="text-xs text-gray-600">
                      <p>
                        คืนโดย: <span className="font-medium">{txn.returnedBy}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center text-gray-500 py-8">
              {searchTerm || filter !== "all"
                ? "ไม่พบข้อมูลการยืมและคืน"
                : "ยังไม่มีข้อมูลการยืมและคืน"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
