# NutriGuide

NutriGuide is a full-stack nutrition analysis web app built with Next.js.  
It allows users to input a list of ingredients and quantities and instantly receive a complete nutritional breakdown including:

- Calories
- Protein
- Carbohydrates
- Fat
- Fiber

The goal of this project is to help users understand their food in a simple and interactive way.

---

## Features

- Add ingredients and quantities
- Instant nutrition analysis
- Clean and responsive UI
- User authentication
- Save meal history
- Dashboard with statistics
- Nutrition goals tracking

---

## Pages

### 1. Home
Landing page that introduces the app and its purpose.

### 2. Login / Signup
User authentication to save and access personal data.

### 3. Dashboard
Displays:
- Daily summary
- Recent meals
- Nutrition charts

### 4. Ingredient Input
Main feature where users enter ingredients and quantities.

### 5. Results
Shows full nutritional breakdown:
- Calories
- Protein
- Carbs
- Fat
- Fiber

### 6. History
Displays previously saved meals and analyses.

### 7. Goals
Allows users to set:
- Daily calorie goals
- Macro targets

### 8. Profile
User personal data:
- Weight
- Height
- Age

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- App Router
- Node.js
- Database: PostgreSQL / MongoDB
- ORM: Prisma
- Authentication: NextAuth.js or Clerk

---

## Project Structure

```bash
nutriguide/
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   ├── input/
│   ├── results/
│   ├── history/
│   ├── goals/
│   ├── profile/
├── components/
├── lib/
├── public/
├── styles/
├── prisma/
├── package.json
└── README.md
```
