# 📋✨ ClipForm

A fast, one-click text transformation tool. Transform your clipboard content instantly without copy-pasting into chatty.

**[Try it live](https://clipform.c15n.dev/)**

## How It Works

1. Copy text to your clipboard
2. Click a template
3. Done [^1] — transformed text is back in your clipboard

No forms, no deleting, no 'Certainly!'. Just one click.

## Features

- **One-Click Transforms** — Click a template to instantly transform clipboard content
- **Custom Templates** — Create reusable transformation pipelines
- **Chain Operations** — Combine multiple transformations in sequence
- **Command Palette** — Quick access with `Cmd/Ctrl + K`
- **Works Offline** — All processing happens in your browser
- **No Data Collection** — Your clipboard never leaves your device
- **Browser Support** — Probably works in all of them

## Why?

Because pasting into random text tools just to trim some whitespace is lame.

## Available Transformations to build Templates with

| Transform | Description |
|-----------|-------------|
| Trim Lines | Remove leading/trailing whitespace from each line |
| Remove Blank Lines | Delete empty lines |
| Remove Duplicates | Keep only unique lines |
| Sort Lines | Alphabetically sort lines |
| Reverse Lines | Reverse line order |
| Number Lines | Add line numbers |
| Uppercase / Lowercase | Change text case |
| Add Prefix / Suffix | Add text to start/end of each line |
| Indent / Dedent | Add or remove indentation |
| Wrap Code Block | Wrap in markdown code fences |
| Regex Replace | Find and replace with regular expressions |

If you need more just tell me so I can tell Claude.

## Self-Hosting

### With Docker

```bash
docker build -t clipform .
docker run -p 8080:80 clipform
```

### Local Development

```bash
bun install
bun run dev
```

Build for production:

```bash
bun run build
```

## Tech Stack

- [SvelteKit](https://svelte.dev/) — Framework
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Bun](https://bun.sh/) — Runtime & package manager

## License

MIT

## Confessions

[^1]: In Firefox there is one more step because of security stuff: `ctrl + v`. But it looks nice, i swear!

---

<p align="center">No 🧠 cells were harmed in the vibing of this project. Mostly because very few were involved.</p>
