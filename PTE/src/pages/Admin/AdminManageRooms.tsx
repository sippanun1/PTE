import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"

interface Room {
  id: string
  code: string
  name: string
  status: "ว่าง" | "ไม่ว่าง"
}

interface RoomFormData {
  code: string
  name: string
  category: string
  image?: string
  usageDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  timeRanges: {
    monday: { start: string; end: string }
    tuesday: { start: string; end: string }
    wednesday: { start: string; end: string }
    thursday: { start: string; end: string }
    friday: { start: string; end: string }
    saturday: { start: string; end: string }
    sunday: { start: string; end: string }
  }
}

export default function AdminManageRooms() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", code: "CB8720", name: "ห้องเรียน", status: "ว่าง" },
    { id: "2", code: "CB8785", name: "ห้องปฏิบัติการ", status: "ไม่ว่าง" }
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [formData, setFormData] = useState<RoomFormData>({
    code: "",
    name: "",
    category: "",
    image: "",
    usageDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    timeRanges: {
      monday: { start: "08:00", end: "18:00" },
      tuesday: { start: "08:00", end: "18:00" },
      wednesday: { start: "08:00", end: "18:00" },
      thursday: { start: "08:00", end: "18:00" },
      friday: { start: "08:00", end: "18:00" },
      saturday: { start: "08:00", end: "18:00" },
      sunday: { start: "08:00", end: "18:00" }
    }
  })

  const filteredRooms = rooms.filter(room =>
    room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddRoom = () => {
    setEditingRoomId(null)
    setFormData({
      code: "",
      name: "",
      category: "",
      image: "",
      usageDays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      timeRanges: {
        monday: { start: "08:00", end: "18:00" },
        tuesday: { start: "08:00", end: "18:00" },
        wednesday: { start: "08:00", end: "18:00" },
        thursday: { start: "08:00", end: "18:00" },
        friday: { start: "08:00", end: "18:00" },
        saturday: { start: "08:00", end: "18:00" },
        sunday: { start: "08:00", end: "18:00" }
      }
    })
    setShowModal(true)
  }

  const handleEditRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      setEditingRoomId(roomId)
      setFormData({
        code: room.code,
        name: room.name,
        category: "",
        image: "",
        usageDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        timeRanges: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: { start: "09:00", end: "17:00" },
          sunday: { start: "09:00", end: "17:00" }
        }
      })
      setShowModal(true)
    }
  }

  const handleSaveRoom = () => {
    setShowConfirm(true)
  }

  const handleConfirmSave = () => {
    if (editingRoomId) {
      // Edit existing room
      setRooms(rooms.map(room =>
        room.id === editingRoomId
          ? { ...room, code: formData.code, name: formData.name }
          : room
      ))
    } else {
      // Add new room
      const newRoom: Room = {
        id: (rooms.length + 1).toString(),
        code: formData.code,
        name: formData.name,
        status: "ว่าง"
      }
      setRooms([...rooms, newRoom])
    }
    setShowModal(false)
    setShowConfirm(false)
  }

  const getSelectedDaysText = () => {
    const days: string[] = []
    const dayLabels = {
      monday: "จันทร์",
      tuesday: "อังคาร",
      wednesday: "พุธ",
      thursday: "พฤหัสบดี",
      friday: "ศุกร์"
    }
    Object.entries(formData.usageDays).forEach(([key, checked]) => {
      if (checked && key in dayLabels) {
        days.push(dayLabels[key as keyof typeof dayLabels])
      }
    })
    return days.length > 0 ? days.join(" - ") : "ไม่มี"
  }

  const getTimeRangesText = () => {
    const times: string[] = []
    const dayLabels = {
      monday: "จันทร์",
      tuesday: "อังคาร",
      wednesday: "พุธ",
      thursday: "พฤหัสบดี",
      friday: "ศุกร์"
    }
    const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const
    dayKeys.forEach((key) => {
      if (formData.usageDays[key]) {
        const dayLabel = dayLabels[key as keyof typeof dayLabels]
        times.push(`${dayLabel}: ${formData.timeRanges[key].start}-${formData.timeRanges[key].end}`)
      }
    })
    return times.length > 0 ? times.join(" / ") : "ไม่มี"
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
      <Header title="จัดการห้อง" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center pb-6">
        {/* Back and Add Room Buttons */}
          <div className="w-full flex gap-3 mt-8 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="
                w-2/5
                py-3
                rounded-lg
                border border-gray-400
                text-gray-600
                text-sm font-medium
                hover:bg-gray-100
                transition
                flex items-center justify-center gap-2
              "
            >
              ย้อนกลับ
            </button>
            <span className="w-1/5"> </span>
            <button
              onClick={handleAddRoom}
              className="
                w-2/5
                py-3
                bg-orange-500
                text-white
                text-sm font-semibold
                hover:bg-orange-600
                transition
                flex items-center justify-center gap-2
              "
            >
              + เพิ่มห้องใหม่
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full mb-6 relative">
            <input
              type="text"
              placeholder="ค้นหา"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                h-10
                px-4
                border border-gray-300
                outline-none
                text-sm
              "
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              🔍
            </button>
          </div>

          {/* Table Headers */}
          <div className="w-full mb-4 grid grid-cols-4 gap-2 text-xs font-semibold text-gray-700">
            <div>เลขห้อง</div>
            <div>ประมาณ</div>
            <div>สถานะ</div>
            <div>การจัดการ</div>
          </div>

          {/* Rooms List */}
          <div className="w-full flex flex-col gap-3">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div key={room.id} className="w-full grid grid-cols-4 gap-2 items-center text-xs border-b pb-3">
                  {/* Room Code */}
                  <div className="font-semibold">{room.code}</div>

                  {/* Room Name */}
                  <div className="text-gray-600">{room.name}</div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-white text-xs font-semibold
                        ${room.status === "ว่าง" ? "bg-green-500" : "bg-red-500"}
                      `}
                    >
                      {room.status}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleEditRoom(room.id)}
                    className="
                      px-3 py-1
                      bg-blue-500
                      text-white text-xs font-semibold
                      rounded
                      hover:bg-blue-600
                      transition
                    "
                  >
                    ข้อมูล
                  </button>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-8">
                ไม่พบห้องที่ค้นหา
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ===== MODAL FORM ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 top-0 left-0 right-0 bottom-0">
          <div className="w-full bg-white rounded-t-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-4 text-center font-semibold sticky top-0">
              {editingRoomId ? "แก้ไขข้อมูลห้อง" : "เพิ่มห้องใหม่"}
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-5">
              {/* Room Code */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">ข้อมูล/เลขห้อง</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500"
                  placeholder="เช่น CB8720"
                />
              </div>

              {/* Room Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">ประมาณ</label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- เลือกประเภทห้อง --</option>
                  <option value="ห้องเรียน">ห้องเรียน</option>
                  <option value="ห้องปฏิบัติการ">ห้องปฏิบัติการ</option>
                  <option value="ห้องประชุม">ห้องประชุม</option>
                  <option value="ห้องอื่นๆ">ห้องอื่นๆ</option>
                </select>
              </div>

              {/* Room Image */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">รูปภาพห้อง</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full text-sm text-gray-600 file:px-4 file:py-2 file:border file:border-gray-300 file:rounded"
                />
              </div>

              {/* Usage Days */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-3">ข่าวสารการใช้งาน</label>
                <div className="flex flex-col gap-4">
                  {[
                    { key: "monday", label: "จันทร์" },
                    { key: "tuesday", label: "อังคาร" },
                    { key: "wednesday", label: "พุธ" },
                    { key: "thursday", label: "พฤหัสบดี" },
                    { key: "friday", label: "ศุกร์" }
                  ].map((day) => (
                    <div key={day.key}>
                      <label className="flex items-center gap-2 text-sm mb-2">
                        <input
                          type="checkbox"
                          checked={formData.usageDays[day.key as keyof typeof formData.usageDays]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              usageDays: {
                                ...formData.usageDays,
                                [day.key]: e.target.checked
                              }
                            })
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                        {day.label}
                      </label>
                      
                      {/* Show time range only if day is checked */}
                      {formData.usageDays[day.key as keyof typeof formData.usageDays] && (
                        <div className="ml-6 flex gap-2 items-center mb-3">
                          <select
                            value={formData.timeRanges[day.key as keyof typeof formData.timeRanges].start}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                timeRanges: {
                                  ...formData.timeRanges,
                                  [day.key]: {
                                    ...formData.timeRanges[day.key as keyof typeof formData.timeRanges],
                                    start: e.target.value
                                  }
                                }
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-orange-500"
                          >
                            {Array.from({ length: 21 }, (_, i) => {
                              const hours = 8 + Math.floor(i / 2);
                              const minutes = (i % 2) * 30;
                              const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
                              return <option key={time} value={time}>{time}</option>
                            })}
                          </select>
                          <span className="text-xs font-medium">-</span>
                          <select
                            value={formData.timeRanges[day.key as keyof typeof formData.timeRanges].end}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                timeRanges: {
                                  ...formData.timeRanges,
                                  [day.key]: {
                                    ...formData.timeRanges[day.key as keyof typeof formData.timeRanges],
                                    end: e.target.value
                                  }
                                }
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-orange-500"
                          >
                            {Array.from({ length: 21 }, (_, i) => {
                              const hours = 8 + Math.floor(i / 2);
                              const minutes = (i % 2) * 30;
                              const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
                              return <option key={time} value={time}>{time}</option>
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6 pb-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-400 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveRoom}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONFIRMATION MODAL ===== */}
      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border-4 border-purple-300">
            {/* Header */}
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">ยืนยันการบันทึกข้อมูล</h2>

            {/* Message */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              ระบบจะทำการบันทึกข้อมูลห้องเรียน รวมถึงวันและเวลาการใช้งาน ตรวจสอบความถูกต้องของข้อมูลและแจ้งไว้ให้ทราบ
            </p>

            {/* Room Information Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              {/* Room Code and Name */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">รหัสห้อง / ชื่อห้อง</p>
                <p className="text-sm font-semibold text-gray-800">{formData.code} - {formData.name}</p>
              </div>

              {/* Usage Days */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                  <span className="text-base">📅</span> วันใช้งาน
                </p>
                <p className="text-sm font-semibold text-gray-800">{getSelectedDaysText()}</p>
              </div>

              {/* Time Range */}
              <div>
                <p className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                  <span className="text-base">🕐</span> เวลาใช้งาน
                </p>
                <p className="text-sm font-semibold text-gray-800">{getTimeRangesText()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-gray-400 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}