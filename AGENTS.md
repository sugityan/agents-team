<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` - Start dev server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - ESLint check

## Stack

- Next.js 16.2.6 (App Router)
- React 19.2.4
- Tailwind CSS v4 (no config file needed - uses CSS-first config)
- TypeScript (strict mode, bundler module resolution)

## Structure

- `app/` - App Router pages and layouts
- Entry point: `app/page.tsx`
- No `pages/` directory (App Router only)

## Notes

- Tailwind v4 uses CSS-first configuration in `app/globals.css` instead of `tailwind.config.ts`
- ESLint config is flat config format (ESLint 9)
- No pre-commit hooks configured

## Agent Role Rules (MANDATORY)

Each agent has a strictly defined role. **Never cross role boundaries.**