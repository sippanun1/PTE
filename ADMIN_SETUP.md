# Admin System Setup Guide

## Overview
This application now has a complete role-based admin system using Firebase Authentication and Firestore.

## How to Create an Admin

### Step 1: Register a New User
1. Go to the Register page (`/register`)
2. Fill in all required fields:
   - Full Name
   - Student ID
   - Undergraduate Year
   - Email
   - Password
   - Confirm Password
3. Click "Register" and the account will be created

### Step 2: Convert User to Admin
1. Log in with an **existing admin account**
2. You'll be automatically redirected to the Admin Dashboard (`/admin`)
3. Click on **"จัดการแอดมิน"** (Manage Admin)
4. Enter the email address of the user you want to make an admin
5. Click **"ตั้งเป็นแอดมิน"** (Set as Admin)
6. The user is now an admin! They will see the admin dashboard on their next login

## How to Access Admin Panel

1. **Regular User Login:**
   - Log in with email and password
   - Redirected to `/home` (user dashboard)
   - Cannot access admin pages

2. **Admin Login:**
   - Log in with email and password
   - Automatically redirected to `/admin` (admin dashboard)
   - Has access to all admin features

## Admin Features

### Admin Dashboard (`/admin`)
- **จัดการห้อง** (Manage Rooms) - Manage room information
- **จัดการอุปกรณ์/ครุภัณฑ์** (Manage Equipment) - Manage equipment/supplies
- **ประวัติการยืม/คืน** (Borrow/Return History) - View transaction history
- **จัดการแอดมิน** (Manage Admin) - Promote users to admin
- **ออกจากระบบ** (Logout) - Sign out

## Technical Details

### Files Modified/Created:

1. **[src/hooks/useAuth.ts](src/hooks/useAuth.ts)** - Custom hook to check user authentication and role
2. **[src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)** - Component to protect routes based on user role
3. **[src/pages/Admin/AdminManagement.tsx](src/pages/Admin/AdminManagement.tsx)** - Page to manage admin roles
4. **[src/App.tsx](src/App.tsx)** - Updated routing with protected routes
5. **[src/pages/Login.tsx](src/pages/Login.tsx)** - Updated to redirect based on user role
6. **[src/pages/Admin/AdminDashboard.tsx](src/pages/Admin/AdminDashboard.tsx)** - Added admin management button and logout

### Firestore Data Structure

Users are stored in Firestore with this structure:
```
users/
  {userId}/
    fullName: string
    idNumber: string
    undergraduateYears: string
    email: string
    role: "admin" | "user"
    createdAt: string
```

## Security Features

1. **Protected Routes**: Only admin users can access admin pages
2. **Role-Based Access Control (RBAC)**: Routes check user role before rendering
3. **Automatic Redirection**: Users are redirected based on their role
4. **Firebase Authentication**: Secure email/password authentication
5. **Loading States**: Shows loading screen while checking authentication

## Example Workflow

1. **Create First Admin (Manual):**
   - Register a regular user account
   - Open Firebase Console → Firestore Database
   - Manually edit the user document and change `role: "user"` to `role: "admin"`
   - The user is now an admin

2. **Create Additional Admins (Using App):**
   - Log in as an existing admin
   - Click "จัดการแอดมิน" (Manage Admin)
   - Enter the email of a registered user
   - Click "ตั้งเป็นแอดมิน" (Set as Admin)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| User can't access admin pages | Verify user has `role: "admin"` in Firestore |
| User sees loading screen indefinitely | Check Firebase connection and Firestore permissions |
| Email not found when promoting user | Ensure the user registered first and email is correct |
| Login redirects to wrong page | Clear browser cache and reload the page |

## Next Steps

1. Create your first admin account
2. Use that admin account to promote other users to admin
3. Customize the admin pages for your needs
4. Set up Firebase Security Rules to restrict data access
