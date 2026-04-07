# SWE Best Practices & Agent Rules

## 1. Commit Frequent & Small
- **Commit frequently**: Make a Git commit for every single related group of changes or complete logical step.
- **Avoid large commits**: Never bundle unrelated changes into a monolithic commit. 
- **Commit message format**: Use standard conventional commits (e.g., `feat:`, `fix:`, `refactor:`, `chore:`).

## 2. Next.js & Middleware Best Practices
- Keep components small, reusable, and focused on a single responsibility.
- Place reusable business logic in lib or server actions.
- Middleware should be lightweight and fast, placed in `middleware.ts` at the root/app level. It should handle route protection efficiently before reaching the page components.

## 3. Database (MongoDB) Best Practices
- Use proper indexing for queried fields.
- Establish database connections efficiently using the singleton pattern for creating the DB client instance.
- Use connection pooling for fast performance and to avoid multiple connections across hot reloads.
- Use Mongoose or native MongoDB driver based on project standard, maintaining clear schemas or models.

## 4. Code Quality & Formatting
- Adhere to strict TypeScript typing. Do not use `any`.
- Keep code clean, easily readable, and properly commented where complex logic resides.
- Write tests or structure code testably for business logic.

## 5. Security Context
- Never expose environment variables (`.env`) or secrets in client-side code unless explicitly prefixed with `NEXT_PUBLIC_`.
- Input validation on both client and server sides is mandatory (e.g., using Zod for form, API, and DB schema validation).
