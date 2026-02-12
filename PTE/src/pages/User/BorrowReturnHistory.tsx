import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../hooks/useAuth"
import type { BorrowTransaction } from "../../utils/borrowReturnLogger"

export default function BorrowReturnHistory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "scheduled" | "borrowed" | "returned" | "cancelled">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Query only the current user's borrow history
        const borrowHistoryQuery = query(
          collection(db, "borrowHistory"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        )
        const snapshot = await getDocs(borrowHistoryQuery)
        const txns = snapshot.docs.map((doc) => doc.data() as BorrowTransaction)
        setTransactions(txns)
      } catch (error) {
        console.error("Error fetching borrow history:", error)
        // Fallback: filter client-side if index not ready
        try {
          const fallbackQuery = query(
            collection(db, "borrowHistory"),
            orderBy("timestamp", "desc")
          )
          const snapshot = await getDocs(fallbackQuery)
          const allTxns = snapshot.docs.map((doc) => doc.data() as BorrowTransaction)
          // Filter by userId or userEmail
          const userTxns = allTxns.filter(
            (txn) => txn.userId === user.uid || txn.userEmail === user.email
          )
          setTransactions(userTxns)
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user])

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
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "borrowed":
        return "bg-yellow-100 text-yellow-800"
      case "returned":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "รอรับอุปกรณ์"
      case "borrowed":
        return "ยังไม่ได้คืน"
      case "returned":
        return "คืนแล้ว"
      case "cancelled":
        return "ยกเลิก"
      default:
        return status
    }
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
              onClick={() => setFilter("scheduled")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === "scheduled"
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-blue-500"
                }
              `}
            >
              รอรับอุปกรณ์
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
              ยังไม่ได้คืน
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
            <button
              onClick={() => setFilter("cancelled")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === "cancelled"
                    ? "bg-red-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-red-500"
                }
              `}
            >
              ยกเลิก
            </button>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="w-full text-center text-gray-500 py-8">
              กำลังโหลด...
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">วันที่ยืม</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">อุปกรณ์</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ประเภท</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">กำหนดคืน</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.borrowId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-900">
                        <div className="font-medium">{txn.borrowDate}</div>
                        <div className="text-gray-500">{txn.borrowTime}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {txn.equipmentItems.map((item, idx) => (
                          <div key={idx} className="mb-1">
                            <span className="font-medium">{item.equipmentName}</span>
                            <span className="text-gray-500 ml-1">({item.quantityBorrowed} ชิ้น)</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 font-medium">
                          {getBorrowTypeText(txn.borrowType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {txn.actualReturnDate ? (
                          <>
                            <div className="text-green-600 font-medium">{txn.actualReturnDate}</div>
                            <div className="text-gray-500">{txn.returnTime} (คืนแล้ว)</div>
                          </>
                        ) : (
                          <>
                            <div>{txn.expectedReturnDate}</div>
                            <div className="text-gray-500">{txn.expectedReturnTime || '-'}</div>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                          {getStatusText(txn.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
