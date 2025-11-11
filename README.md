***NOTE:*** *This extension is just a utility I've created for myself to help enable my own workflow. Expect version number mismatches, bugs, force pushing, etc.*

# VSCode Talon Helpers

Helper commands for Talon Voice integration with VSCode.

This extension is functional, but note that I heavily developed it with LLMs.

## Commands

This extension provides the following commands for use with Talon Voice via the command-server extension:

### `jcaw.getFilePath`

Returns the full path of the currently active file.

**Returns:** `string`

### `jcaw.getCursorPosition`

Returns information about the current cursor position.

**Returns:**
```typescript
{
  line: number,              // 0-based line number
  column: number,            // 0-based column position in line
  offset: number            // Absolute byte offset in document
}
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
}
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
}
```

### `jcaw.getTextBetweenOffsets`

Returns the text between two byte offsets in the document.

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
}
```

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
}
```

### `jcaw.getDictationContext`

Returns text before and after the cursor/selection for context-sensitive dictation. Used by voice commands that need surrounding context to make intelligent decisions.

**Arguments:**
- `maxChars` (optional): Maximum number of characters to retrieve before and after the cursor. Defaults to 500.

**Returns:**
```typescript
{
  before: string,  // Text before the selection/cursor
  after: string    // Text after the selection/cursor
}
```

### `jcaw.getVisibleRange`

Returns the currently visible range in the editor viewport.

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
}
```

### `jcaw.getCurrentWord`

Returns the word at the cursor position (or specified position) with its boundaries.

**Arguments:**
- `position` (optional): Position object with `{line: number, column: number}`. Defaults to cursor position.

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
}
```

**Note:** Returns empty string and cursor position if no word is found at the position.

### `jcaw.getSymbolAtPosition`

Returns information about the symbol (function, class, variable, etc.) at the cursor position. Useful for context-aware voice commands.

**Arguments:**
- `position` (optional): Position object with `{line: number, column: number}`. Defaults to cursor position.

**Returns:**
```typescript
{
  name: string,              // Symbol name
  kind: string,              // "Function", "Class", "Variable", "Method", etc.
  range: {                   // Full range of the symbol
    start: {line, column, offset},
    end: {line, column, offset}
  },
  selectionRange: {          // Range of just the symbol name
    start: {line, column, offset},
    end: {line, column, offset}
  }
} | null
```

**Note:** Returns `null` if no symbol is found at the position or if language server doesn't provide symbol information.

### `jcaw.getIndentationLevel`

Returns indentation information for a line.

**Arguments:**
- `lineNumber` (optional): 0-based line number. Defaults to current cursor line.

**Returns:**
```typescript
{
  level: number,       // Indentation level (number of indent units)
  spaces: number,      // Total effective spaces
  tabs: number,        // Number of tab characters
  usesTabs: boolean    // Whether editor is configured to use tabs
}
```

### `jcaw.getLineCount`

Returns the total number of lines in the document.

**Returns:** `number`

### `jcaw.getLanguageId`

Returns the language mode/ID of the current file (e.g., "python", "typescript", "javascript").

**Returns:** `string`

### `jcaw.getVisibleLineNumbers`

Returns the range of visible line numbers in the editor viewport.

**Returns:**
```typescript
{
  first: number,  // First visible line (0-based)
  last: number    // Last visible line (0-based)
}
```

### `jcaw.getProjectRoot`

Returns the workspace root path for the current file's project.

**Returns:** `string | null`

**Note:** Returns `null` if the file is not part of a workspace.

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
context = actions.user.run_rpc_command_get("jcaw.getDictationContext")  # Default 500 chars
context_large = actions.user.run_rpc_command_get("jcaw.getDictationContext", 1000)  # Custom size

visible = actions.user.run_rpc_command_get("jcaw.getVisibleRange")
word = actions.user.run_rpc_command_get("jcaw.getCurrentWord")
word_at_pos = actions.user.run_rpc_command_get("jcaw.getCurrentWord", {"line": 10, "column": 5})
symbol = actions.user.run_rpc_command_get("jcaw.getSymbolAtPosition")  # Returns None if no symbol
indent = actions.user.run_rpc_command_get("jcaw.getIndentationLevel")
indent_line = actions.user.run_rpc_command_get("jcaw.getIndentationLevel", 15)
line_count = actions.user.run_rpc_command_get("jcaw.getLineCount")
language = actions.user.run_rpc_command_get("jcaw.getLanguageId")
visible_lines = actions.user.run_rpc_command_get("jcaw.getVisibleLineNumbers")
project_root = actions.user.run_rpc_command_get("jcaw.getProjectRoot")  # Returns None if no workspace
```

**Note:** You may want to create wrapper actions for cleaner error handling and to provide better error messages when VSCode isn't active or the command-server isn't running. The `community` repo already has the VSCode RPC implemented - so you could just wire in these commands.
