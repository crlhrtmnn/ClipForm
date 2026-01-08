# Markdown Text Converter

A SvelteKit app for quickly transforming text using customizable templates. One-click clipboard-to-clipboard conversion.

## Project Overview

**Stack:** SvelteKit + Svelte 5 (runes) + Tailwind CSS v4 + Bun + adapter-static

**Core Purpose:** Users copy text → click a template → text is transformed and copied back to clipboard instantly.

## Architecture

### Main Page (`src/routes/+page.svelte`)
- **Dashboard layout** with template cards as primary UI
- **"Repeat Last" bar** for batch processing (1-click repeat)
- **Keyboard shortcuts:** `Cmd+K` (search), `Cmd+Enter` (repeat), `Escape` (close)
- **Hidden result area** that appears only after transformation

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `TemplateCard` | `src/lib/components/ui/TemplateCard.svelte` | Clickable card that reads clipboard, transforms, copies result |
| `CommandPalette` | `src/lib/components/ui/CommandPalette.svelte` | `Cmd+K` searchable template browser with keyboard navigation |
| `ResultArea` | `src/lib/components/ui/ResultArea.svelte` | Collapsible before/after comparison view |
| `Popover` | `src/lib/components/ui/Popover.svelte` | Fixed-position hover preview (escapes overflow contexts) |
| `TransformationBuilder` | `src/lib/components/templates/TransformationBuilder.svelte` | UI for building template transformation chains |

### Stores (`src/lib/stores/`)
- `templateStore` - Template CRUD, starring, usage tracking
- `starredTemplates` - Derived store of starred templates sorted by usage
- `recentTemplates` - Last 10 used templates
- `clipboardStore` - Clipboard capabilities and permissions
- `uiStore` - Toasts, modals, loading states

### Services (`src/lib/services/`)
- `transformEngine.ts` - 14 transformation types (wrap_code_block, add_prefix, regex_replace, etc.)
- `clipboardService.ts` - Read/write clipboard with fallbacks
- `localStorage.ts` - Template persistence
- `diffGenerator.ts` - Before/after diff visualization

### Data Flow
1. User clicks template card → `TemplateCard.handleClick()`
2. Reads clipboard via `readClipboard()`
3. Applies transformations via `applyTransformations()`
4. Copies result via `copyWithFallback()`
5. Updates usage stats, shows result area

## Development

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
