import { doc, setDoc, collection, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import type { User } from "firebase/auth"

export interface BorrowItem {
  equipmentId: string
  equipmentName: string
  equipmentCategory: string
  quantityBorrowed: number
}

export interface BorrowTransaction {
  borrowId: string
  userEmail: string
  userName: string
  userIdNumber?: string
  borrowType: "during-class" | "teaching" | "outside"
  equipmentItems: BorrowItem[]
  borrowDate: string
  borrowTime: string
  expectedReturnDate: string
  actualReturnDate?: string
  returnTime?: string
  conditionBeforeBorrow: string
  conditionOnReturn?: string
  damagesAndIssues?: string
  returnedBy?: string // Admin or user who processed return
  returnedByEmail?: string
  status: "scheduled" | "borrowed" | "returned" | "cancelled"
  notes?: string
  timestamp: number
  returnTimestamp?: number
}

/**
 * Log equipment borrow transaction to Firestore
 */
export async function logBorrowTransaction(
  user: User,
  borrowType: "during-class" | "teaching" | "outside",
  equipmentItems: BorrowItem[],
  borrowDate: string,
  borrowTime: string,
  expectedReturnDate: string,
  conditionBeforeBorrow: string,
  notes?: string,
  userName?: string,
  userIdNumber?: string
) {
  try {
    const borrowId = `borrow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const transaction: BorrowTransaction = {
      borrowId,
      userEmail: user.email || "",
      userName: userName || user.displayName || "Unknown",
      userIdNumber: userIdNumber,
      borrowType,
      equipmentItems,
      borrowDate,
      borrowTime,
      expectedReturnDate,
      conditionBeforeBorrow,
      status: "borrowed",
      notes,
      timestamp: Date.now()
    }

    // Store in borrowHistory collection
    await setDoc(doc(collection(db, "borrowHistory"), borrowId), transaction)
    
    return borrowId
  } catch (error) {
    console.error("Error logging borrow transaction:", error)
    throw error
  }
}

/**
 * Log equipment return transaction to Firestore
 */
export async function logReturnTransaction(
  borrowId: string,
  returnDate: string,
  returnTime: string,
  conditionOnReturn: string,
  damagesAndIssues?: string,
  returnedBy?: User,
  returnedByName?: string,
  notes?: string
) {
  try {
    const borrowDocRef = doc(db, "borrowHistory", borrowId)
    const borrowDoc = await getDoc(borrowDocRef)

    if (!borrowDoc.exists()) {
      throw new Error(`Borrow transaction with ID ${borrowId} not found`)
    }

    // Update borrow transaction with return information
    await setDoc(
      borrowDocRef,
      {
        actualReturnDate: returnDate,
        returnTime,
        conditionOnReturn,
        damagesAndIssues: damagesAndIssues || "",
        returnedBy: returnedByName || returnedBy?.displayName || "System",
        returnedByEmail: returnedBy?.email,
        status: "returned",
        notes: notes || borrowDoc.data().notes,
        returnTimestamp: Date.now()
      } as Partial<BorrowTransaction>,
      { merge: true }
    )
  } catch (error) {
    console.error("Error logging return transaction:", error)
    throw error
  }
}
