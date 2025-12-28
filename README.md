# 🖨️ PrintZap: Smart Campus Print Network

![PrintZap Banner](https://via.placeholder.com/1200x400?text=PrintZap+Smart+Campus+Network)

> **Zero Queues. 100% Privacy. Instant Print.**
> An intelligent load-balancing print network that connects students to the *least crowded* shop via Zoho SalesIQ.

---

## 🚨 The Problem
**Campus printing is broken.**
* **⏳ The Time Cost:** Students wait 20-30 minutes in line just to handover a file.
* **📉 The Efficiency Gap:** The Library shop is overcrowded (50+ jobs), while the Hostel shop is empty because nobody knows.
* **🔓 The Privacy Risk:** Students are forced to share personal phone numbers via WhatsApp to send files.
* **😫 The Manual Fatigue:** Shopkeepers manually download files, count pages, and calculate costs for every single student.

## 💡 The Solution
**PrintZap** turns a chaotic manual process into a **Automated Smart Network**.
1.  **For Students (Zobot):** A WhatsApp-like chat bot that uploads files and automatically routes them to the shop with the **shortest queue**.
2.  **For Shop Owners (Dashboard):** A "Kitchen Display System" that receives files, auto-calculates prices, and prints with **One Click**.

---

## 🌟 Key Features

### 🎓 1. Student Interface (Zoho SalesIQ Zobot)
* **🧠 Smart Load Balancing:** The system analyzes `User Location` vs `Live Queue Data` to route the order to the fastest shop.
* **📂 Direct File Upload:** Supports PDF & DOCX uploads directly in the chat window.
* **🧮 Auto-Price Calculator:** Instantly calculates cost: `(Pages × Copies × Rate)`.
* **📍 One-Tap Location:** Uses the student's saved profile to detect location (Hostel/Library/Canteen).

### 🖨️ 2. Shop Owner Interface (React Dashboard)
* **⚡ Real-Time Order Board:** Incoming orders appear instantly (WebSockets).
* **🖱️ Silent One-Click Print:** Uses browser-based printing logic to open the print dialog immediately. **No downloading required.**
* **🔒 Secure PIN Mode:** "Locked" files (Resumes/Medical) only open when the student provides a 4-digit PIN at the counter.
* **📉 Automated Queue Management:** Marking an order as "Done" updates the public queue score, redirecting traffic flow.

---

## ⚙️ The Architecture & Workflow



1.  **Input:** Student uploads file to **Zobot** -> Backend receives data.
2.  **Intelligence (The Brain):**
    * *Algorithm checks:* Shop A (Queue: 25) vs Shop B (Queue: 2).
    * *Decision:* Routes to **Shop B**.
3.  **Routing:** Zobot replies: *"Shop A is busy. Routing to Shop B. Order #PZ-905"*.
4.  **Execution:** Shop B's Dashboard flashes. Owner clicks **Print**.
5.  **Completion:** Owner marks "Done". System updates queue count.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Bot Platform** | **Zoho SalesIQ** | Zobot with Deluge Scripting for user interaction. |
| **Frontend** | **React.js + Tailwind** | Responsive Dashboard for shop owners. |
| **Backend** | **Node.js + Express** | REST API for logic, routing, and queue calculation. |
| **Database** | **MongoDB Atlas** | Stores Users, Orders, and Live Shop Status. |
| **Printing** | **print-js** | Library for seamless browser-based printing. |
| **Tools** | **Google Antigravity** | Used for rapid AI-assisted development. |

---

## 🚀 Innovation: Why PrintZap Wins?

| Feature | The "Old Way" (WhatsApp) | ✅ The PrintZap Way |
| :--- | :--- | :--- |
| **Traffic Control** | ❌ None. Everyone floods one shop. | ✅ **Smart Routing to empty shops.** |
| **Privacy** | ❌ Phone numbers exposed. | ✅ **100% Anonymous (Order ID).** |
| **Storage** | ❌ Clutters HDD with junk files. | ✅ **Zero Footprint (RAM Printing).** |
| **Workflow** | ❌ Download -> Open -> Count -> Print. | ✅ **Click "Print". Done.** |

---

## 📸 Screenshots

| **Student Chat (Zobot)** | **Shop Dashboard (React)** |
| :---: | :---: |
| ![Zobot UI](https://via.placeholder.com/300x500?text=Zobot+Chat) | ![Dashboard UI](https://via.placeholder.com/500x300?text=Shop+Dashboard) |

---

## 🏗️ Installation & Setup Guide

### 1. Backend (Node.js)
```bash
cd backend
npm install
# Create a .env file and add your MONGO_URI
node index.js
# Server starts on Port 5000