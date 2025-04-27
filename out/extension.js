"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const webview_1 = require("./webview");
const setup_1 = require("./setup");
async function activate(context) {
    // Check if setup is required
    const isSetupRequired = await (0, setup_1.checkSetup)();
    if (isSetupRequired) {
        (0, setup_1.showSetupNotification)();
    }
    // Register the command to open the search panel
    let disposable = vscode.commands.registerCommand('browserx.openSearch', () => {
        webview_1.WebviewPanel.createOrShow(context.extensionUri);
    });
    // Register the command to search selected text
    let searchSelectedText = vscode.commands.registerCommand('browserx.searchSelectedText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            if (text) {
                webview_1.WebviewPanel.createOrShow(context.extensionUri, text);
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
                webview_1.WebviewPanel.createOrShow(context.extensionUri, text);
            }
        }
    });
    context.subscriptions.push(disposable, searchSelectedText, searchInBrowser, searchInBrowserX);
    // Listen for configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('browserx')) {
            (0, setup_1.checkSetup)().then(isSetupRequired => {
                if (isSetupRequired) {
                    (0, setup_1.showSetupNotification)();
                }
            });
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map