import { useState, useEffect } from "react"
import Header from "../../components/Header"

interface BorrowForTeachingProps {
  onNavigateBack: () => void
  onNavigateToEquipment: () => void
}

export default function BorrowForTeaching({ onNavigateBack, onNavigateToEquipment }: BorrowForTeachingProps) {
  const [currentDate, setCurrentDate] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [recipient, setRecipient] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("20/12/2568")
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5))

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const date = now.toLocaleDateString("th-TH", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      })
      const time = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
      setCurrentDate(date)
      setCurrentTime(time)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const days = []
  const firstDay = getFirstDayOfMonth(currentMonth)
  const daysInMonth = getDaysInMonth(currentMonth)

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handleDateSelect = (day: number) => {
    const dateStr = `${day.toString().padStart(2, "0")}/${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}/${currentMonth.getFullYear() + 543}`
    setSelectedDate(dateStr)
    setShowCalendar(false)
  }

  const handleConfirm = () => {
    if (recipient && selectedDate) {
      console.log({
        recipient: recipient,
        date: selectedDate
      })
      onNavigateToEquipment()
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
      <Header title="ยืมใช้สอน" />

      {/* ===== CONTENT ===== */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* Date & Time */}
          <div className="w-full flex justify-between text-gray-600 text-sm mb-6">
            <div>User (ชื่อ-สกุล)</div>
            <div>
              <div>{currentDate}</div>
              <div>Time {currentTime}</div>
            </div>
          </div>

          {/* Recipient Input */}
          <div className="w-full mb-6">
            <div className="text-sm text-gray-600 mb-2">ระบุรายวิชา</div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="วิชา..............."
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
                placeholder-gray-400
              "
            />
          </div>

          {/* Date Selection */}
          <div className="w-full mb-6">
            <div className="text-sm text-gray-600 mb-2">กำหนดวันคืน</div>
            <div className="relative">
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                className="
                  w-full h-11
                  px-5
                  rounded-full
                  border border-gray-400
                  outline-none
                  text-sm
                  flex items-center justify-between
                  cursor-pointer
                  bg-white
                  hover:bg-gray-50
                "
              >
                <span>{selectedDate}</span>
                <span className="text-lg">📅</span>
              </div>

              {/* Calendar */}
              {showCalendar && (
                <div className="
                  absolute top-full left-0 right-0
                  mt-2 p-4
                  bg-white
                  border border-gray-300
                  rounded-lg
                  shadow-lg
                  z-10
                ">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ◀
                    </button>
                    <div className="text-center font-bold text-sm">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </div>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ▶
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    <div className="text-gray-600">Sun</div>
                    <div className="text-gray-600">Mon</div>
                    <div className="text-gray-600">Tue</div>
                    <div className="text-gray-600">Wed</div>
                    <div className="text-gray-600">Thu</div>
                    <div className="text-gray-600">Fri</div>
                    <div className="text-gray-600">Sat</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => day && handleDateSelect(day)}
                        disabled={!day}
                        className={`
                          h-7 text-xs
                          ${
                            day
                              ? "hover:bg-orange-100 cursor-pointer"
                              : "opacity-0 cursor-default"
                          }
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex gap-4">
            <button
              onClick={onNavigateBack}
              className="
                flex-1 h-11
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
              disabled={!recipient}
              className={`
                flex-1 h-11
                rounded-full
                text-sm font-medium
                text-white
                transition
                ${
                  recipient
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
