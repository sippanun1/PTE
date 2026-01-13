import { useState, useEffect } from "react"
import Header from "../../components/Header"
import { equipmentData, categories, welldingTypes, machineTypes, type Equipment } from "../../data/equipment"
import shoppingCartIcon from "../../assets/shoppingcart.svg"

interface SelectedEquipment extends Equipment {
  selectedQuantity: number
}

interface EquipmentSelectionProps {
  onNavigateBack: () => void
  onNavigateToCart: (selectedItems: SelectedEquipment[]) => void
}

export default function EquipmentSelection({ onNavigateBack, onNavigateToCart }: EquipmentSelectionProps) {
  const [currentDate, setCurrentDate] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด")
  const [selectedType, setSelectedType] = useState<string>("")
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData)
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map())

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

  useEffect(() => {
    let filtered = equipmentData

    if (selectedCategory !== "ทั้งหมด") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEquipment(filtered)
  }, [searchTerm, selectedCategory, selectedType])

  const getTypesByCategory = () => {
    if (selectedCategory === "Welding") {
      return welldingTypes
    } else if (selectedCategory === "Machine") {
      return machineTypes
    }
    return []
  }

  const handleSelectEquipment = (equipmentId: string) => {
    console.log("Selected equipment:", equipmentId)
  }

  const handleAddQuantity = (equipmentId: string) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev)
      newMap.set(equipmentId, (newMap.get(equipmentId) || 0) + 1)
      return newMap
    })
  }

  const handleRemoveQuantity = (equipmentId: string) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev)
      const currentQty = newMap.get(equipmentId) || 0
      if (currentQty > 1) {
        newMap.set(equipmentId, currentQty - 1)
      } else {
        newMap.delete(equipmentId)
      }
      return newMap
    })
  }

  const handleCheckout = () => {
    const selectedEquipmentList: SelectedEquipment[] = Array.from(selectedItems.entries()).map(
      ([equipmentId, quantity]) => {
        const equipment = equipmentData.find(e => e.id === equipmentId)!
        return {
          ...equipment,
          selectedQuantity: quantity
        }
      }
    )
    onNavigateToCart(selectedEquipmentList)
  }

  const totalItems = Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0)

  const types = getTypesByCategory()

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
      <div
        className="
          w-full h-14
          bg-[#FF7F50]
          text-white text-xl font-semibold
          flex items-center
          px-6
          z-10
        "
      >
        <span className="flex-1 text-center mr-auto">เลือกอุปกรณ์ที่ต้องการยืม</span>
        <button
          onClick={handleCheckout}
          disabled={totalItems === 0}
          className={`
            relative
            ${totalItems === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
          `}
        >
          <img
            src={shoppingCartIcon}
            alt="Shopping Cart"
            className="w-6 h-6"
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
          {/* Date & Time */}
          <div className="w-full flex justify-between text-gray-600 text-xs mb-4">
            <div>User (ชื่อ-สกุล)</div>
            <div>
              <div>{currentDate}</div>
              <div>Time {currentTime}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหา"
                className="
                  w-full h-10
                  px-4
                  rounded-full
                  border border-gray-400
                  outline-none
                  text-sm
                  placeholder-gray-400
                "
              />
              <button className="absolute right-3 text-gray-600 hover:text-gray-800">
                🔍
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="w-full mb-3">
            <div className="text-xs font-semibold text-gray-700 mb-2">หมวดหลัก</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setSelectedType("")
                  }}
                  className={`
                    px-4 py-1
                    rounded-full
                    text-sm font-medium
                    whitespace-nowrap
                    transition
                    ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white border-b-2 border-orange-500"
                        : "bg-white text-gray-700 border border-gray-400 hover:border-gray-600"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          {types.length > 0 && (
            <div className="w-full mb-5 pb-4 border-b-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-2 ml-2">
                ┗ ประเภท ({selectedCategory})
              </div>
              <div className="ml-4 flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedType("")}
                  className={`
                    px-4 py-1
                    rounded-full
                    text-sm font-medium
                    whitespace-nowrap
                    transition
                    ${
                      selectedType === ""
                        ? "bg-orange-300 text-white"
                        : "bg-white text-gray-700 border border-gray-400 hover:border-gray-600"
                    }
                  `}
                >
                  ทั้งหมด
                </button>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`
                      px-4 py-1
                      rounded-full
                      text-sm font-medium
                      whitespace-nowrap
                      transition
                      ${
                        selectedType === type
                          ? "bg-orange-300 text-white"
                          : "bg-white text-gray-700 border border-gray-400 hover:border-gray-600"
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Grid */}
          <div className="w-full grid grid-cols-2 gap-4 mb-6">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <div
                  key={item.id}
                  className={`
                    rounded-lg
                    p-4
                    flex flex-col
                    text-center
                    transition
                    ${
                      item.inStock
                        ? "bg-gray-100 hover:bg-gray-150"
                        : "bg-red-50 opacity-75"
                    }
                  `}
                >
                  {/* Equipment Name */}
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    {item.name}
                  </h3>

                  {/* Equipment Image */}
                  <div className="text-5xl mb-4 flex justify-center">
                    {item.image}
                  </div>

                  {/* Stock Status */}
                  <div
                    className={`
                      text-xs font-semibold mb-2
                      ${
                        item.inStock
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                  >
                    {item.inStock ? "สต็อคพร้อมใช้งาน" : "สต็อคหมดแล้ว"}
                  </div>

                  {/* Equipment Code */}
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {item.code}
                  </div>

                  {/* Available Quantity */}
                  <div className="text-xs text-gray-500 mb-4">
                    {item.available > 0 ? (
                      <>จำนวนคงเหลือ {item.available} ชิ้น</>
                    ) : (
                      <>หมดสต็อค</>
                    )}
                  </div>

                  {/* Button or Out of Stock */}
                  {item.inStock ? (
                    selectedItems.has(item.id) ? (
                      <div className="w-full flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleRemoveQuantity(item.id)}
                          className="
                            w-8 h-8
                            rounded-full
                            border border-gray-400
                            text-gray-600
                            hover:bg-gray-200
                            transition
                          "
                        >
                          −
                        </button>
                        <span className="text-sm font-medium">{selectedItems.get(item.id)}</span>
                        <button
                          onClick={() => handleAddQuantity(item.id)}
                          className="
                            w-8 h-8
                            rounded-full
                            border border-gray-400
                            text-gray-600
                            hover:bg-gray-200
                            transition
                          "
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddQuantity(item.id)}
                        className="
                          w-full
                          py-2
                          rounded-full
                          bg-orange-500
                          text-white
                          text-xs font-medium
                          hover:bg-orange-600
                          transition
                        "
                      >
                        ยืมอุปกรณ์
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="
                        w-full
                        py-2
                        rounded-full
                        bg-gray-300
                        text-gray-500
                        text-xs font-medium
                        cursor-not-allowed
                      "
                    >
                      สต็อคหมด
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-600 py-8">
                ไม่พบอุปกรณ์ที่ค้นหา
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onNavigateBack}
            className="
              px-8 py-2
              rounded-full
              border border-gray-400
              text-sm text-gray-600
              font-medium
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
