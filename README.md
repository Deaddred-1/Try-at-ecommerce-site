# SYLERA – Full Stack E-commerce Platform

SYLERA is a try at building a production-ready full-stack e-commerce web application built using the MERN ecosystem with Prisma + PostgreSQL.

It includes authentication via OTP, role-based admin controls, product management with image uploads, cart & wishlist systems, checkout flows, and order lifecycle management.

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS
- Context API (Cart & Wishlist state management)

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (Image Uploads)
- Nodemailer (Email Notifications)

---

## Features

### Authentication
- OTP-based login (SMS simulated)
- JWT-based authentication
- Profile completion flow
- Role-based access (USER / ADMIN)

### Shopping Experience
- Product listing with filtering & sorting
- Wishlist system
- Dynamic cart drawer
- Unlimited quantity ordering
- Discount price logic

### Checkout & Orders
- Address management
- Cash on Delivery (COD)
- Manual UPI payment flow
- Order confirmation lifecycle:
  - PENDING
  - PAYMENT_PENDING_VERIFICATION
  - CONFIRMED
  - SHIPPED
  - DELIVERED
  - CANCELLED

### Admin Dashboard
- Create & update products
- Multiple image upload support
- Toggle in-stock / out-of-stock
- View and manage orders
- Update order status

### Email System
- Welcome email on registration
- Order confirmation email
- Order status update email
- Admin notification on new order

### Image Handling
- Multer-based image upload
- Static file serving
- Environment-based API URLs
- Production-ready image URL handling

---

## Project Structure

```
frontend/
backend/
backend/prisma/
backend/uploads/
```

---

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)

```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/sylera.git
cd sylera
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Why This Project Matters

This project demonstrates a try at:

- Full-stack architecture design
- Real-world authentication flows
- Database relationship modeling
- State management at scale
- Production-ready environment configuration
- Admin system design
- E-commerce lifecycle implementation

---

## Future Improvements

- Payment gateway integration (Stripe/Razorpay)
- Cloudinary/S3 image storage
- Server-side caching
- Pagination improvements
- Admin analytics dashboard

---

## Lastly

This project is built for educational and portfolio purposes only.