# 📋✨ ClipForm

A fast, one-click text transformation tool. Transform your clipboard content instantly without copy-pasting into text editors.

**[Try it live →](https://converter.com)**

## How It Works

1. Copy text to your clipboard
2. Click a template
3. Done — transformed text is back in your clipboard

No forms, no buttons, no manual pasting. Just one click.

## Features

- **One-Click Transforms** — Click a template to instantly transform clipboard content
- **Custom Templates** — Create reusable transformation pipelines
- **Chain Operations** — Combine multiple transformations in sequence
- **Command Palette** — Quick access with `Cmd/Ctrl + K`
- **Works Offline** — All processing happens in your browser
- **No Data Collection** — Your clipboard never leaves your device

## Available Transformations

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

## Browser Support

- **Chrome/Edge** — Full support (grants persistent clipboard permission)
- **Firefox** — Supported with paste dialog (browser security limitation)
- **Safari** — Full support

## License

MIT
