# ClipForm

A SvelteKit app for quickly transforming text using customizable templates. One-click clipboard-to-clipboard conversion.

## Stack

- **SvelteKit 2.x** with **Svelte 5** (runes syntax: `$state`, `$derived`, `$effect`)
- **Tailwind CSS v4** with dark mode
- **Vite** for dev/build
- **adapter-static** (generates static HTML, no server)
- **Bun** as package manager and runtime

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte           # Main dashboard with starred template cards
│   ├── +layout.svelte         # Header, nav, theme toggle
│   └── templates/
│       ├── +page.svelte       # Template gallery
│       ├── new/+page.svelte   # Create template
│       └── [id]/+page.svelte  # Edit template
├── lib/
│   ├── components/
│   │   ├── ui/                # TemplateCard, CommandPalette, ResultArea, Popover, Toast
│   │   └── templates/         # TransformationBuilder
│   ├── stores/                # templateStore, clipboardStore, uiStore, themeStore
│   ├── services/              # transformEngine, clipboardService, localStorage, diffGenerator
│   └── types/                 # TypeScript interfaces
```

## Key Files

| File | Purpose |
|------|---------|
| `src/routes/+page.svelte` | Main dashboard - starred templates grid, repeat bar, keyboard shortcuts |
| `src/lib/components/ui/TemplateCard.svelte` | Clickable card that reads clipboard → transforms → copies result |
| `src/lib/components/ui/CommandPalette.svelte` | `Cmd+K` searchable template browser |
| `src/lib/services/transformEngine.ts` | 14 transformation types (wrap_code_block, add_prefix, regex_replace, etc.) |
| `src/lib/services/clipboardService.ts` | Read/write clipboard with Firefox workaround |
| `src/lib/stores/templateStore.ts` | Template CRUD, starring, usage tracking, persistence |
| `src/lib/services/localStorage.ts` | Persistence layer + 17 default templates |

## Data Flow

1. User clicks `TemplateCard` → `handleClick()`
2. Reads clipboard via `readClipboard()` (Firefox shows paste modal)
3. Applies transformation chain via `applyTransformations()`
4. Copies result via `copyWithFallback()`
5. Updates usage stats in `templateStore`
6. Shows before/after in `ResultArea`

## Transformation Types

`remove_blank_lines`, `trim_lines`, `to_uppercase`, `to_lowercase`, `remove_duplicates`, `sort_lines`, `reverse_lines`, `wrap_code_block`, `add_prefix`, `add_suffix`, `regex_replace`, `number_lines`, `indent`, `dedent`

## Development Commands

```bash
bun install      # Install dependencies
bun dev          # Start dev server (localhost:5173)
bun build        # Build static site to /build
bun preview      # Preview production build
bun check        # Run svelte-check for TypeScript errors
```

## Conventions

- Use Bun instead of npm/node: `bun install`, `bun run`, `bun test`
- Use Svelte 5 runes: `$state()`, `$derived()`, `$effect()` (not stores for component state)
- Stores are in `src/lib/stores/` using Svelte's `writable`/`derived`
- Services are pure functions in `src/lib/services/`
- Types are in `src/lib/types/`

## Testing

```bash
bun test         # Run tests
```

Tests use `bun:test`:
```ts
import { test, expect } from "bun:test";

test("example", () => {
  expect(1).toBe(1);
});
```
