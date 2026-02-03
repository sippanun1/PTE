import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"

interface Equipment {
  id: string
  name: string
  category: "consumable" | "asset" | "main"
  quantity: number
}

interface AddStockForm {
  equipmentId: string
  equipmentName: string
  equipmentCategory: "consumable" | "asset" | "main"
  quantity: string
  date: string
  referenceNumber: string
  assetIds: string[]
  notes: string
}

interface AddEquipmentForm {
  category: "consumable" | "asset" | "main"
  ids: string[]
  nameThai: string
  nameEnglish: string
  quantity: string
  notes: string
}

export default function AdminManageEquipment() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "consumable" | "asset" | "main">("all")
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [addStockForm, setAddStockForm] = useState<AddStockForm>({
    equipmentId: "",
    equipmentName: "",
    equipmentCategory: "consumable",
    quantity: "",
    date: new Date().toISOString().split('T')[0],
    referenceNumber: "",
    assetIds: [],
    notes: ""
  })
  const [addEquipmentForm, setAddEquipmentForm] = useState<AddEquipmentForm>({
    category: "consumable",
    ids: [],
    nameThai: "",
    nameEnglish: "",
    quantity: "",
    notes: ""
  })
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: "1", name: "สวดเดื่อม3.2", category: "consumable", quantity: 7 },
    { id: "2", name: "สวดเดื่อม2.6", category: "asset", quantity: 2 },
    { id: "3", name: "อุปกรณ์อื่น", category: "main", quantity: 5 }
  ])

  const categories = [
    { key: "all", label: "ทั้งหมด" },
    { key: "consumable", label: "วัสดุสิ้นเปลือง" },
    { key: "asset", label: "ครุภัณฑ์" },
  ] as const

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddEquipment = () => {
    setAddEquipmentForm({
      category: "consumable",
      ids: [],
      nameThai: "",
      nameEnglish: "",
      quantity: "",
      notes: ""
    })
    setShowAddEquipmentModal(true)
  }

  const handleAddEquipmentSubmit = () => {
    const isAsset = addEquipmentForm.category === "asset"
    const quantityNum = parseInt(addEquipmentForm.quantity) || 0
    
    // For assets, check if all IDs are filled
    if (isAsset && addEquipmentForm.ids.length !== quantityNum) {
      alert("กรุณากรอกรหัสอุปกรณ์ทั้งหมด")
      return
    }
    
    // Check for duplicate IDs
    if (isAsset && new Set(addEquipmentForm.ids).size !== addEquipmentForm.ids.length) {
      alert("รหัสอุปกรณ์ต้องไม่ซ้ำกัน")
      return
    }
    
    if (addEquipmentForm.nameThai && addEquipmentForm.quantity) {
      if (isAsset) {
        // Create separate equipment record for each ID
        const newEquipments: Equipment[] = addEquipmentForm.ids.map((id) => ({
          id: id,
          name: `${addEquipmentForm.nameThai}${addEquipmentForm.nameEnglish ? ` (${addEquipmentForm.nameEnglish})` : ""}`,
          category: addEquipmentForm.category,
          quantity: 1
        }))
        setEquipment([...equipment, ...newEquipments])
      } else {
        // For consumables, create single record
        const newEquipment: Equipment = {
          id: `${addEquipmentForm.category}-${Date.now()}`,
          name: `${addEquipmentForm.nameThai}${addEquipmentForm.nameEnglish ? ` (${addEquipmentForm.nameEnglish})` : ""}`,
          category: addEquipmentForm.category,
          quantity: parseInt(addEquipmentForm.quantity)
        }
        setEquipment([...equipment, newEquipment])
      }
      
      setShowAddEquipmentModal(false)
      setSuccessMessage("เพิ่มอุปกรณ์ใหม่สำเร็จ!")
      setShowSuccessModal(true)
    }
  }

  const handleIssue = (equipmentId: string) => {
    // TODO: Handle equipment issue
    console.log("Issue equipment:", equipmentId)
  }

  const handleAdd = (equipmentId: string) => {
    const item = equipment.find(e => e.id === equipmentId)
    if (item) {
      setAddStockForm({
        equipmentId: item.id,
        equipmentName: item.name,
        equipmentCategory: item.category,
        quantity: "",
        date: new Date().toISOString().split('T')[0],
        referenceNumber: "",
        assetIds: [],
        notes: ""
      })
      setShowAddStockModal(true)
    }
  }

  const handleAddStockSubmit = () => {
    const isAsset = addStockForm.equipmentCategory === "asset"
    
    if (isAsset) {
      // For assets, check if all IDs are filled
      const quantityNum = parseInt(addStockForm.quantity) || 0
      if (addStockForm.assetIds.length !== quantityNum) {
        alert("กรุณากรอกรหัสอุปกรณ์ทั้งหมด")
        return
      }
      
      // Check for duplicate IDs
      if (new Set(addStockForm.assetIds).size !== addStockForm.assetIds.length) {
        alert("รหัสอุปกรณ์ต้องไม่ซ้ำกัน")
        return
      }
      
      // Add each asset as a separate equipment record
      const newEquipments: Equipment[] = addStockForm.assetIds.map((id) => ({
        id: id,
        name: addStockForm.equipmentName,
        category: addStockForm.equipmentCategory,
        quantity: 1
      }))
      setEquipment([...equipment, ...newEquipments])
    } else {
      // For consumables, just add to quantity
      if (addStockForm.quantity && addStockForm.date) {
        setEquipment(equipment.map(item =>
          item.id === addStockForm.equipmentId
            ? { ...item, quantity: item.quantity + parseInt(addStockForm.quantity) }
            : item
        ))
      } else {
        return
      }
    }
    
    setShowAddStockModal(false)
    setSuccessMessage("เพิ่มสต๊อกสำเร็จ!")
    setShowSuccessModal(true)
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
      <Header title="จัดการอุปกรณ์/ครุภัณฑ์" />

      {/* ===== CONTENT ===== */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[360px] px-4 flex flex-col items-center pb-6">
          {/* Back Button and Add Equipment Button */}
          <div className="w-full flex gap-3 mt-6 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="
                flex-1
                py-3
                rounded-full
                border border-gray-400
                text-gray-600
                text-sm font-medium
                hover:bg-gray-100
                transition
              "
            >
              ย้อนกลับ
            </button>
            <button
              onClick={handleAddEquipment}
              className="
                flex-1
                py-3
                rounded-full
                bg-orange-500
                text-white
                text-sm font-semibold
                hover:bg-orange-600
                transition
              "
            >
              + เพิ่มอุปกรณ์ใหม่
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
                rounded-full
                outline-none
                text-sm
              "
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              🔍
            </button>
          </div>

          {/* Category Filter */}
          <div className="w-full mb-6 flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as any)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    selectedCategory === cat.key
                      ? "bg-orange-500 text-white"
                      : "border border-gray-300 text-gray-700 hover:border-orange-500"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Equipment List */}
          <div className="w-full flex flex-col gap-4">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-orange-50
                    rounded-lg
                    p-4
                    border border-orange-200
                  "
                >
                  {/* Equipment Name */}
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>

                  {/* Quantity */}
                  <p className="text-xs text-gray-600 mb-3">
                    จำนวนอุปกรณ์ {item.quantity} ชิ้น
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleIssue(item.id)}
                      className="
                        flex-1
                        py-2
                        rounded
                        border border-orange-500
                        text-orange-500
                        text-xs font-medium
                        hover:bg-orange-50
                        transition
                      "
                    >
                      แก้ไข/ลบ
                    </button>
                    <button
                      onClick={() => handleAdd(item.id)}
                      className="
                        flex-1
                        py-2
                        rounded
                        bg-orange-500
                        text-white
                        text-xs font-medium
                        hover:bg-orange-600
                        transition
                      "
                    >
                      เพิ่มสต๊อก
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-8">
                ไม่พบอุปกรณ์ที่ค้นหา
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== ADD STOCK MODAL ===== */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start z-50">
          <div className="w-screen h-screen bg-white overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-4 text-center font-semibold sticky top-0">
              เพิ่มสต๊อก
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-5">
              {/* Equipment Name Display */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">ชื่ออุปกรณ์</label>
                <input
                  type="text"
                  value={addStockForm.equipmentName}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm bg-gray-50 text-gray-600"
                />
              </div>

              {/* For Consumables - Date Field */}
              {addStockForm.equipmentCategory !== "asset" && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">วันที่รับเข้า</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={addStockForm.date}
                      onChange={(e) => setAddStockForm({ ...addStockForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span>
                  </div>
                </div>
              )}

              {/* Quantity Field */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  {addStockForm.equipmentCategory === "asset" ? "จำนวนอุปกรณ์ที่เพิ่ม" : "จำนวนที่เพิ่ม"}
                </label>
                <input
                  type="number"
                  value={addStockForm.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 0
                    if (addStockForm.equipmentCategory === "asset") {
                      // For assets, generate asset ID fields
                      const newIds = Array(qty).fill("").map((_, i) => addStockForm.assetIds[i] || "")
                      setAddStockForm({ ...addStockForm, quantity: e.target.value, assetIds: newIds })
                    } else {
                      setAddStockForm({ ...addStockForm, quantity: e.target.value })
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                  placeholder={addStockForm.equipmentCategory === "asset" ? "เช่น 5" : "เช่น 20"}
                  min="1"
                />
              </div>

              {/* Asset ID Fields - Only for Assets */}
              {addStockForm.equipmentCategory === "asset" && addStockForm.assetIds.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-3">รหัสอุปกรณ์</label>
                  <div className="flex flex-col gap-2">
                    {addStockForm.assetIds.map((id, index) => (
                      <input
                        key={index}
                        type="text"
                        value={id}
                        onChange={(e) => {
                          const newIds = [...addStockForm.assetIds]
                          newIds[index] = e.target.value
                          setAddStockForm({ ...addStockForm, assetIds: newIds })
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                        placeholder={`รหัสอุปกรณ์ที่ ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Field - Only for Assets */}
              {addStockForm.equipmentCategory === "asset" && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">หมายเหตุ</label>
                  <input
                    type="text"
                    value={addStockForm.notes}
                    onChange={(e) => setAddStockForm({ ...addStockForm, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                    placeholder="ไม่จำเป็นต้องกรอก"
                  />
                </div>
              )}

              {/* For Consumables - Reference Number Field */}
              {addStockForm.equipmentCategory !== "asset" && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">เลขที่ใบเบิก</label>
                  <input
                    type="text"
                    value={addStockForm.referenceNumber}
                    onChange={(e) => setAddStockForm({ ...addStockForm, referenceNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                    placeholder="ไม่จำเป็นต้องกรอก"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pb-4 justify-end">
                <button
                  onClick={() => setShowAddStockModal(false)}
                  className="px-6 py-3 border border-gray-400 text-gray-600 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAddStockSubmit}
                  className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden">
            {/* Success Header */}
            <div className="w-full bg-orange-500 text-white p-4 text-center">
              <h2 className="text-lg font-bold">{successMessage}</h2>
            </div>

            {/* Modal Content */}
            <div className="p-8 text-center">

              {/* Success Details Box */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                {/* Equipment Name */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">อุปกรณ์ที่เพิ่ม</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {addEquipmentForm.nameThai ? (
                      <>
                        {addEquipmentForm.nameThai}
                        {addEquipmentForm.nameEnglish && ` (${addEquipmentForm.nameEnglish})`}
                      </>
                    ) : (
                      addStockForm.equipmentName
                    )}
                  </p>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">จำนวน</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {addEquipmentForm.quantity || addStockForm.quantity} ชิ้น
                  </p>
                </div>

                {/* Date - Only for consumables in stock form */}
                {addStockForm.equipmentCategory !== "asset" && !addEquipmentForm.nameThai && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">วันที่รับเข้า</p>
                    <p className="text-sm font-semibold text-gray-800">{addStockForm.date}</p>
                  </div>
                )}

                {/* Equipment IDs - Only for assets in new equipment form */}
                {addEquipmentForm.category === "asset" && addEquipmentForm.ids.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">รหัสอุปกรณ์ที่เพิ่ม</p>
                    <p className="text-sm font-semibold text-gray-800">{addEquipmentForm.ids.join(", ")}</p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  setAddStockForm({
                    equipmentId: "",
                    equipmentName: "",
                    equipmentCategory: "consumable",
                    quantity: "",
                    date: new Date().toISOString().split('T')[0],
                    referenceNumber: "",
                    assetIds: [],
                    notes: ""
                  })
                }}
                className="w-full py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD EQUIPMENT MODAL ===== */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start z-50">
          <div className="w-screen h-screen bg-white overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-4 text-center font-semibold sticky top-0">
              เพิ่มอุปกรณ์ใหม่
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-5 max-w-md mx-auto">
              {/* Category Dropdown */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">หมวดหมู่</label>
                <select
                  value={addEquipmentForm.category}
                  onChange={(e) => setAddEquipmentForm({ ...addEquipmentForm, category: e.target.value as any, ids: [], quantity: "" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="consumable">วัสดุสิ้นเปลือง</option>
                  <option value="asset">ครุภัณฑ์</option>
                </select>
              </div>

              {/* Equipment Name Thai Field */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">ชื่ออุปกรณ์ (ไทย)</label>
                <input
                  type="text"
                  value={addEquipmentForm.nameThai}
                  onChange={(e) => setAddEquipmentForm({ ...addEquipmentForm, nameThai: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                  placeholder="เช่น โปรเจคเตอร์"
                />
              </div>

              {/* Equipment Name English Field */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">ชื่ออุปกรณ์ (English)</label>
                <input
                  type="text"
                  value={addEquipmentForm.nameEnglish}
                  onChange={(e) => setAddEquipmentForm({ ...addEquipmentForm, nameEnglish: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                  placeholder="เช่น Projector (optional)"
                />
              </div>

              {/* Quantity Field */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">จำนวนเริ่มต้น</label>
                <input
                  type="number"
                  value={addEquipmentForm.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 0
                    const newIds = Array(qty).fill("").map((_, i) => addEquipmentForm.ids[i] || "")
                    setAddEquipmentForm({ ...addEquipmentForm, quantity: e.target.value, ids: newIds })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                  placeholder="เช่น 5"
                  min="1"
                />
              </div>

              {/* Equipment ID Fields - Only for Asset */}
              {addEquipmentForm.category === "asset" && addEquipmentForm.ids.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-3">รหัสอุปกรณ์</label>
                  <div className="flex flex-col gap-2">
                    {addEquipmentForm.ids.map((id, index) => (
                      <input
                        key={index}
                        type="text"
                        value={id}
                        onChange={(e) => {
                          const newIds = [...addEquipmentForm.ids]
                          newIds[index] = e.target.value
                          setAddEquipmentForm({ ...addEquipmentForm, ids: newIds })
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                        placeholder={`รหัสอุปกรณ์ที่ ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Field */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">หมายเหตุ</label>
                <input
                  type="text"
                  value={addEquipmentForm.notes}
                  onChange={(e) => setAddEquipmentForm({ ...addEquipmentForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500"
                  placeholder="ไม่จำเป็นต้องกรอก"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pb-4 justify-end">
                <button
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="px-6 py-3 border border-gray-400 text-gray-600 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAddEquipmentSubmit}
                  className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
