import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { LoginForm } from "../types/auth"
import Header from "../components/Header"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
    navigate('/home')
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
      <Header title="PTE สวัสดีค่ะ" />

      {/* ===== CONTENT ===== */}
        <div className="mt-10 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
            <form
            onSubmit={handleLogin}
            className="w-full flex flex-col items-center gap-4"
            >
            <input
                name="username"
                placeholder="User (ชื่อ-สกุล)"
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
                Login
            </button>
            </form>

            <button
            onClick={() => navigate('/register')}
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
            Register
            </button>

            <button
            onClick={() => navigate('/admin')}
            className="
                mt-3
                px-8 py-2
                rounded-full
                border border-gray-400
                text-sm text-gray-600
                hover:bg-gray-100
                transition
            "
            >
            Admin (Temp)
            </button>
        </div>
        </div>
    </div>
  )
}
