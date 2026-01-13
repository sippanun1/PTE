import { useState, useEffect } from "react"
import Header from "../components/Header"

interface HomeProps {
  onNavigateToBorrow: () => void
  onNavigateToReturn: () => void
  onNavigateToRoomBooking: () => void
}

export default function Home({ onNavigateToBorrow, onNavigateToReturn, onNavigateToRoomBooking }: HomeProps) {
  const [currentDate, setCurrentDate] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")

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
      <Header title="ระบบยืม-คืนวัสดุ/ครุภัณฑ์" />

      {/* ===== CONTENT ===== */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* Date & Time */}
          <div className="w-full flex justify-between text-gray-600 text-sm mb-6">
            <div>{currentDate}</div>
            <div>Time {currentTime}</div>
          </div>

          {/* Username */}
          <div className="w-full text-gray-600 text-sm mb-6">
            User (ชื่อ-สกุล)
          </div>

          {/* Summary/Status Box */}
          <input
            type="text"
            placeholder="กิจกรรมที่เข้ม ไปลงทะเบียน (สรุปรวม)"
            readOnly
            className="
              w-full h-14
              px-5
              rounded-3xl
              border border-gray-400
              outline-none
              text-sm
              text-gray-600
              mb-6
            "
          />

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={onNavigateToBorrow}
              className="
                w-full h-12
                rounded-full
                bg-yellow-300
                text-gray-700 text-base font-medium
                hover:bg-yellow-400
                transition
              "
            >
              ยืมอุปกรณ์
            </button>

            <button
              onClick={onNavigateToReturn}
              className="
                w-full h-12
                rounded-full
                bg-orange-500
                text-white text-base font-medium
                hover:bg-orange-600
                transition
              "
            >
              คืนอุปกรณ์
            </button>

            <button
              onClick={onNavigateToRoomBooking}
              className="
                w-full h-12
                rounded-full
                bg-green-500
                text-white text-base font-medium
                hover:bg-green-600
                transition
              "
            >
              ยืมใช้ห้อง
            </button>

            <button
              className="
                w-full h-12
                rounded-full
                bg-pink-400
                text-white text-base font-medium
                hover:bg-pink-500
                transition
              "
            >
              คืนห้อง
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
