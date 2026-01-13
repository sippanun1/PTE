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
import type { Equipment } from './data/equipment'

interface SelectedEquipment extends Equipment {
  selectedQuantity: number
}

interface ReturnEquipmentItem {
  id: string
  name: string
  code: string
  checked: boolean
  quantity: number
  status: string
}

type PageType = 'login' | 'register' | 'home' | 'borrow' | 'borrowClass' | 'borrowTeaching' | 'borrowOutside' | 'equipment' | 'cart' | 'confirm' | 'completion' | 'return' | 'returnSummary' | 'roomBooking' | 'roomAvailability'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login')
  const [cartItems, setCartItems] = useState<SelectedEquipment[]>([])
  const [returnEquipment, setReturnEquipment] = useState<ReturnEquipmentItem[]>([])

  return (
    <>
      {currentPage === 'login' ? (
        <Login onNavigateToRegister={() => setCurrentPage('register')} onNavigateToHome={() => setCurrentPage('home')} />
      ) : currentPage === 'register' ? (
        <Register onNavigateToLogin={() => setCurrentPage('login')} />
      ) : currentPage === 'home' ? (
        <Home 
          onNavigateToBorrow={() => setCurrentPage('borrow')} 
          onNavigateToReturn={() => setCurrentPage('return')}
          onNavigateToRoomBooking={() => setCurrentPage('roomBooking')}
        />
      ) : currentPage === 'borrow' ? (
        <BorrowEquipment 
          onNavigateBack={() => setCurrentPage('home')} 
          onNavigateToBorrowClass={() => setCurrentPage('borrowClass')}
          onNavigateToBorrowTeaching={() => setCurrentPage('borrowTeaching')}
          onNavigateToBorrowOutside={() => setCurrentPage('borrowOutside')}
        />
      ) : currentPage === 'borrowClass' ? (
        <BorrowDuringClass 
          onNavigateBack={() => setCurrentPage('borrow')} 
          onNavigateToEquipment={() => setCurrentPage('equipment')}
        />
      ) : currentPage === 'borrowTeaching' ? (
        <BorrowForTeaching 
          onNavigateBack={() => setCurrentPage('borrow')} 
          onNavigateToEquipment={() => setCurrentPage('equipment')}
        />
      ) : currentPage === 'borrowOutside' ? (
        <BorrowOutsideClass 
          onNavigateBack={() => setCurrentPage('borrow')} 
          onNavigateToEquipment={() => setCurrentPage('equipment')}
        />
      ) : currentPage === 'equipment' ? (
        <EquipmentSelection 
          onNavigateBack={() => setCurrentPage('borrow')} 
          onNavigateToCart={(selectedItems) => {
            setCartItems(selectedItems)
            setCurrentPage('cart')
          }}
        />
      ) : currentPage === 'cart' ? (
        <CartSummary
          selectedItems={cartItems}
          onNavigateBack={() => setCurrentPage('equipment')}
          onProceedToConfirm={(items) => {
            setCartItems(items)
            setCurrentPage('confirm')
          }}
        />
      ) : currentPage === 'confirm' ? (
        <ConfirmSummary
          selectedItems={cartItems}
          onNavigateBack={() => setCurrentPage('cart')}
          onConfirm={() => setCurrentPage('completion')}
        />
      ) : currentPage === 'completion' ? (
        <CompletionPage
          selectedItems={cartItems}
          onNavigateHome={() => {
            setCurrentPage('home')
            setCartItems([])
          }}
        />
      ) : currentPage === 'return' ? (
        <ReturnEquipment
          onNavigateBack={() => setCurrentPage('home')}
          onNavigateToSummary={(equipment) => {
            setReturnEquipment(equipment)
            setCurrentPage('returnSummary')
          }}
        />
      ) : currentPage === 'returnSummary' ? (
        <ReturnSummary
          selectedEquipment={returnEquipment}
          onNavigateBack={() => setCurrentPage('return')}
          onConfirm={() => {
            setCurrentPage('home')
            setReturnEquipment([])
          }}
        />
      ) : currentPage === 'roomBooking' ? (
        <RoomBooking
          onNavigateBack={() => setCurrentPage('home')}
          onNavigateToAvailability={() => setCurrentPage('roomAvailability')}
        />
      ) : currentPage === 'roomAvailability' ? (
        <RoomAvailability
          onNavigateBack={() => setCurrentPage('roomBooking')}
        />
      ) : (
        <Home 
          onNavigateToBorrow={() => setCurrentPage('borrow')} 
          onNavigateToReturn={() => setCurrentPage('return')}
          onNavigateToRoomBooking={() => setCurrentPage('roomBooking')}
        />
      )}
    </>
  )
}

export default App