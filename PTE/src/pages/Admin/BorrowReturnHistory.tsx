import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../hooks/useAuth"
import { logAdminAction } from "../../utils/adminLogger"
import type { BorrowTransaction } from "../../utils/borrowReturnLogger"
import { confirmBorrowTransaction, cancelBorrowTransaction } from "../../utils/borrowReturnLogger"

export default function BorrowReturnHistory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "scheduled" | "borrowed" | "returned" | "cancelled">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [borrowTypeFilter, setBorrowTypeFilter] = useState<"all" | "during-class" | "teaching" | "outside">("all")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "custom">("all")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

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

  // Date filter logic
  const isWithinDateRange = (borrowDate: string) => {
    if (dateFilter === 'all') return true
    
    // Parse borrowDate (format: DD/MM/YYYY or YYYY-MM-DD)
    let txnDate: Date
    if (borrowDate.includes('/')) {
      const [day, month, year] = borrowDate.split('/')
      txnDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    } else {
      txnDate = new Date(borrowDate)
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    switch (dateFilter) {
      case 'today':
        const todayEnd = new Date(today)
        todayEnd.setHours(23, 59, 59, 999)
        return txnDate >= today && txnDate <= todayEnd
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return txnDate >= weekAgo
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return txnDate >= monthAgo
      case 'custom':
        if (!customStartDate && !customEndDate) return true
        const start = customStartDate ? new Date(customStartDate) : new Date('1970-01-01')
        const end = customEndDate ? new Date(customEndDate + 'T23:59:59') : new Date()
        return txnDate >= start && txnDate <= end
      default:
        return true
    }
  }

  // Check if any filter is active
  const hasActiveFilters = filter !== 'all' || borrowTypeFilter !== 'all' || dateFilter !== 'all' || searchTerm !== ''

  const clearFilters = () => {
    setFilter('all')
    setBorrowTypeFilter('all')
    setDateFilter('all')
    setSearchTerm('')
    setCustomStartDate('')
    setCustomEndDate('')
  }

  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus = filter === "all" || txn.status === filter
    const matchesBorrowType = borrowTypeFilter === "all" || txn.borrowType === borrowTypeFilter
    const matchesSearch =
      txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.equipmentItems.some((item) =>
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    const matchesDate = isWithinDateRange(txn.borrowDate)
    return matchesStatus && matchesBorrowType && matchesSearch && matchesDate
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

          {/* Collapsible Filter Section */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg mb-6 overflow-hidden">
            {/* Filter Header - Always Visible */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">🔧 ตัวกรอง</span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                    กำลังใช้งาน
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  พบ <span className="font-semibold text-blue-600">{filteredTransactions.length}</span> รายการ
                </span>
                <span className={`text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>
            
            {/* Collapsible Filter Content */}
            {showFilters && (
              <div className="px-4 pb-4 border-t border-gray-200">
                {/* Status Filter */}
                <div className="mt-4 mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">สถานะ:</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: 'all', label: 'ทั้งหมด', color: 'gray' },
                      { key: 'scheduled', label: 'รอรับอุปกรณ์', color: 'blue' },
                      { key: 'borrowed', label: 'ยังไม่ได้คืน', color: 'yellow' },
                      { key: 'returned', label: 'คืนแล้ว', color: 'green' },
                      { key: 'cancelled', label: 'ยกเลิก', color: 'red' }
                    ].map((status) => (
                      <button
                        key={status.key}
                        onClick={() => setFilter(status.key as typeof filter)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          filter === status.key
                            ? status.color === 'gray' ? "bg-gray-700 text-white"
                            : status.color === 'blue' ? "bg-blue-500 text-white"
                            : status.color === 'yellow' ? "bg-yellow-500 text-white"
                            : status.color === 'green' ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                            : "border border-gray-300 text-gray-700 hover:border-gray-500"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Borrow Type Filter */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">ประเภทการยืม:</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: 'all', label: 'ทั้งหมด' },
                      { key: 'during-class', label: 'ยืมในคาบเรียน' },
                      { key: 'teaching', label: 'ยืมใช้สอน' },
                      { key: 'outside', label: 'ยืมนอกคาบเรียน' }
                    ].map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setBorrowTypeFilter(type.key as typeof borrowTypeFilter)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          borrowTypeFilter === type.key
                            ? "bg-orange-500 text-white"
                            : "border border-gray-300 text-gray-700 hover:border-orange-500"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">ช่วงเวลา:</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: 'all', label: 'ทั้งหมด' },
                      { key: 'today', label: 'วันนี้' },
                      { key: 'week', label: '7 วันที่ผ่านมา' },
                      { key: 'month', label: '30 วันที่ผ่านมา' },
                      { key: 'custom', label: 'กำหนดเอง' }
                    ].map((date) => (
                      <button
                        key={date.key}
                        onClick={() => setDateFilter(date.key as typeof dateFilter)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          dateFilter === date.key
                            ? "bg-purple-500 text-white"
                            : "border border-gray-300 text-gray-700 hover:border-purple-500"
                        }`}
                      >
                        {date.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Date Range */}
                  {dateFilter === 'custom' && (
                    <div className="mt-3 flex gap-3 items-center flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">จาก:</span>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">ถึง:</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters Button */}
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-red-500 transition flex items-center gap-1"
                  >
                    ✕ ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              </div>
            )}
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ผู้ยืม</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">อุปกรณ์</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ประเภท</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">กำหนดคืน</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">สถานะ</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">ดำเนินการ</th>
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
                        <div className="font-medium">{txn.userName}</div>
                        <div className="text-gray-500">{txn.userEmail}</div>
                        {txn.userIdNumber && <div className="text-gray-400">รหัส: {txn.userIdNumber}</div>}
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
                        {txn.confirmedBy && (
                          <div className="text-[10px] text-gray-500 mt-1">ยืนยัน: {txn.confirmedBy}</div>
                        )}
                        {txn.returnedBy && (
                          <div className="text-[10px] text-gray-500">คืนโดย: {txn.returnedBy}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {txn.status === "scheduled" ? (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={async () => {
                                if (!user || processingId) return
                                setProcessingId(txn.borrowId)
                                try {
                                  await confirmBorrowTransaction(txn.borrowId, user, user.displayName || "Admin")
                                  const equipmentNames = txn.equipmentItems.map(item => `${item.equipmentName} (${item.quantityBorrowed})`).join(", ")
                                  await logAdminAction({
                                    user,
                                    action: 'confirm',
                                    type: 'borrow',
                                    itemName: `การยืมของ ${txn.userName}`,
                                    details: `ยืนยันและมอบอุปกรณ์: ${equipmentNames}`
                                  })
                                  setTransactions(prev => prev.map(t => 
                                    t.borrowId === txn.borrowId 
                                      ? { ...t, status: "borrowed" as const, confirmedBy: user.displayName || "Admin" }
                                      : t
                                  ))
                                } catch (error) {
                                  console.error("Error confirming:", error)
                                  alert("เกิดข้อผิดพลาด")
                                } finally {
                                  setProcessingId(null)
                                }
                              }}
                              disabled={processingId === txn.borrowId}
                              className="px-2 py-1 rounded bg-green-500 text-white text-[10px] font-medium hover:bg-green-600 transition disabled:bg-gray-300"
                            >
                              {processingId === txn.borrowId ? "..." : "✓ มอบอุปกรณ์"}
                            </button>
                            <button
                              onClick={async () => {
                                if (!user || processingId) return
                                let reason = ""
                                while (!reason) {
                                  reason = prompt("กรุณาระบุเหตุผลในการยกเลิก (จำเป็น):")?.trim() || ""
                                  if (reason === "") {
                                    alert("ต้องระบุเหตุผลในการยกเลิก!")
                                  }
                                }
                                setProcessingId(txn.borrowId)
                                try {
                                  await cancelBorrowTransaction(txn.borrowId, user, user.displayName || "Admin", reason)
                                  const equipmentNames = txn.equipmentItems.map(item => `${item.equipmentName} (${item.quantityBorrowed})`).join(", ")
                                  await logAdminAction({
                                    user,
                                    action: 'cancel',
                                    type: 'borrow',
                                    itemName: `การยืมของ ${txn.userName}`,
                                    details: `ยกเลิกการยืม: ${equipmentNames} | เหตุผล: ${reason}`
                                  })
                                  setTransactions(prev => prev.map(t => 
                                    t.borrowId === txn.borrowId 
                                      ? { ...t, status: "cancelled" as const, cancelledBy: user.displayName || "Admin" }
                                      : t
                                  ))
                                } catch (error) {
                                  console.error("Error cancelling:", error)
                                  alert("เกิดข้อผิดพลาด")
                                } finally {
                                  setProcessingId(null)
                                }
                              }}
                              disabled={processingId === txn.borrowId}
                              className="px-2 py-1 rounded bg-red-500 text-white text-[10px] font-medium hover:bg-red-600 transition disabled:bg-gray-300"
                            >
                              ✗ ยกเลิก
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
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
