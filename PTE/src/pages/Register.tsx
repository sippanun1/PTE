import { useState } from "react"
import Header from "../components/Header"

interface RegisterForm {
  fullName: string
  idNumber: string
  undergraduateYears: string
  username: string
  password: string
  email: string
}

interface RegisterProps {
  onNavigateToLogin: () => void
}

export default function Register({ onNavigateToLogin }: RegisterProps) {
  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    idNumber: "",
    undergraduateYears: "",
    username: "",
    password: "",
    email: ""
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
    // Show success modal
    setShowSuccessModal(true)
  }

  const handleLoginFromModal = () => {
    setShowSuccessModal(false)
    onNavigateToLogin()
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
      <Header title="ลงทะเบียน" />

      {/* ===== CONTENT ===== */}
      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          <form
            onSubmit={handleRegister}
            className="w-full flex flex-col items-center gap-4"
          >
            <input
              name="fullName"
              placeholder="ชื่อ-สกุล"
              value={form.fullName}
              onChange={handleChange}
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
              "
            />

            <input
              name="idNumber"
              placeholder="รหัสนักศึกษา"
              value={form.idNumber}
              onChange={handleChange}
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
              "
            />

            <input
              name="undergraduateYears"
              placeholder="ชั้นปี"
              value={form.undergraduateYears}
              onChange={handleChange}
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
              "
            />

            <input
              name="username"
              placeholder="User"
              value={form.username}
              onChange={handleChange}
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
              "
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
              "
            />

            <input
              type="email"
              name="email"
              placeholder="Email มอ"
              value={form.email}
              onChange={handleChange}
              className="
                w-full h-11
                px-5
                rounded-full
                border border-gray-400
                outline-none
                text-sm
              "
            />

            <button
              type="submit"
              className="
                mt-4
                w-full h-12
                rounded-full
                bg-[#FF7F50]
                text-white text-lg font-medium
                hover:bg-[#ff6a33]
                transition
              "
            >
              Register
            </button>
          </form>

          <button
            onClick={onNavigateToLogin}
            className="
              mt-6
              px-8 py-2
              rounded-full
              border border-gray-400
              text-sm text-gray-600
              hover:bg-gray-100
              transition
            "
          >
            Back to Login
          </button>
        </div>
      </div>

      {/* ===== SUCCESS MODAL ===== */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[320px] mx-4 flex flex-col items-center overflow-hidden">
            {/* Modal Header */}
            <div className="w-full bg-[#FF7F50] text-white py-6 px-4 text-center">
              <h2 className="text-lg font-semibold">ลงทะเบียนสำเร็จ!</h2>
            </div>

            {/* Modal Content */}
            <div className="w-full px-6 py-8 text-center">
              <p className="text-gray-700 text-sm mb-6">
                เข้าสู่ระบบด้วย User และ Password ของคุณ
              </p>

              {/* Login Button */}
              <button
                onClick={handleLoginFromModal}
                className="
                  w-full
                  py-3
                  rounded-full
                  bg-[#FF7F50]
                  text-white
                  text-base font-semibold
                  hover:bg-[#ff6a33]
                  transition
                "
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
