import { httpsCallable, getFunctions } from 'firebase/functions'

export interface BorrowEmailData {
  userEmail: string
  userName: string
  equipmentNames: string[]
  borrowDate: string
  borrowTime: string
  expectedReturnDate: string
  expectedReturnTime?: string
  borrowType: string
}

export async function sendBorrowAcknowledgmentEmail(data: BorrowEmailData): Promise<{ success: boolean; message: string }> {
  try {
    const functions = getFunctions()
    const sendEmail = httpsCallable(functions, 'sendBorrowAcknowledgmentEmail')
    
    await sendEmail({
      userEmail: data.userEmail,
      userName: data.userName,
      equipmentNames: data.equipmentNames,
      borrowDate: data.borrowDate,
      borrowTime: data.borrowTime,
      expectedReturnDate: data.expectedReturnDate,
      expectedReturnTime: data.expectedReturnTime || '',
      borrowType: data.borrowType
    })

    return {
      success: true,
      message: 'ส่งอีเมลสำเร็จแล้ว'
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      message: 'ขออภัย เกิดข้อผิดพลาดในการส่งอีเมล'
    }
  }
}
