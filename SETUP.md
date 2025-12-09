# TurfBook - Project Setup Guide

This document provides comprehensive instructions for setting up and running the TurfBook application locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Running the Application](#running-the-application)
5. [Project Structure](#project-structure)
6. [Available Scripts](#available-scripts)
7. [Demo Credentials](#demo-credentials)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Recommended Version | Download Link |
|----------|-----------------|---------------------|---------------|
| Node.js | 18.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| npm | 9.0.0 | 10.x | Comes with Node.js |
| Git | 2.30.0 | Latest | [git-scm.com](https://git-scm.com/) |

### Checking Installed Versions

Open your terminal and run:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Disk Space | 500 MB | 1 GB |
| OS | Windows 10, macOS 10.14, Ubuntu 18.04 | Latest versions |

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/turfbook.git

# Or clone via SSH
git clone git@github.com:your-username/turfbook.git

# Navigate to project directory
cd turfbook
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install all required packages including:
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI components
- React Router DOM
- React Query
- Lucide React icons
- And other dependencies...

### Step 3: Environment Setup (Optional)

For the current version with mock data, no environment variables are required.

If you plan to connect to a backend later, create a `.env` file:

```bash
# Create environment file
cp .env.example .env
```

---

## Running the Application

### Development Mode

```bash
# Start the development server
npm run dev
```

The application will be available at: **http://localhost:5173**

The development server features:
- Hot Module Replacement (HMR)
- Fast refresh
- Error overlay
- Source maps

### Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
turfbook/
├── public/                  # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable components
│   │   ├── landing/        # Landing page sections
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── turf/           # Turf-related components
│   │   └── ui/             # Shadcn UI components
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx # Authentication context
│   ├── data/               # Mock data
│   │   └── mockData.ts     # Sample data for development
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── customer/       # Customer portal pages
│   │   └── owner/          # Owner portal pages
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles & design system
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project readme
├── SETUP.md                # This file
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start development server with HMR |
| Build | `npm run build` | Create production build |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint for code quality |
| Type Check | `npm run typecheck` | Run TypeScript compiler check |

---

## Demo Credentials

The application includes mock authentication for testing:

### Customer Account
- **Email:** rahul@example.com
- **Password:** password123

### Turf Owner Account
- **Email:** owner@example.com
- **Password:** password123

> **Note:** These are mock credentials for development only. In production, implement proper authentication.

---

## Troubleshooting

### Common Issues

#### 1. Node Version Mismatch

**Error:** `The engine "node" is incompatible with this module`

**Solution:**
```bash
# Using nvm to switch Node version
nvm install 20
nvm use 20
```

#### 2. Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process using the port (Linux/Mac)
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3000
```

#### 3. Dependencies Not Installing

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Tailwind CSS Not Working

**Error:** Styles not applying

**Solution:**
1. Ensure `tailwind.config.ts` includes all content paths
2. Verify `@tailwind` directives are in `src/index.css`
3. Restart the development server

#### 5. TypeScript Errors

**Error:** Type errors during build

**Solution:**
```bash
# Check for type errors
npm run typecheck

# Fix any reported issues in the source files
```

---

## Development Tips

### VS Code Extensions

Recommended extensions for the best development experience:

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **TypeScript Vue Plugin (Volar)** - TypeScript support
5. **Auto Rename Tag** - HTML/JSX tag renaming

### Browser Extensions

1. **React Developer Tools** - React debugging
2. **Redux DevTools** - State management debugging (if using Redux)

---

## Next Steps

After setting up the project:

1. **Explore the codebase** - Start with `src/App.tsx` and `src/pages/Index.tsx`
2. **Try demo accounts** - Login with both customer and owner accounts
3. **Customize the design** - Modify `src/index.css` and `tailwind.config.ts`
4. **Add backend** - Connect to Supabase or your preferred backend
5. **Deploy** - Use Vercel, Netlify, or your preferred hosting

---

## Support

If you encounter any issues not covered in this guide:

1. Check the [README.md](./README.md) for additional information
2. Search for similar issues in the project repository
3. Create a new issue with detailed information about your problem

---

**Happy Coding! 🏟️⚽**
