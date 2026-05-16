tmux send-keys -t dev:0.0 '
You are the architect on this project. Your job is DESIGN ONLY — do not write any implementation code.

We are building a TODO app on a Next.js app created with `npx create-next-app@latest` (App Router, TypeScript, Tailwind CSS).

Please design the following features and output the result to `docs/architecture.md`:

1. **Navigation Bar**
   - Displayed on all pages
   - Contains the app title "TODO App" and a link to the home page

2. **TODO App** (on the home page `/`)
   - Add a new TODO item (text input + submit button)
   - Delete a TODO item
   - Toggle a TODO item between complete / incomplete
   - Filter TODOs by status: All / Active / Completed
   - Persist TODO data using localStorage so it survives page reloads

Constraints (for the implementer to follow — document these in architecture.md):
- TypeScript
- Tailwind CSS for styling
- App Router structure only (no Pages Router)
- No additional libraries

Once `docs/architecture.md` is complete, notify the implementer using:
```bash
tmux send-keys -t dev:0.1 '\''The design document at docs/architecture.md is complete. Please start the implementation based on this design.'\'' Enter
```
Do NOT implement anything yourself. Stop after sending the notification.' Enter