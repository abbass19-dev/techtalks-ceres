<p align="center">
  <img src="public/images/logo.png" alt="CERES logo" width="150" />
</p>

<h1 align="center">CERES</h1>

<p align="center">
  <strong>Precision Nutrition Platform for Recipes, Goals, and Meal Planning</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-active-1F8A5B?style=for-the-badge" alt="Build status" />
  <img src="https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

CERES is a full-stack nutrition and meal-planning web application that helps users create recipes, analyze nutrition, save meals, set personal goals, and organize weekly eating plans through a clean, authenticated dashboard.

## 📑 Table of Contents

- 🔎 Overview
- 💡 Why CERES?
- 🖼️ App Preview
- ✨ Features
- 🛠️ Tech Stack
- 🚀 Getting Started
- 📁 Project Structure
- 🗄️ Database Schema
- 🔐 Authentication & Authorization
- 🎨 Styling Guidelines
- 📜 Available Scripts
- 🏗️ Development Guidelines
- 🆘 Support

## 🔎 Overview

<p align="center">
  <img src="public/images/readme-banner.png" alt="CERES application banner" width="100%" />
</p>

CERES helps users understand what they eat and plan healthier meals with more confidence. The platform enables:

- 🥗 Users to create recipes with ingredients, serving sizes, instructions, images, and complete nutrition data
- ⭐ Users to save favorite recipes and browse community recipes
- 🎯 Users to define calorie and macro goals based on their personal profile
- 🗓️ Users to plan meals across the week from their recipe collection
- 📊 The app to calculate totals for calories, protein, carbohydrates, fats, minerals, and vitamins

## 💡 Why CERES?

Healthy eating is easier when recipe data, nutrition goals, and meal planning live in one place. Many users track meals in one app, save recipes somewhere else, and plan the week manually.

CERES bridges that gap by:

- 🔗 **Connecting recipes and goals** - Every recipe can contribute to a clearer nutrition plan
- 📈 **Making nutrition visible** - Calories, macros, minerals, and vitamins are stored per recipe and per serving
- 🗓️ **Supporting consistency** - Weekly planning helps users prepare instead of improvising every day
- 🧾 **Centralizing meal history** - Saved and personal recipes stay attached to the user's account
- ✨ **Providing a polished food experience** - Landing pages, recipe cards, dashboards, and app routes are built around a focused nutrition workflow

## 🖼️ App Preview

<p align="center">
  <img src="public/images/readme-hero.png" alt="CERES nutrition platform banner" width="100%" />
</p>


## ✨ Features

### 👤 For Users

- 🔐 Secure signup, signin, logout, and password reset
- 🧍 Personal profile fields for age, height, weight, gender, activity level, phone number, and profile image
- 🎯 Nutrition goal setup for daily calories, protein, carbs, and fat
- 📊 Dashboard experience for reviewing nutrition progress and recommendations
- 🧮 Calorie calculator for estimating nutrition needs
- ⚙️ Settings page for updating account information

### 🍽️ For Recipe Management

- 📝 Create recipes with name, description, category, servings, prep time, cook time, and image
- 👨‍🍳 Add structured instructions with step numbers, titles, and descriptions
- 🥦 Store ingredient-level nutrients, minerals, and vitamins
- 📊 Calculate total nutrition and nutrition per serving
- 🗂️ Save recipes as drafts or publish them
- 🌍 Mark recipes as public or private
- 🖼️ Upload recipe images through Cloudinary

### 🗓️ For Meal Planning

- 📅 Weekly planner with one schedule per user
- 🍱 Organize recipe IDs by day
- 🔁 Reuse personal, saved, and community recipes in planning workflows
- 🧩 Planner utility functions for schedule handling

### 🌍 For Community Discovery

- 🔎 Browse public community recipes
- 📖 View individual community recipe detail pages
- ⭐ Save recipes for later access
- 🗃️ Separate pages for personal recipes, saved recipes, and community recipes

### ⚙️ Platform Features

- 🗄️ MongoDB-backed data models with Mongoose
- 🔐 JWT-based protected routes and API access
- ✅ Zod request validation
- 📧 Gmail SMTP password reset emails
- 📱 PWA manifest and app icons
- ⚡ Vercel Analytics and Speed Insights integration

## 🛠️ Tech Stack

- ⚛️ **Framework**: Next.js 16 with App Router
- 🧠 **Language**: TypeScript
- ⚛️ **UI**: React 19
- 🎨 **Styling**: Tailwind CSS 4
- 🗄️ **Database**: MongoDB with Mongoose
- 🔐 **Authentication**: JWT with `jose`, password hashing with `bcryptjs`
- ✅ **Validation**: Zod
- 📧 **Email**: Nodemailer with Gmail SMTP
- 🖼️ **Images**: Cloudinary
- 🧲 **Drag and Drop**: dnd-kit
- 🧭 **Icons**: lucide-react
- ⚡ **Analytics**: Vercel Analytics and Speed Insights

