# Console Highlighter

[![Version](https://img.shields.io/visual-studio-marketplace/v/sheik-mostafizur.console-highlighter)](https://marketplace.visualstudio.com/items?itemName=sheik-mostafizur.console-highlighter)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/sheik-mostafizur.console-highlighter)](https://marketplace.visualstudio.com/items?itemName=sheik-mostafizur.console-highlighter)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/sheik-mostafizur.console-highlighter)](https://marketplace.visualstudio.com/items?itemName=sheik-mostafizur.console-highlighter)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sheik-mostafizur/console-highlighter/blob/main/LICENSE)

A VS Code extension that highlights console statements with different colors for better visibility during debugging.

## Features

- 🎨 **Different colors** for each console method (log, info, warn, error, debug)
- 📁 **Supports multiple file types**: JavaScript (.js, .mjs, .cjs), TypeScript (.ts), React (.jsx, .tsx)
- ⚙️ **Fully customizable** colors through VS Code settings
- 🚀 **Real-time highlighting** as you type
- 💡 **Lightweight** with zero dependencies

## Supported Console Methods

| Method          | Default Color                     |
| --------------- | --------------------------------- |
| `console.log`   | neon green (rgba(0, 255, 106, 1)) |
| `console.info`  | Sky Blue (rgba(56, 189, 248, 1))  |
| `console.warn`  | Amber (rgba(251, 191, 36, 1))     |
| `console.error` | Red (rgba(248, 113, 113, 1))      |
| `console.debug` | Violet (rgba(167, 139, 250, 1))   |
| `console.dir`   | Slate (rgba(148, 163, 184, 1))    |

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
3. Search for "Console Highlighter"
4. Click **Install**

### From VS Code Quick Open

1. Press `Ctrl+P` (or `Cmd+P` on Mac)
2. Type `ext install sheik-mostafizur.console-highlighter`
3. Press Enter

### Manual Installation

Download the `.vsix` file from [GitHub Releases](https://github.com/sheik-mostafizur/console-highlighter/releases) and run:

```bash
code --install-console-highlighter-0.0.2.vsix
```
