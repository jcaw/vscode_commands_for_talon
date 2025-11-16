***NOTE:*** *This extension is just a utility I've created for myself to help enable my own workflow. Expect version number mismatches, bugs, force pushing, etc.*

# VSCode Talon Helpers

Helper commands for Talon Voice integration with VSCode.

This extension is functional, but note that I heavily developed it with LLMs.

## Commands

This extension provides the following commands for use with Talon Voice via the command-server extension. For detailed information about each command, see [AVAILABLE_COMMANDS.md](AVAILABLE_COMMANDS.md).

Available commands:

- `jcaw.getFilePath`
- `jcaw.getCursorPosition`
- `jcaw.getTextOnLine`
- `jcaw.getSelectedText`
- `jcaw.getTextBetweenOffsets`
- `jcaw.getDocumentBounds`
- `jcaw.getDictationContext`
- `jcaw.getVisibleRange`
- `jcaw.getCurrentWord`
- `jcaw.getSymbolAtPosition`
- `jcaw.getIndentationLevel`
- `jcaw.getLineCount`
- `jcaw.getLanguageId`
- `jcaw.getVisibleLineNumbers`
- `jcaw.getProjectRoot`

## Installation

To use this extension, you'll need to install Cursorless' [command-server](https://marketplace.visualstudio.com/items?itemName=pokey.command-server) in VSCode and use the [talon-command-client](https://github.com/cursorless-dev/talon-command-client) to communicate with it from Talon. You don't need Cursorless itself - just the command server.

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
filepath       = actions.user.run_rpc_command_get("jcaw.getFilePath")
cursor_pos     = actions.user.run_rpc_command_get("jcaw.getCursorPosition")
line_text      = actions.user.run_rpc_command_get("jcaw.getTextOnLine", 10)
selected       = actions.user.run_rpc_command_get("jcaw.getSelectedText")
text_range     = actions.user.run_rpc_command_get("jcaw.getTextBetweenOffsets", 0, 100)
bounds         = actions.user.run_rpc_command_get("jcaw.getDocumentBounds")
context        = actions.user.run_rpc_command_get("jcaw.getDictationContext")  # Default 500 chars
context_large  = actions.user.run_rpc_command_get("jcaw.getDictationContext", 1000)  # Custom size

visible        = actions.user.run_rpc_command_get("jcaw.getVisibleRange")
word           = actions.user.run_rpc_command_get("jcaw.getCurrentWord")
word_at_pos    = actions.user.run_rpc_command_get("jcaw.getCurrentWord", {"line": 10, "column": 5})
symbol         = actions.user.run_rpc_command_get("jcaw.getSymbolAtPosition")  # Returns None if no symbol
indent         = actions.user.run_rpc_command_get("jcaw.getIndentationLevel")
indent_line    = actions.user.run_rpc_command_get("jcaw.getIndentationLevel", 15)
line_count     = actions.user.run_rpc_command_get("jcaw.getLineCount")
language       = actions.user.run_rpc_command_get("jcaw.getLanguageId")
visible_lines  = actions.user.run_rpc_command_get("jcaw.getVisibleLineNumbers")
project_root   = actions.user.run_rpc_command_get("jcaw.getProjectRoot")  # Returns None if no workspace
```

**Note:** You may want to create wrapper actions for cleaner error handling and to provide better error messages when VSCode isn't active or the command-server isn't running. The `community` repo already has the VSCode RPC implemented - so you could just wire in these commands.
