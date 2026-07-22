# Pro Straps 🎀

A premium watch strap ecommerce platform built on the Internet Computer blockchain, featuring an immersive multi-theme design system and advanced product customization.

## 🌟 Features

- **Multi-Theme System**: Light, Dark, Night, and Synthwave themes with live switching and localStorage persistence
- **Product Catalog**: Browse and filter premium watch straps with detailed product information
- **Product Customization**: AR-powered try-on experience and strap customization interface
- **Shopping Cart & Checkout**: Secure cart management and streamlined checkout process
- **User Accounts**: Registration, authentication, and order history tracking
- **Order Management**: Track orders, view status, and manage order details
- **Reviews & Ratings**: Community-driven product reviews with 5-star ratings
- **Admin Dashboard**: Analytics, inventory management, and order administration
- **Wishlist**: Save favorite products for later
- **Notifications**: Real-time notifications for order updates and personalized offers
- **Skeleton Loading States**: Premium loading experience with skeleton screens
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: HugeIcons & Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Routing**: React Router

### Backend
- **Smart Contracts**: Motoko (Internet Computer)
- **Canister Framework**: Caffeine
- **Data Management**: Motoko collections (HashMap, Buffer, Trie)
- **Package Manager**: Mops

### Monorepo
- **Workspace Manager**: pnpm workspaces
- **Build System**: Caffeine CLI

## 📁 Project Structure

```
pro-straps/
├── src/
│   ├── backend/           # Motoko smart contracts
│   │   ├── lib/          # Core business logic modules
│   │   │   ├── cart.mo
│   │   │   ├── catalog.mo
│   │   │   ├── customizations.mo
│   │   │   ├── notifications.mo
│   │   │   ├── orders.mo
│   │   │   ├── reviews.mo
│   │   │   ├── users.mo
│   │   │   ├── wishlist.mo
│   │   │   └── seed.mo
│   │   ├── mixins/       # API endpoints
│   │   ├── types/        # Type definitions
│   │   └── main.mo       # Main canister
│   └── frontend/          # React + TypeScript application
│       ├── src/
│       │   ├── components/   # Reusable UI components
│       │   ├── pages/        # Page components
│       │   ├── hooks/        # Custom React hooks
│       │   ├── store/        # Zustand state stores
│       │   ├── lib/          # Utilities
│       │   └── types/        # TypeScript types
│       └── public/           # Static assets
├── DESIGN.md              # Design system documentation
├── AGENTS.md              # Development workflow guide
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 16.0.0 or higher
- **pnpm**: 7.0.0 or higher (required, npm not supported)
- **Motoko compiler** & **IC SDK**: For backend development

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pro-straps
   ```

2. **Install dependencies**
   ```bash
   # Install root and all workspace dependencies
   pnpm install --prefer-offline
   ```

3. **Install backend dependencies**
   ```bash
   cd src/backend
   mops install
   ```

4. **Generate bindings** (required for frontend-backend communication)
   ```bash
   cd ../../
   pnpm bindgen
   ```

## 💻 Development Workflow

### Frontend Development

```bash
cd src/frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Linting and fixing
pnpm fix

# Build for production
pnpm build
```

The frontend will be available at `http://localhost:5173`

### Backend Development

```bash
cd src/backend

# Install Mops dependencies
mops install

# Type checking and fixing
mops check --fix

# Build the canister
mops build

# Deploy locally (requires IC SDK)
dfx start --background
dfx deploy
```

### Integration

After making changes to backend:
```bash
# Generate TypeScript bindings from Motoko candid interface
pnpm bindgen
```

This creates type-safe bindings for frontend-backend communication.

## 🎨 Design System

Pro Straps implements a sophisticated multi-theme design system:

| Theme | Primary | Background | Aesthetic |
|---|---|---|---|
| **Light** | `#9AFF3D` Lime | `#FFFFFF` White | Clean, minimalist |
| **Dark** | `#9AFF3D` Lime | `#0C0C2B` Deep Blue | Professional |
| **Night** | `#82FF5C` Bright Lime | `#0F0F23` Near Black | Sophisticated |
| **Synthwave** | `#FF6AC1` Magenta | `#0A0A0F` Very Dark | Retro-futuristic |

**Features**:
- Consistent 10px border radius across components
- 8px spacing base unit
- Smooth 0.3s transitions on interactive elements
- Pulse animation for skeleton loading states
- Responsive grid layouts (3-column on desktop)

See [DESIGN.md](./DESIGN.md) for complete design specifications.

## 🔧 Common Tasks

### Type Checking Across the Project
```bash
pnpm typecheck
```

### Linting and Auto-fixing
```bash
pnpm fix
```

### Building the Entire Project
```bash
pnpm build
```

### Updating Backend Bindings
After modifying backend Motoko files:
```bash
pnpm bindgen
```

## 📦 Key Modules

### Backend Modules (Motoko)

- **Catalog**: Product management, search, and filtering
- **Cart**: Shopping cart operations (add, remove, update)
- **Orders**: Order creation, status tracking, and history
- **Users**: User authentication and profile management
- **Reviews**: Product reviews and ratings
- **Wishlist**: User wishlist management
- **Customizations**: Product customization options
- **Notifications**: Order and promotional notifications

### Frontend Stores (Zustand)

- **cartStore**: Shopping cart state
- **notificationStore**: Notifications and alerts
- **themeStore**: Theme preference management

## 🔐 Deployment

The application is deployed on the Internet Computer blockchain:

- **Frontend**: Canister-hosted static assets
- **Backend**: Motoko smart contracts running on IC

For deployment instructions, see your IC SDK documentation and the AGENTS.md file.

## 📝 Development Notes

- Always run `pnpm bindgen` after backend changes
- Frontend type safety requires bindings to be generated
- Use `pnpm install --prefer-offline` to leverage local cache
- The project uses editorial minimalism with skeleton loading states for UX

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting: `pnpm typecheck && pnpm fix`
4. Commit with clear messages
5. Push and create a pull request

## 📄 License

[Add your license here]

---

**Built with ❤️ for premium watch strap enthusiasts**
