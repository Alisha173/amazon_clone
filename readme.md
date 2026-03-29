# 🛒 E-Commerce Platform (Amazon Clone)

## 📌 Introduction

This project is a fullstack **E-Commerce Web Application**. It replicates the core functionality and user experience of Amazon, including product browsing, cart management, and order placement.

The application is designed with a focus on:

* Clean and scalable backend architecture
* Robust relational database design
* Responsive and intuitive UI inspired by Amazon

It supports a complete shopping workflow — from browsing products to placing orders — while maintaining modularity and extensibility.

---

## 🧰 Tech Stack

| Layer     | Technology                 |
| --------- | -------------------------- |
| Frontend  | React (Vite), Tailwind CSS |
| Backend   | Node.js, Express.js        |
| ORM       | Prisma                     |
| Database  | PostgreSQL (Supabase)      |
| API Style | REST                       |

---

## ✨ Features

### 🛍️ Product Listing

* Grid-based product display (Amazon-style layout)
* Search functionality for products
* Category-based filtering
* Product cards with image, name, price, and actions

### 📦 Product Details

* Image carousel for multiple product images
* Detailed product description
* Price and stock availability
* Add to Cart and Buy Now options

### 🛒 Shopping Cart

* Add products to cart
* Update product quantity
* Remove items from cart
* Cart summary with total price

### 📑 Order Placement

* Checkout with shipping details
* Order summary before confirmation
* Order placement with generated order ID

### 📜 Order History (Bonus)

* View previously placed orders

### 📱 Responsive Design (Bonus)

* Optimized for mobile, tablet, and desktop screens

---

## 🗂️ Database Schema

The database schema is designed using **relational modeling principles** with proper normalization and constraints.

* Clearly defined relationships between users, products, carts, and orders
* Junction tables for handling many-to-many relationships
* Use of unique constraints and cascading deletes to ensure data integrity

### 📊 Schema Diagram

![Database Schema](./Amazon_Class_UML.png)

### ⚡ Scalability Note

The schema is designed to be **extensible and production-ready**.
It supports additional features such as:

* Wishlist functionality
* Product ratings and reviews
* Discount handling

These features are modeled at the database level but are not fully implemented in the UI.

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
npm install
```

#### Environment Variables (`.env`)

```
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

#### Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
node prisma/seed.js
```

#### Run Backend

```bash
npm run dev
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Variables (`.env`)

```
VITE_API_URL=your_backend_url
```

#### Run Frontend

```bash
npm run dev
```

---

## ⚠️ Assumptions Made

* A **default user is assumed to be logged in** (no authentication implemented)
* No payment gateway integration (orders are placed directly)
* Each product is associated with a single seller
* Inventory is not reserved during checkout (no concurrency handling)
* Sample product data is pre-seeded into the database

---

## 🚀 Design Considerations

* **Modular Architecture**: Clear separation of concerns between frontend, backend, and database
* **Scalable Schema**: Designed to support future features like wishlist, reviews, and promotions
* **Data Integrity**: Enforced using foreign keys, unique constraints, and relational mappings
* **User Experience**: UI patterns inspired by Amazon for familiarity and usability

---

## 📌 Conclusion

This project demonstrates the implementation of a real-world e-commerce system with a strong emphasis on:

* Backend design and database modeling
* Fullstack integration
* Clean and maintainable code structure

It serves as a solid foundation for building scalable and production-ready e-commerce applications.
