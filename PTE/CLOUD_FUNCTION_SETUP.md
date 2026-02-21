/**
 * Firebase Cloud Function for sending borrow acknowledgment emails
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Create functions directory if not exists:
 *    mkdir functions && cd functions
 * 
 * 2. Initialize Cloud Functions:
 *    npm init
 *    npm install firebase-functions firebase-admin dotenv
 *    npm install -D typescript @types/node
 * 
 * 3. Choose an email service (pick one):
 *    - SendGrid: npm install @sendgrid/mail
 *    - Mailgun: npm install mailgun.js
 *    - Gmail (SMTP): No package needed, use nodemailer
 * 
 * 4. Set up environment variables in .env:
 *    SENDGRID_API_KEY=sg_xxxxxxxxxxxxx
 *    OR
 *    MAILGUN_API_KEY=key-xxxxxxxxxxxxx
 * 
 * 5. Deploy to Firebase:
 *    firebase deploy --only functions
 * 
 * EXAMPLE IMPLEMENTATION (using SendGrid):
 */

/**
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

// Initialize Firebase
admin.initializeApp();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface BorrowEmailRequest {
  userEmail: string;
  userName: string;
  equipmentNames: string[];
  borrowDate: string;
  borrowTime: string;
  expectedReturnDate: string;
  expectedReturnTime: string;
  borrowType: string;
}

exports.sendBorrowAcknowledgmentEmail = functions.https.onCall(
  async (data: BorrowEmailRequest, context) => {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const {
      userEmail,
      userName,
      equipmentNames,
      borrowDate,
      borrowTime,
      expectedReturnDate,
      expectedReturnTime,
      borrowType,
    } = data;

    try {
      const equipmentList = equipmentNames
        .map((item) => `<li>${item}</li>`)
        .join("");

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>ยืนยันการรับการยืมอุปกรณ์</h2>
          <p>สวัสดีคุณ ${userName},</p>
          <p>ทีมงานของเราได้รับเรื่องการยืมอุปกรณ์ของคุณแล้ว</p>
          
          <h3>รายละเอียดการยืม:</h3>
          <ul>
            <li><strong>ชื่อผู้ยืม:</strong> ${userName}</li>
            <li><strong>ประเภทการยืม:</strong> ${borrowType}</li>
            <li><strong>วันที่ยืม:</strong> ${borrowDate} เวลา ${borrowTime}</li>
            <li><strong>กำหนดคืน:</strong> ${expectedReturnDate} ${expectedReturnTime || ""}</li>
          </ul>

          <h3>อุปกรณ์ที่ยืม:</h3>
          <ul>${equipmentList}</ul>

          <p>หากมีข้อสงสัย โปรดติดต่อทีมงานของเรา</p>
          <p>ขอบคุณครับ</p>
        </div>
      `;

      const msg = {
        to: userEmail,
        from: "noreply@your-institution.com", // Change this to your institution email
        subject: "ยืนยันการรับการยืมอุปกรณ์",
        html: htmlContent,
      };

      await sgMail.send(msg);

      return {
        success: true,
        message: "ส่งอีเมลสำเร็จแล้ว",
      };
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);

/**
 * ALTERNATIVE: Using Mailgun
 * 
 * const mailgun = require("mailgun.js");
 * const FormData = require("form-data");
 * const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY });
 * 
 * exports.sendBorrowAcknowledgmentEmail = functions.https.onCall(
 *   async (data: BorrowEmailRequest, context) => {
 *     // ... validation code ...
 *     
 *     const equipmentList = equipmentNames.join(", ");
 *     
 *     const messageData = {
 *       from: "noreply@your-domain.com",
 *       to: userEmail,
 *       subject: "ยืนยันการรับการยืมอุปกรณ์",
 *       text: `ยืนยันการรับการยืม:\n\nอุปกรณ์: ${equipmentList}\nวันยืม: ${borrowDate}\nกำหนดคืน: ${expectedReturnDate}`,
 *     };
 *     
 *     await mg.messages.create("your-domain.com", messageData);
 *     return { success: true, message: "ส่งอีเมลสำเร็จแล้ว" };
 *   }
 * );
 */

/**
 * SETUP STEPS IN FIREBASE CONSOLE:
 * 
 * 1. Go to Firebase Console > Functions
 * 2. Set up .env in functions directory with your email service API key
 * 3. Deploy: firebase deploy --only functions
 * 4. Function URL will be generated automatically
 * 5. Frontend emailService.ts will call it via httpsCallable()
 * 
 * TESTING THE FUNCTION:
 * 
 * firebase emulators:start
 * // Then call from your app - it will use local emulator
 */
