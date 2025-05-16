# ShopSphere

Welcome to **ShopSphere** — a modern, professional, and interactive e-commerce platform built with Next.js and TypeScript. ShopSphere is designed for scalability, maintainability, and a seamless user experience for both customers and administrators.

---

## 🚀 Features

- 🛒 **Product Catalog**: Browse, search, and filter products by category.
- 🛍️ **Shopping Cart & Checkout**: Add products to your cart and enjoy a smooth checkout process.
- 👤 **User Authentication**: Secure registration, login, and profile management.
- 🛠️ **Admin Dashboard**: Manage products, users, orders, and store settings with ease.
- 📦 **Order Management**: Track and manage customer orders (admin only).
- 📱 **Responsive Design**: Fully optimized for all devices using Tailwind CSS.
- 🔒 **Secure API**: RESTful endpoints for products, cart, users, and more.
- 🧩 **Modular Architecture**: Clean, reusable React components and hooks.
- 🎨 **Customizable UI**: Easily update branding, colors, and store info.

---

## 🗂️ Project Structure

```txt
src/
  app/            # Next.js app directory (pages, layouts, routes)
    admin/        # Admin dashboard and management
    cart/         # Cart and checkout pages
    categories/   # Product categories
    products/     # Product listing and detail pages
    ...           # Other pages (about, contact, login, register, etc.)
  components/     # Reusable UI and layout components
    ui/           # UI primitives (button, card, input, etc.)
  context/        # React context for auth, cart, etc.
  hooks/          # Custom React hooks
  lib/            # Utility functions, types, and DB helpers
  pages/          # API routes (REST endpoints)
  public/         # Static assets (images, logos)
  services/       # External integrations (e.g., payment)
  styles/         # Global styles (Tailwind, CSS)
  tests/          # Test files (if any)
```

---

## 🏁 Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/abuba-akar0/ShopSphere.git
   cd ShopSphere
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in all required values (database, JWT secrets, etc).

4. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://localhost:3001](http://localhost:3001) to explore ShopSphere.

---

## 📦 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint code
- `npm run typecheck` — TypeScript type checking

---

## 📚 Tech Stack & Dependencies

- **Next.js** — React framework for production
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Radix UI** — Accessible UI primitives
- **Zod, React Hook Form** — Form validation
- **Lucide React** — Icon library
- **MySQL2, dotenv, jsonwebtoken, bcrypt** — Backend, security, and database

---

## 🛠️ Customization & Extensibility

- Update store info, logo, and settings in the admin dashboard.
- Add new pages, components, or API routes as your business grows.
- Easily integrate with payment gateways or third-party services via the `services/` directory.

---

## 🤝 Contributing

We welcome contributions! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## 📄 License

This project is for educational/demo purposes. See the LICENSE file for details.

---

For more information, see the `docs/` folder and in-code comments. If you have questions or need support, feel free to open an issue.
