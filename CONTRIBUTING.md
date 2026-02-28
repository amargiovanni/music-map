# Contributing to Music Map

Thank you for your interest in contributing to Music Map! Every contribution helps make the musical atlas of the world a little richer.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/music-map.git
   cd music-map
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Initialize the local database:**
   ```bash
   npm run db:init
   ```
5. **Start the dev server:**
   ```bash
   npm run dev
   ```
6. Open **http://localhost:4321** and verify everything works.

## Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes. Follow the conventions described below.
3. Test your changes locally -- make sure the dev server starts, the build succeeds, and nothing is broken.
4. Commit your changes with a clear message:
   ```bash
   git commit -m "feat: add genre filter to map view"
   ```
5. Push your branch and open a pull request against `main`.

## Commit Message Format

We use a simple conventional format:

- `feat:` -- a new feature
- `fix:` -- a bug fix
- `refactor:` -- code change that neither fixes a bug nor adds a feature
- `style:` -- formatting, missing semicolons, etc. (not CSS changes)
- `docs:` -- documentation changes
- `chore:` -- build scripts, dependencies, CI config

Examples:
```
feat: add playlist mode for city pins
fix: prevent duplicate pins at the same coordinates
refactor: extract map clustering logic into a custom hook
docs: update API reference with new endpoints
```

## Code Conventions

### TypeScript
- Strict mode is enabled. Do not use `any` unless absolutely necessary.
- Prefer `interface` over `type` for object shapes.
- Export types from `src/types/index.ts` when they are shared across files.

### React Components
- Functional components only, with named exports.
- Keep components focused on a single responsibility.
- Use hooks for state and side effects. No class components.
- Props interfaces should be defined right above the component.

### Styling
- Use Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary.
- Use `dark:` variants for dark mode support on every visible element.
- Mobile-first: base styles are for mobile, `md:` breakpoint for desktop.
- Use the `glass` or `glass-strong` CSS classes for glassmorphism panels.
- Minimum touch target size: 44px on mobile.

### Internationalization
- All user-facing text must use the `t()` function from `src/i18n/translations.ts`.
- Add new translation keys to both `it` and `en` objects.
- Memory text and display names stay in whatever language the user writes.

### API Routes
- All routes must have `export const prerender = false;`.
- Access Cloudflare bindings via `context.locals.runtime.env`.
- Always return JSON with `Content-Type: application/json` and `Access-Control-Allow-Origin: *`.
- Use D1 prepared statements with parameter bindings. Never interpolate user input into SQL.
- Wrap all handlers in try/catch with friendly error messages.

## Project Architecture

Understanding the architecture will help you contribute effectively:

- **`MusicMapApp.tsx`** is the brain. It owns all application state and composes every other component. If you need to add a new feature that spans multiple components, the wiring goes here.
- **`MapView.tsx`** handles everything inside the `<Map>` context (markers, layers, interactions). Any component using react-map-gl's `<Marker>` must be rendered inside MapView, not outside it.
- **API routes** in `src/pages/api/` are Astro server endpoints that run as Cloudflare Workers. They have access to D1, KV, and R2 bindings.
- **`src/lib/`** contains pure utility functions. Keep them framework-agnostic where possible.

## What to Work On

Check the [Issues](https://github.com/amargiovanni/music-map/issues) tab for open issues and feature requests. Issues labeled `good first issue` are a great starting point.

Some areas where help is especially welcome:
- **Accessibility** -- screen reader support, keyboard navigation, ARIA labels
- **Performance** -- lazy loading, bundle size optimization
- **New features** -- see the Roadmap in the README
- **Bug fixes** -- if you find something broken, please report and/or fix it
- **Translations** -- improving Italian/English strings or adding new languages

## Pull Request Guidelines

- Keep PRs focused. One feature or fix per PR.
- Include a clear description of what changed and why.
- If your PR adds a visual change, include a screenshot or screen recording.
- Make sure `npm run build` succeeds before submitting.
- Be kind in code reviews. We are all here to build something beautiful.

## Reporting Bugs

Open an issue with:
- A clear title describing the problem
- Steps to reproduce
- Expected vs. actual behavior
- Browser/device info if relevant
- Screenshots if applicable

## Code of Conduct

Be respectful, be inclusive, be kind. This project is about connecting people through music and places -- let's keep that spirit in how we work together.

---

Thank you for helping build the musical atlas of the world.
