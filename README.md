***NOTE:*** *This extension is just a utility I've created for myself to help enable my own workflow. Expect version number mismatches, bugs, force pushing, etc.*

# VSCode Talon Helpers

Helper commands for Talon Voice integration with VSCode.

This extension is functional, but note that I heavily developed it with LLMs.

## Commands

This extension provides the following commands for use with Talon Voice via the command-server extension:

### `jcaw.getFilePath`

Returns the full path of the currently active file. Returns null if no file is active.

**Returns:** `string | null`

### `jcaw.getCursorPosition`

Returns information about the current cursor position.

**Returns:**
```typescript
{
  line: number,              // 0-based line number
  column: number,            // 0-based column position in line
  offset: number            // Absolute byte offset in document
} | null
```

### `jcaw.getTextOnLine`

Returns the text on the specified line (or current line if no argument provided).

**Arguments:**
- `lineNumber` (optional): 0-based line number. Defaults to current cursor line.

**Returns:**
```typescript
{
  text: string,
  start: {
    line: number,
    column: number,
    offset: number
  },
  end: {
    line: number,
    column: number,
    offset: number
  }
} | null
```

### `jcaw.getSelectedText`

Returns the currently selected text along with selection information. Note that `end` is always the cursor position, which may come before `start` if selecting backwards.

**Returns:**
```typescript
{
  text: string,
  start: {              // Selection anchor (where selection began)
    line: number,
    column: number,
    offset: number
  },
  end: {                // Cursor position (may be before start)
    line: number,
    column: number,
    offset: number
  },
  isEmpty: boolean
} | null
```

### `jcaw.getTextBetweenOffsets`

Returns the text between two byte offsets in the document. Throws an error if offsets are out of bounds.

**Arguments:**
- `startOffset` (required): Starting byte offset (0-based, inclusive)
- `endOffset` (required): Ending byte offset (0-based, exclusive)

**Returns:**
```typescript
{
  text: string,
  start: {
    line: number,
    column: number,
    offset: number
  },
  end: {
    line: number,
    column: number,
    offset: number
  }
} | null
```

**Errors:**
- Throws if either offset is negative or exceeds document length
- Throws if startOffset > endOffset

### `jcaw.getDocumentBounds`

Returns the start and end positions of the entire document.

**Returns:**
```typescript
{
  start: {
    line: number,
    column: number,
    offset: number
  },
  end: {
    line: number,
    column: number,
    offset: number
  }
} | null
```

## Installation

To use this extension, you'll need to install Cursorless' [command-server](https://marketplace.visualstudio.com/items?itemName=pokey.command-server) in VSCode and use the [talon-command-client](https://github.com/cursorless-dev/talon-command-client) to communicate with it from Talon. You don't need Cursorless itself - just the commend server.

### Prerequisites

#### VSCode `command-server`

This extension requires the [command-server](https://marketplace.visualstudio.com/items?itemName=pokey.command-server) extension to communicate with Talon. Install it from the VSCode marketplace:

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "command-server" (by pokey)
4. Click Install

Alternatively, install via command line:
```bash
code --install-extension pokey.command-server
```

#### Talon Client

To use this extension from Talon, you need the [talon-command-client](https://github.com/cursorless-dev/talon-command-client) plugin:

1. Clone or download the plugin to your Talon user directory (easiest to add it as a submodule):
   ```bash
   cd ~/.talon/user/plugins  # or your Talon user directory
   git clone https://github.com/cursorless-dev/talon-command-client.git
   ```
2. Restart Talon

This plugin provides the `run_rpc_command_get` action used to communicate with VSCode via the command-server.

### Installing This Extension

1. Install dependencies: `npm install`
2. Compile: `npm run compile`
3. Package: `vsce package` (requires `npm install -g @vscode/vsce`)
4. Install in VSCode: Extensions → Install from VSIX

## Development

- Compile: `npm run compile`
- Watch mode: `npm run watch`

## Usage with Talon

These commands are called from Talon using the `run_rpc_command_get` action provided by talon-command-client while VSCode is focussed:

```python
# Example in Talon
filepath = actions.user.run_rpc_command_get("jcaw.getFilePath")
cursor_pos = actions.user.run_rpc_command_get("jcaw.getCursorPosition")
line_text = actions.user.run_rpc_command_get("jcaw.getTextOnLine", 10)
selected = actions.user.run_rpc_command_get("jcaw.getSelectedText")
text_range = actions.user.run_rpc_command_get("jcaw.getTextBetweenOffsets", 0, 100)
bounds = actions.user.run_rpc_command_get("jcaw.getDocumentBounds")
```

**Note:** You may want to create wrapper actions for cleaner error handling and to provide better error messages when VSCode isn't active or the command-server isn't running. The `community` repo already has the VSCode RPC implemented - so you could just wire in these commands.
