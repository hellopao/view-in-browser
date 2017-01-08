'use strict';

import * as vscode from 'vscode';
import * as path from "path";

const open = require('open');

// common function for file opening
function openFile(e: string, customBrowser: string) {
    const ext = path.extname(e.toString());
    if (/^\.(html|htm|shtml|xhtml)$/.test(ext)) {
        customBrowser ? open(e, customBrowser) : open(e);
    } else {
        vscode.window.showInformationMessage('Supports html file only!');
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.viewInBrowser', (e: vscode.Uri) => {
        let config = vscode.workspace.getConfiguration('view-in-browser');
        let customBrowser = config.get<string>("customBrowser");

        // if there is Uri it means the file was selected in the explorer.
        if (e.path) {
            openFile(e.fsPath, customBrowser);
        }
        else {
            let editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active text editor found!');
                return;
            }

            const file = editor.document.fileName;
            openFile(`file:///${file}`, customBrowser);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}