## 🚀 Getting Started

### Prerequisites

- 🟢 Node.js LTS and npm
- 🗄️ MongoDB database, or Docker for the included local MongoDB service
- ☁️ Cloudinary account for image uploads
- 📧 Gmail account with an app password for reset password emails

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd techtalks-ceres
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://admin:your-password@localhost:27017/ceres_db?authSource=admin

# Authentication
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASSWORD=your-google-app-password

# Local Docker MongoDB
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=your-password
```

Start MongoDB with Docker:

```bash
docker compose up -d
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```text
techtalks-ceres/
|-- app/                         # Next.js App Router
|   |-- (main)/                  # Authenticated application pages
|   |-- api/                     # API route handlers
|   |-- components/              # Shared UI components
|   |-- signin/                  # Login page
|   |-- signup/                  # Registration page
|   |-- reset-password/          # Password reset page
|   |-- change-password/         # Password change page
|   |-- globals.css              # Global styles
|   |-- layout.tsx               # Root layout
|   `-- page.tsx                 # Public landing page
|-- hooks/                       # Shared React hooks
|-- lib/
|   |-- constants/               # Static app constants
|   |-- hooks/                   # Data-fetching hooks
|   |-- models/                  # Mongoose schemas and models
|   |-- repositories/            # Data access layer
|   |-- services/                # Business logic and integrations
|   |-- utils/                   # Nutrition, planner, and parser utilities
|   |-- validations/             # Zod validation schemas
|   |-- auth.ts                  # JWT verification helpers
|   `-- db.ts                    # MongoDB connection helper
|-- public/
|   |-- icons/                   # PWA icons
|   `-- images/                  # Brand, landing, recipe, and README images
|-- docker-compose.yml           # Local MongoDB service
|-- next.config.ts               # Next.js configuration
|-- proxy.ts                     # Protected route proxy logic
`-- package.json                 # Scripts and dependencies
```

## 🗄️ Database Schema

The application uses MongoDB with Mongoose. Key models include:

- 👤 **User**: User account data, password hash, profile details, activity level, image URL, and reset password token fields
- 🍽️ **Recipe**: Recipe metadata, visibility, status, ingredients, instructions, total nutrition, and nutrition per serving
- ⭐ **SavedRecipe**: Connects users to recipes they have saved
- 🗓️ **WeeklyPlanner**: Stores one weekly schedule per user with recipe IDs grouped by day
- 🎯 **UserGoal**: Stores daily calorie, protein, carbohydrate, and fat targets
- 🥦 **Ingredient**: Ingredient-related nutrition data used by recipe workflows
- 📝 **RecipeDraft**: Draft recipe data before publishing

## 🔐 Authentication & Authorization

- 🔒 Passwords are hashed with `bcryptjs`
- 🎫 JWTs are created and verified with `jose`
- 🛡️ Protected API routes verify the current user before reading or writing private data
- 🍪 Auth cookies are secured for production environments
- ⏳ Password reset links are generated with short-lived reset tokens
- 📧 Reset emails are sent through Nodemailer using Gmail SMTP

### Password Reset Flow

1. 📩 User requests a password reset from the reset password page
2. 🔑 The system generates a reset token and expiry time
3. 📧 CERES emails a reset link using `NEXT_PUBLIC_APP_URL`
4. ✅ User opens the link and creates a new password
5. 🧹 The token is cleared after a successful password update

## 🎨 Styling Guidelines

- 🎨 Use Tailwind CSS utility classes for layout, spacing, and visual design
- 🌿 Keep components consistent with the existing green nutrition-focused brand palette
- 🧱 Prefer reusable app components from `app/components/`
- 📱 Use responsive layouts for mobile, tablet, and desktop screens
- 🖼️ Use `next/image` for optimized local and remote images
- 🧭 Keep page-level UI focused on the core workflow instead of marketing-only layouts

## 📜 Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the app for production
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## 🏗️ Development Guidelines

- 🧭 Use API route handlers in `app/api/*/route.ts` for backend workflows
- 🧱 Keep database access in repositories and business logic in services
- ✅ Validate incoming request bodies with Zod schemas from `lib/validations/`
- 🗄️ Use Mongoose models from `lib/models/` instead of redefining schemas in routes
- 🛡️ Keep authenticated user checks close to protected route handlers
- ☁️ Store images through Cloudinary rather than keeping uploaded files in the repository
- 🚫 Avoid committing `.env.local`, build output, or local database files

## 🆘 Support

For issues and questions:

- 🐛 Report a bug by creating an issue
- 💡 Request a feature with a clear description and expected behavior
- 🔐 For security concerns, contact the project maintainer privately

Built with ❤️ to make recipe nutrition clearer, meal planning easier, and healthy eating more practical.
