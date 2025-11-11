import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Talon Helpers extension is now active');

    const getFilePathCommand = vscode.commands.registerCommand(
        'jcaw.getFilePath',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }
            return editor.document.fileName;
        }
    );

    const getCursorPositionCommand = vscode.commands.registerCommand(
        'jcaw.getCursorPosition',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const position = editor.selection.active;
            const document = editor.document;

            return {
                line: position.line,
                column: position.character,
                offset: document.offsetAt(position)
            };
        }
    );

    const getTextOnLineCommand = vscode.commands.registerCommand(
        'jcaw.getTextOnLine',
        (lineNumber?: number) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;

            const line = lineNumber !== undefined
                ? lineNumber
                : editor.selection.active.line;

            if (line < 0 || line >= document.lineCount) {
                throw new Error(`Line ${line} out of bounds. Document has ${document.lineCount} lines`);
            }

            const lineText = document.lineAt(line);
            return {
                text: lineText.text,
                start: {
                    line: lineText.range.start.line,
                    column: lineText.range.start.character,
                    offset: document.offsetAt(lineText.range.start)
                },
                end: {
                    line: lineText.range.end.line,
                    column: lineText.range.end.character,
                    offset: document.offsetAt(lineText.range.end)
                }
            };
        }
    );

    const getSelectedTextCommand = vscode.commands.registerCommand(
        'jcaw.getSelectedText',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const selection = editor.selection;
            const document = editor.document;
            const selectedText = document.getText(selection);

            return {
                text: selectedText,
                start: {
                    line: selection.anchor.line,
                    column: selection.anchor.character,
                    offset: document.offsetAt(selection.anchor)
                },
                end: {
                    line: selection.active.line,
                    column: selection.active.character,
                    offset: document.offsetAt(selection.active)
                },
                isEmpty: selection.isEmpty
            };
        }
    );

    const getTextBetweenOffsetsCommand = vscode.commands.registerCommand(
        'jcaw.getTextBetweenOffsets',
        (startOffset: number, endOffset: number) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const documentLength = document.getText().length;

            if (startOffset < 0 || startOffset > documentLength ||
                endOffset < 0 || endOffset > documentLength) {
                throw new Error(`Offset out of bounds. Document length: ${documentLength}, requested range: ${startOffset}-${endOffset}`);
            }

            if (startOffset > endOffset) {
                throw new Error(`Start offset (${startOffset}) cannot be greater than end offset (${endOffset})`);
            }

            const startPos = document.positionAt(startOffset);
            const endPos = document.positionAt(endOffset);
            const range = new vscode.Range(startPos, endPos);
            const text = document.getText(range);

            return {
                text: text,
                start: {
                    line: startPos.line,
                    column: startPos.character,
                    offset: startOffset
                },
                end: {
                    line: endPos.line,
                    column: endPos.character,
                    offset: endOffset
                }
            };
        }
    );

    const getDocumentBoundsCommand = vscode.commands.registerCommand(
        'jcaw.getDocumentBounds',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const lastLine = document.lineCount - 1;
            const lastLineLength = document.lineAt(lastLine).text.length;
            const endPos = new vscode.Position(lastLine, lastLineLength);

            return {
                start: {
                    line: 0,
                    column: 0,
                    offset: 0
                },
                end: {
                    line: endPos.line,
                    column: endPos.character,
                    offset: document.offsetAt(endPos)
                }
            };
        }
    );

    const getDictationContextCommand = vscode.commands.registerCommand(
        'jcaw.getDictationContext',
        (maxChars: number = 500) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const selection = editor.selection;

            // Use the start of the selection as the reference point
            const referencePos = selection.start;
            const referenceOffset = document.offsetAt(referencePos);

            // Get text before the selection
            const beforeStartOffset = Math.max(0, referenceOffset - maxChars);
            const beforeStartPos = document.positionAt(beforeStartOffset);
            const beforeRange = new vscode.Range(beforeStartPos, referencePos);
            const before = document.getText(beforeRange);

            // Get text after the selection
            const selectionEnd = selection.end;
            const selectionEndOffset = document.offsetAt(selectionEnd);
            const documentText = document.getText();
            const afterEndOffset = Math.min(documentText.length, selectionEndOffset + maxChars);
            const afterEndPos = document.positionAt(afterEndOffset);
            const afterRange = new vscode.Range(selectionEnd, afterEndPos);
            const after = document.getText(afterRange);

            return {
                before: before,
                after: after
            };
        }
    );

    const getVisibleRangeCommand = vscode.commands.registerCommand(
        'jcaw.getVisibleRange',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const visibleRanges = editor.visibleRanges;

            if (visibleRanges.length === 0) {
                throw new Error('No visible ranges');
            }

            // Return the first visible range (primary viewport)
            const range = visibleRanges[0];
            return {
                start: {
                    line: range.start.line,
                    column: range.start.character,
                    offset: document.offsetAt(range.start)
                },
                end: {
                    line: range.end.line,
                    column: range.end.character,
                    offset: document.offsetAt(range.end)
                }
            };
        }
    );

    const getCurrentWordCommand = vscode.commands.registerCommand(
        'jcaw.getCurrentWord',
        (position?: { line: number, column: number }) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const pos = position
                ? new vscode.Position(position.line, position.column)
                : editor.selection.active;

            const wordRange = document.getWordRangeAtPosition(pos);

            if (!wordRange) {
                return {
                    text: '',
                    start: {
                        line: pos.line,
                        column: pos.character,
                        offset: document.offsetAt(pos)
                    },
                    end: {
                        line: pos.line,
                        column: pos.character,
                        offset: document.offsetAt(pos)
                    }
                };
            }

            return {
                text: document.getText(wordRange),
                start: {
                    line: wordRange.start.line,
                    column: wordRange.start.character,
                    offset: document.offsetAt(wordRange.start)
                },
                end: {
                    line: wordRange.end.line,
                    column: wordRange.end.character,
                    offset: document.offsetAt(wordRange.end)
                }
            };
        }
    );

    const getSymbolAtPositionCommand = vscode.commands.registerCommand(
        'jcaw.getSymbolAtPosition',
        async (position?: { line: number, column: number }) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const pos = position
                ? new vscode.Position(position.line, position.column)
                : editor.selection.active;

            // Get document symbols at the position
            const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                'vscode.executeDocumentSymbolProvider',
                document.uri
            );

            if (!symbols || symbols.length === 0) {
                return null;
            }

            // Find the most specific symbol containing the position
            function findSymbolAtPosition(symbols: vscode.DocumentSymbol[], pos: vscode.Position): vscode.DocumentSymbol | null {
                for (const symbol of symbols) {
                    if (symbol.range.contains(pos)) {
                        // Check children first for more specific match
                        if (symbol.children && symbol.children.length > 0) {
                            const childMatch = findSymbolAtPosition(symbol.children, pos);
                            if (childMatch) {
                                return childMatch;
                            }
                        }
                        return symbol;
                    }
                }
                return null;
            }

            const symbol = findSymbolAtPosition(symbols, pos);

            if (!symbol) {
                return null;
            }

            return {
                name: symbol.name,
                kind: vscode.SymbolKind[symbol.kind],
                range: {
                    start: {
                        line: symbol.range.start.line,
                        column: symbol.range.start.character,
                        offset: document.offsetAt(symbol.range.start)
                    },
                    end: {
                        line: symbol.range.end.line,
                        column: symbol.range.end.character,
                        offset: document.offsetAt(symbol.range.end)
                    }
                },
                selectionRange: {
                    start: {
                        line: symbol.selectionRange.start.line,
                        column: symbol.selectionRange.start.character,
                        offset: document.offsetAt(symbol.selectionRange.start)
                    },
                    end: {
                        line: symbol.selectionRange.end.line,
                        column: symbol.selectionRange.end.character,
                        offset: document.offsetAt(symbol.selectionRange.end)
                    }
                }
            };
        }
    );

    const getIndentationLevelCommand = vscode.commands.registerCommand(
        'jcaw.getIndentationLevel',
        (lineNumber?: number) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const document = editor.document;
            const line = lineNumber !== undefined
                ? lineNumber
                : editor.selection.active.line;

            if (line < 0 || line >= document.lineCount) {
                throw new Error(`Line ${line} out of bounds. Document has ${document.lineCount} lines`);
            }

            const lineText = document.lineAt(line).text;
            const tabSize = editor.options.tabSize as number || 4;
            const insertSpaces = editor.options.insertSpaces as boolean;

            // Count leading whitespace
            let spaces = 0;
            let tabs = 0;
            for (let i = 0; i < lineText.length; i++) {
                if (lineText[i] === ' ') {
                    spaces++;
                } else if (lineText[i] === '\t') {
                    tabs++;
                } else {
                    break;
                }
            }

            // Calculate effective indentation level
            const totalSpaces = spaces + (tabs * tabSize);
            const level = Math.floor(totalSpaces / tabSize);

            return {
                level: level,
                spaces: totalSpaces,
                tabs: tabs,
                usesTabs: !insertSpaces
            };
        }
    );

    const getLineCountCommand = vscode.commands.registerCommand(
        'jcaw.getLineCount',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            return editor.document.lineCount;
        }
    );

    const getLanguageIdCommand = vscode.commands.registerCommand(
        'jcaw.getLanguageId',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            return editor.document.languageId;
        }
    );

    const getVisibleLineNumbersCommand = vscode.commands.registerCommand(
        'jcaw.getVisibleLineNumbers',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const visibleRanges = editor.visibleRanges;

            if (visibleRanges.length === 0) {
                throw new Error('No visible ranges');
            }

            // Return the first and last visible line numbers
            const range = visibleRanges[0];
            return {
                first: range.start.line,
                last: range.end.line
            };
        }
    );

    const getProjectRootCommand = vscode.commands.registerCommand(
        'jcaw.getProjectRoot',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('No active editor');
            }

            const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);

            if (!workspaceFolder) {
                return null;
            }

            return workspaceFolder.uri.fsPath;
        }
    );

    context.subscriptions.push(
        getFilePathCommand,
        getCursorPositionCommand,
        getTextOnLineCommand,
        getSelectedTextCommand,
        getTextBetweenOffsetsCommand,
        getDocumentBoundsCommand,
        getDictationContextCommand,
        getVisibleRangeCommand,
        getCurrentWordCommand,
        getSymbolAtPositionCommand,
        getIndentationLevelCommand,
        getLineCountCommand,
        getLanguageIdCommand,
        getVisibleLineNumbersCommand,
        getProjectRootCommand
    );
}

export function deactivate() {}
