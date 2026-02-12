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
  userId: string
  userEmail: string
  userName: string
  userIdNumber?: string
  borrowType: "during-class" | "teaching" | "outside"
  equipmentItems: BorrowItem[]
  borrowDate: string
  borrowTime: string
  expectedReturnDate: string
  expectedReturnTime?: string
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
  // Confirmation fields (when admin gives equipment)
  confirmedBy?: string
  confirmedByEmail?: string
  confirmedAt?: number
  // Cancellation fields
  cancelledBy?: string
  cancelledByEmail?: string
  cancelledAt?: number
  cancelReason?: string
  // Return timestamp
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
  userIdNumber?: string,
  expectedReturnTime?: string
) {
  try {
    const borrowId = `borrow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const transaction: BorrowTransaction = {
      borrowId,
      userId: user.uid,
      userEmail: user.email || "",
      userName: userName || user.displayName || "Unknown",
      userIdNumber: userIdNumber || "",
      borrowType,
      equipmentItems,
      borrowDate,
      borrowTime,
      expectedReturnDate,
      expectedReturnTime: expectedReturnTime || "",
      conditionBeforeBorrow,
      status: "scheduled", // Waiting for admin to confirm and give equipment
      notes: notes || "",
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

/**
 * Admin confirms and gives equipment to user
 * Changes status from "scheduled" to "borrowed"
 */
export async function confirmBorrowTransaction(
  borrowId: string,
  confirmedBy: User,
  confirmedByName?: string,
  notes?: string
) {
  try {
    const borrowDocRef = doc(db, "borrowHistory", borrowId)
    const borrowDoc = await getDoc(borrowDocRef)

    if (!borrowDoc.exists()) {
      throw new Error(`Borrow transaction with ID ${borrowId} not found`)
    }

    const currentData = borrowDoc.data()
    if (currentData.status !== "scheduled") {
      throw new Error(`Transaction is not in scheduled status. Current status: ${currentData.status}`)
    }

    // Update status to borrowed
    await setDoc(
      borrowDocRef,
      {
        status: "borrowed",
        confirmedBy: confirmedByName || confirmedBy?.displayName || "Admin",
        confirmedByEmail: confirmedBy?.email,
        confirmedAt: Date.now(),
        notes: notes || currentData.notes
      },
      { merge: true }
    )
  } catch (error) {
    console.error("Error confirming borrow transaction:", error)
    throw error
  }
}

/**
 * Admin cancels a borrow request
 */
export async function cancelBorrowTransaction(
  borrowId: string,
  cancelledBy: User,
  cancelledByName?: string,
  reason?: string
) {
  try {
    const borrowDocRef = doc(db, "borrowHistory", borrowId)
    const borrowDoc = await getDoc(borrowDocRef)

    if (!borrowDoc.exists()) {
      throw new Error(`Borrow transaction with ID ${borrowId} not found`)
    }

    // Update status to cancelled
    await setDoc(
      borrowDocRef,
      {
        status: "cancelled",
        cancelledBy: cancelledByName || cancelledBy?.displayName || "Admin",
        cancelledByEmail: cancelledBy?.email,
        cancelledAt: Date.now(),
        cancelReason: reason || ""
      },
      { merge: true }
    )
  } catch (error) {
    console.error("Error cancelling borrow transaction:", error)
    throw error
  }
}
