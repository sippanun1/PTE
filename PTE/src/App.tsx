import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import BorrowEquipment from './pages/BorrowEquipment/BorrowEquipment'
import BorrowDuringClass from './pages/BorrowEquipment/BorrowDuringClass'
import BorrowForTeaching from './pages/BorrowEquipment/BorrowForTeaching'
import BorrowOutsideClass from './pages/BorrowEquipment/BorrowOutsideClass'
import EquipmentSelection from './pages/BorrowEquipment/EquipmentSelection'
import CartSummary from './pages/BorrowEquipment/CartSummary'
import ConfirmSummary from './pages/BorrowEquipment/ConfirmSummary'
import CompletionPage from './pages/BorrowEquipment/CompletionPage'
import ReturnEquipment from './pages/ReturnEquipment/ReturnEquipment'
import ReturnSummary from './pages/ReturnEquipment/ReturnSummary'
import RoomBooking from './pages/RoomBooking/RoomBooking'
import RoomAvailability from './pages/RoomBooking/RoomAvailability'
import RoomBookingForm from './pages/RoomBooking/RoomBookingForm'
import MyRoomBookings from './pages/RoomBooking/MyRoomBookings'
import ReturnRoomForm from './pages/RoomBooking/ReturnRoomForm'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminManageRooms from './pages/Admin/AdminManageRooms'
import AdminManageEquipment from './pages/Admin/AdminManageEquipment'
import BorrowReturnHistory from './pages/Admin/BorrowReturnHistory'
import type { Equipment } from './data/equipment'

export interface SelectedEquipment extends Equipment {
  selectedQuantity: number
}

export interface ReturnEquipmentItem {
  id: string
  name: string
  code: string
  checked: boolean
  quantity: number
  status: string
}

export interface BookingData {
  room: string
  roomImage: string
  time: string
}

export interface ReturnBookingData {
  id: string
  room: string
  time: string
  name: string
  bookingCode: string
  image: string
  status: "pending" | "approved" | "inuse"
}

function App() {
  const [cartItems, setCartItems] = useState<SelectedEquipment[]>([])
  const [returnEquipment, setReturnEquipment] = useState<ReturnEquipmentItem[]>([])
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [returnBookingData, setReturnBookingData] = useState<ReturnBookingData | null>(null)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/borrow" element={<BorrowEquipment />} />
        <Route path="/borrow/during-class" element={<BorrowDuringClass />} />
        <Route path="/borrow/teaching" element={<BorrowForTeaching />} />
        <Route path="/borrow/outside" element={<BorrowOutsideClass />} />
        <Route path="/borrow/equipment" element={<EquipmentSelection cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/borrow/cart" element={<CartSummary cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/borrow/confirm" element={<ConfirmSummary cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/borrow/completion" element={<CompletionPage cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/return" element={<ReturnEquipment returnEquipment={returnEquipment} setReturnEquipment={setReturnEquipment} />} />
        <Route path="/return/summary" element={<ReturnSummary returnEquipment={returnEquipment} setReturnEquipment={setReturnEquipment} />} />
        <Route path="/room-booking" element={<RoomBooking setBookingData={setBookingData} />} />
        <Route path="/room-booking/availability" element={<RoomAvailability setBookingData={setBookingData} />} />
        <Route path="/room-booking/form" element={bookingData ? <RoomBookingForm bookingData={bookingData} onConfirmBooking={(confirmData) => console.log('Booking confirmed:', confirmData)} /> : <Navigate to="/room-booking" />} />
        <Route path="/room-booking/my-bookings" element={<MyRoomBookings setReturnBookingData={setReturnBookingData} />} />
        <Route path="/room-booking/return" element={returnBookingData ? <ReturnRoomForm booking={returnBookingData} onConfirmReturn={(returnData) => console.log('Return confirmed:', returnData)} /> : <Navigate to="/room-booking/my-bookings" />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage-rooms" element={<AdminManageRooms />} />
        <Route path="/admin/manage-equipment" element={<AdminManageEquipment />} />
        <Route path="/admin/borrow-return-history" element={<BorrowReturnHistory />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App