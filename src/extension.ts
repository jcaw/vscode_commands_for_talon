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

    context.subscriptions.push(
        getFilePathCommand,
        getCursorPositionCommand,
        getTextOnLineCommand,
        getSelectedTextCommand,
        getTextBetweenOffsetsCommand,
        getDocumentBoundsCommand,
        getDictationContextCommand
    );
}

export function deactivate() {}
