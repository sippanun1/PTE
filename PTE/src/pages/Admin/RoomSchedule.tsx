import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../../components/Header"

interface Room {
  id: string
  code: string
  type: string
  status: "ว่าง" | "ไม่ว่าง"
}

interface RoomBooking {
  id: string
  roomId: string
  userName: string
  userId: string
  date: string
  startTime: string
  endTime: string
  purpose: string
}

export default function RoomSchedule() {
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>()
  
  // Mock room data - will be replaced with Firebase
  const [room, setRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<RoomBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch room data from Firebase
    // For now, using mock data
    const fetchRoomData = async () => {
      setLoading(true)
      
      // Mock room - replace with Firebase fetch
      const mockRoom: Room = {
        id: roomId || "1",
        code: "CB8720",
        type: "ห้องเรียน",
        status: "ไม่ว่าง"
      }
      
      // Mock bookings - replace with Firebase fetch
      const mockBookings: RoomBooking[] = [
        {
          id: "1",
          roomId: roomId || "1",
          userName: "อาจารย์สมชาย ใจดี",
          userId: "user1",
          date: "2026-02-10",
          startTime: "09:00",
          endTime: "12:00",
          purpose: "สอนวิชา Computer Programming"
        },
        {
          id: "2",
          roomId: roomId || "1",
          userName: "อาจารย์สมหญิง รักเรียน",
          userId: "user2",
          date: "2026-02-10",
          startTime: "13:00",
          endTime: "16:00",
          purpose: "สอนวิชา Database Systems"
        },
        {
          id: "3",
          roomId: roomId || "1",
          userName: "นายสมศักดิ์ เก่งมาก",
          userId: "user3",
          date: "2026-02-11",
          startTime: "10:00",
          endTime: "11:00",
          purpose: "ประชุมกลุ่มโปรเจค"
        },
        {
          id: "4",
          roomId: roomId || "1",
          userName: "ผศ.ดร.วิชัย นักวิจัย",
          userId: "user4",
          date: "2026-02-11",
          startTime: "14:00",
          endTime: "17:00",
          purpose: "สัมมนาวิชาการ"
        },
        {
          id: "5",
          roomId: roomId || "1",
          userName: "นางสาวพิมพ์ใจ ศึกษาดี",
          userId: "user5",
          date: "2026-02-12",
          startTime: "09:00",
          endTime: "10:30",
          purpose: "นำเสนอโปรเจคจบ"
        },
        {
          id: "6",
          roomId: roomId || "1",
          userName: "อาจารย์มานะ พัฒนา",
          userId: "user6",
          date: "2026-02-12",
          startTime: "13:00",
          endTime: "15:00",
          purpose: "Workshop Python Programming"
        }
      ]
      
      setRoom(mockRoom)
      setBookings(mockBookings.filter(b => b.roomId === roomId))
      setLoading(false)
    }

    fetchRoomData()
  }, [roomId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  const getDateLabel = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    
    const date = new Date(dateString)
    date.setHours(0, 0, 0, 0)
    
    if (date.getTime() === today.getTime()) {
      return { text: "วันนี้", color: "bg-orange-500" }
    } else if (date.getTime() === tomorrow.getTime()) {
      return { text: "พรุ่งนี้", color: "bg-blue-500" }
    } else if (date.getTime() === dayAfterTomorrow.getTime()) {
      return { text: "มะรืนนี้", color: "bg-purple-500" }
    }
    return null
  }

  // Group bookings by date
  const groupedBookings = bookings.reduce((groups, booking) => {
    const date = booking.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(booking)
    return groups
  }, {} as Record<string, RoomBooking[]>)

  // Sort dates and filter out past dates (only show today and future)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  
  const sortedDates = Object.keys(groupedBookings)
    .filter(date => date >= todayStr)
    .sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-white bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[length:18px_18px]">
        <Header title="ตารางการจอง" />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-white bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[length:18px_18px]">
        <Header title="ตารางการจอง" />
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-gray-500">ไม่พบข้อมูลห้อง</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[length:18px_18px]">
      <Header title="ตารางการจอง" />

      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[400px] px-4 pb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-4 mb-6 px-4 py-2 border border-gray-400 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
          >
            ← ย้อนกลับ
          </button>

          {/* Room Info Card */}
          <div className="bg-blue-500 text-white rounded-t-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{room.code}</h2>
                <p className="text-blue-100 text-sm">{room.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                room.status === "ว่าง" ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"
              }`}>
                {room.status}
              </span>
            </div>
          </div>

          {/* Today's Quick View - Show at top if there are bookings today */}
          {bookings.some(b => b.date === new Date().toISOString().split('T')[0]) && (
            <div className="bg-orange-50 border border-l-4 border-orange-400 p-4">
              <h3 className="text-sm font-semibold text-orange-700 flex items-center gap-2 mb-2">
                ⚡ วันนี้
              </h3>
              <div className="flex flex-col gap-1">
                {bookings
                  .filter(b => b.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3 text-sm">
                      <span className="text-orange-600 font-medium">{booking.startTime}-{booking.endTime}</span>
                      <span className="text-gray-700">{booking.userName}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Schedule Section */}
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📅 รายการจองห้อง
              </h3>
            </div>

            {sortedDates.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {sortedDates.map((date) => (
                  <div key={date} className="p-4">
                    {/* Date Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(date)}</p>
                      {getDateLabel(date) && (
                        <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${getDateLabel(date)?.color}`}>
                          {getDateLabel(date)?.text}
                        </span>
                      )}
                    </div>

                    {/* Bookings for this date */}
                    <div className="ml-4 flex flex-col gap-3">
                      {groupedBookings[date]
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((booking) => (
                          <div key={booking.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🕐</span>
                                <span className="text-sm font-medium text-blue-600">
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                              <span>👤</span>
                              <span className="font-medium">{booking.userName}</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">
                              {booking.purpose}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-300 text-5xl mb-3">📅</p>
                <p className="text-gray-500 font-medium">ไม่มีการจองในขณะนี้</p>
                <p className="text-gray-400 text-sm mt-1">ห้องนี้ว่างสำหรับการจอง</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
