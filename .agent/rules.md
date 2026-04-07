# SWE Best Practices & Agent Rules

## 1. Commit Frequent & Small
- **Commit frequently**: Make a Git commit for every single related group of changes or complete logical step.
- **Avoid large commits**: Never bundle unrelated changes into a monolithic commit. 
- **Commit message format**: Use standard conventional commits (e.g., `feat:`, `fix:`, `refactor:`, `chore:`).

## 2. Next.js & Folder Structure
- Use the standard Next.js App Router folder structure (e.g., `app/`, `lib/`, `components/`, etc.). No need for complicated DDD or feature-based structures.
- Keep components small, reusable, and focused on a single responsibility.
- Middleware should be lightweight and fast, placed in `middleware.ts` at the root level.

## 3. Database (MongoDB) Best Practices
- Use proper indexing for queried fields.
- Establish database connections efficiently using the singleton pattern for creating the DB client instance.
- Use connection pooling for fast performance and to avoid multiple connections across hot reloads.
- Use Mongoose or native MongoDB driver based on project standard, maintaining clear schemas or models.

## 4. TypeScript
- Strict mode; avoid `any` (use `unknown` + type guards).
- Use `import type` for type-only imports.
- Provide explicit return types for exported functions.

## 5. Code Quality
- **DRY**: Extract repeated logic into reusable functions/components/utilities.
- **SOLID**: Single responsibility, depend on abstractions, focused interfaces.
- **Clean Code**: Self-documenting names, small focused functions, max 2-3 nesting levels, early returns, pure functions when possible.
- **No magic numbers**: Use named constants (e.g., `const MAX_RETRIES = 3`).
- **No inline comments** unless JSDoc, complex business logic, or non-obvious workarounds.
  - ❌ **NEVER** add comments that merely restate what the code does (e.g., `// Loop through users`, `// Set status to pending`).
  - ❌ **NEVER** add comments explaining obvious variable assignments or simple operations.
  - ❌ **NEVER** add comments for standard patterns (e.g., `// Try-catch block`, `// Return result`).
  - ❌ **NEVER** add section divider comments unless code is genuinely complex enough to require visual separation.
  - ✅ **DO** write self-documenting code with clear variable/function names instead of comments.
  - ✅ **DO** add JSDoc for all exported functions with `@param`, `@returns`, `@throws`.
  - ✅ **DO** add inline comments only for non-obvious business rules, edge cases, or workarounds.
  - ✅ **DO** add comments explaining *why* (intent), never *what* (implementation).

## 6. Security & Validation Context
- Validate all inputs with Zod schemas; never trust client-side validation. Perform intensive input validation.
- Never log sensitive data (passwords, tokens, PII).
- Never expose environment variables (`.env`) or secrets in client-side code unless explicitly prefixed with `NEXT_PUBLIC_`.
- Use environment variables for secrets.
