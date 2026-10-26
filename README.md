# 🍽️ Restaurant Management System (MongoDB Edition)

A modern, full-stack **Restaurant Management System** engineered with a **Node.js/Express** backend, **MongoDB & Mongoose** data layer, and a **React + TypeScript (Vite)** frontend. 

The platform implements an **Event-Driven Domain-Driven Design (DDD)**, strict **Role-Based Access Control (RBAC)**, and tailored, glassmorphism-styled dashboards for each operational role in a fast-paced restaurant. It comes pre-loaded with an authentic **Paradise Restaurant Menu** priced in Indian Rupees (**INR / ₹**) with rich dish photography.

---

## 📸 Demo Media

| Role Dashboard | Preview |
| :--- | :--- |
| **Server Terminal** (Placing Orders) | ![Server Page Demo](./.github/assets/server.gif) |
| **Kitchen Display System** (Order Queue) | ![Kitchen Page Demo](./.github/assets/kitchen.gif) |
| **Cashier Dashboard** (Billing & Settlement) | ![Cashier Page Demo](./.github/assets/cashier.gif) |
| **Manager Dashboard** (Analytics & Inventory) | ![Manager Page Demo](./.github/assets/manager.gif) |

---

## 🌟 Key Highlights & Features

- **MongoDB & Mongoose Migration**: Fully migrated from relational SQL to a high-performance MongoDB document store using Mongoose schemas.
- **Authentic Paradise Restaurant Menu**: Features 32 unique Indian specialties (Biryanis, Kebabs, Starters, Curries, Indian Breads, Desserts, and Beverages) with realistic market pricing in **INR (₹)** and curated dish imagery.
- **Event-Driven Architecture**: Decoupled domain modules interacting via a lightweight, in-memory `EventBus`. When an order is placed (`ORDER_CREATED`), kitchen tickets are generated automatically, and raw ingredient inventories are deducted instantaneously.
- **Modern Glassmorphic UI**: Ambient mesh gradient backgrounds, responsive card layouts with image zoom animations, live status badges, and interactive table maps.
- **Role-Based Workspaces**:
  - 🍽️ **Server (`/server`)**: Visual dish browser, real-time availability badges, table status assignment, and quick order builder.
  - 👨‍🍳 **Chef / Kitchen (`/kitchen`)**: Digital Kitchen Display System (KDS) with ticket queues and lifecycle state tracking (`preparing` ➔ `ready`).
  - 💳 **Cashier (`/cashier`)**: Visual table map with live unpaid/paid status indicators, itemized bill review, and one-click payment settlement.
  - 📈 **Manager (`/manager`)**: Real-time sales telemetry (daily & 7-day revenue in ₹), table utilization metrics, and automated low-stock inventory alerts.
  - 🛡️ **Admin (`/admin`)**: Centralized employee credential and role management.

---

## 🏗️ System Architecture

### 🔧 Backend
- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB (via Mongoose ODM)
- **Security:** JWT (`jsonwebtoken`) with HTTP Bearer authentication & `bcryptjs` password hashing
- **Domain Events:** In-memory `EventBus` pub/sub pattern

#### Core Modules:
| Module | Responsibility |
| :--- | :--- |
| **`auth`** | User verification, password encryption, and JWT token distribution. |
| **`order`** | Menu catalog retrieval, item availability toggles, and order dispatching. |
| **`table`** | Dining table state machine (`available`, `occupied`, `food_ready`). |
| **`kitchen`**| Kitchen ticket lifecycle and preparation queue. |
| **`billing`**| Bill calculation, status tracking (`pending`, `paid`), and invoice closing. |
| **`inventory`** | Real-time ingredient balance tracking and automatic threshold alerts. |
| **`analytics`** | Daily and historical revenue reporting with date filtering. |

### 💻 Frontend
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS 4, `@fontsource-variable/geist` typography, and glassmorphic UI components
- **UI Components:** Radix UI primitives & Lucide Icons
- **State & Routing:** React Router 6 with protected role-based routes, custom React Hooks, and Axios API abstraction

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI
- Optional: [MongoDB Compass](https://www.mongodb.com/products/tools/compass) for visual database inspection

---

### 1️⃣ Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   Copy `.env.example` to `.env` (or configure your own):
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/RestaurantSystem

   # Authentication
   JWT_SECRET=supersecretjwtkey
   JWT_EXPIRES_IN=8h

   # Server
   PORT=3000
   ```

4. Seed the database with default users, tables, ingredients, and the Paradise menu:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be available at `http://localhost:3000`.*

---

### 2️⃣ Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client interface will launch at `http://localhost:5173`.*

---

## 👥 Default Credentials

The database seed script (`npm run seed`) automatically prepares accounts for testing:

| Role | Username | Password | Accessible Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | `/admin` |
| **Manager** | `manager` | `manager123` | `/manager` |
| **Server** | `server` | `server123` | `/server` |
| **Chef** | `chef` | `chef123` | `/kitchen` |
| **Cashier** | `cashier` | `cashier123` | `/cashier` |

---

## 📡 API Overview

| Method | Endpoint | Description | Role Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/menu` | Retrieve menu catalog with images and prices | Server, Manager, Admin |
| `PATCH`| `/api/menu/:id/availability` | Toggle item in/out of stock | Server, Manager, Admin |
| `GET` | `/api/tables` | Fetch all tables and their statuses | Server, Cashier, Manager |
| `POST` | `/api/orders` | Create a new table order | Server |
| `GET` | `/api/kitchen/tickets` | View active kitchen tickets | Chef, Manager |
| `PATCH`| `/api/kitchen/tickets/:id/status` | Update ticket status (`preparing`/`ready`) | Chef |
| `GET` | `/api/billing/tables/:tableId` | Retrieve current bill for a table | Cashier |
| `POST` | `/api/billing/pay` | Settle pending bill | Cashier |
| `GET` | `/api/inventory` | View current ingredient stock levels | Manager, Admin |
| `GET` | `/api/analytics/daily?date=YYYY-MM-DD` | View daily total revenue | Manager, Admin |
| `GET` | `/api/health` | Healthcheck & MongoDB connectivity probe | Public |

---

## 🔮 Future Enhancements
- [ ] Distributed message broker integration (RabbitMQ / Redis PubSub) replacing the local EventBus.
- [ ] WebSocket / Socket.io live updates for instant kitchen-to-server notifications.
- [ ] Automated end-to-end testing suite with Playwright and Vitest.
- [ ] Customer QR code mobile ordering and digital receipts.
