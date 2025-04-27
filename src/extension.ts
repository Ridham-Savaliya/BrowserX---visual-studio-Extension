import * as vscode from 'vscode';
import { WebviewPanel } from './webview';
import { checkSetup, showSetupNotification } from './setup';

export async function activate(context: vscode.ExtensionContext) {
    // Check if setup is required
    const isSetupRequired = await checkSetup();
    
    if (isSetupRequired) {
        showSetupNotification();
    }

    // Register the command to open the search panel
    let disposable = vscode.commands.registerCommand('browserx.openSearch', () => {
        WebviewPanel.createOrShow(context.extensionUri);
    });

    // Register the command to search selected text
    let searchSelectedText = vscode.commands.registerCommand('browserx.searchSelectedText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            if (text) {
                WebviewPanel.createOrShow(context.extensionUri, text);
            }
        }
    });

    // Register the command to search in browser
    let searchInBrowser = vscode.commands.registerCommand('browserx.searchInBrowser', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            if (text) {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
                vscode.env.openExternal(vscode.Uri.parse(searchUrl));
            }
        }
    });

    // Register the command to search in BrowserX
    let searchInBrowserX = vscode.commands.registerCommand('browserx.searchInBrowserX', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            if (text) {
                WebviewPanel.createOrShow(context.extensionUri, text);
            }
        }
    });

    context.subscriptions.push(disposable, searchSelectedText, searchInBrowser, searchInBrowserX);

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('browserx')) {
                checkSetup().then(isSetupRequired => {
                    if (isSetupRequired) {
                        showSetupNotification();
                    }
                });
            }
        })
    );
}

export function deactivate() {} 
