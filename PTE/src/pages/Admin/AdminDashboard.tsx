import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"

export default function AdminDashboard() {
  const navigate = useNavigate()

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
      <Header title="จัดการข้อมูลห้องและสถิติ" />

      {/* ===== CONTENT ===== */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* Info Text */}
          <div className="w-full mb-8 text-center">
            <p className="text-sm font-medium mb-2" style={{ color: "#B71C1C" }}>
              🏢 (เข้ามือบำรุงข้อมูลให้ใช้งานได้)
            </p>
            <p className="text-sm font-medium" style={{ color: "#B71C1C" }}>
              (เข้ามือบำรุงห้องสถิติเบี้ยมจำนวนรุ่ค)
            </p>
          </div>

          {/* Admin Buttons */}
          <div className="w-full flex flex-col gap-4">
            {/* Manage Rooms Button */}
            <button
              onClick={() => navigate('/admin/manage-rooms')}
              className="
                w-full
                py-4
                rounded-full
                text-white
                text-base font-semibold
                hover:opacity-90
                transition
              "
              style={{ backgroundColor: "#228B22" }}
            >
              จัดการห้อง
            </button>

            {/* Manage Calendar/Equipment Button */}
            <button
              onClick={() => navigate('/admin/manage-equipment')}
              className="
                w-full
                py-4
                rounded-full
                text-white
                text-base font-semibold
                hover:opacity-90
                transition
              "
              style={{ backgroundColor: "#FF7F50" }}
            >
              จัดการอุปกรณ์/ครุภัณฑ์
            </button>

            {/* Borrow/Return History Button */}
            <button
              onClick={() => navigate('/admin/borrow-return-history')}
              className="
                w-full
                py-4
                rounded-full
                text-gray-700
                text-base font-semibold
                hover:opacity-90
                transition
              "
              style={{ backgroundColor: "#fffab3" }}
            >
              ประวัติการยืม/คืน
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="
              w-full
              mt-8
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
        </div>
      </div>
    </div>
  )
}
