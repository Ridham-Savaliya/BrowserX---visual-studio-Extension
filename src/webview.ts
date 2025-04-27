import * as vscode from 'vscode';
import * as path from 'path';
import { checkSetup, getApiKey, getSearchEngineId } from './setup';

export class WebviewPanel {
    public static currentPanel: WebviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, query?: string) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (WebviewPanel.currentPanel) {
            WebviewPanel.currentPanel._panel.reveal(column);
            if (query) {
                WebviewPanel.currentPanel._panel.webview.postMessage({
                    command: 'setQuery',
                    query: query
                });
            }
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'browserX',
            'BrowserX Search',
            column || vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'webview-ui')
                ],
                retainContextWhenHidden: true
            }
        );

        WebviewPanel.currentPanel = new WebviewPanel(panel, extensionUri, query);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, initialQuery?: string) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'search':
                        await this._handleSearch(message.query, message.type, message.page);
                        return;
                    case 'openExternal':
                        vscode.env.openExternal(vscode.Uri.parse(message.url));
                        return;
                    case 'openInWebview':
                        this._openInWebview(message.url);
                        return;
                }
            },
            null,
            this._disposables
        );

        if (initialQuery) {
            this._panel.webview.postMessage({
                command: 'setQuery',
                query: initialQuery
            });
        }
    }

    private async _update() {
        const isSetupRequired = await checkSetup();
        const webview = this._panel.webview;
        
        this._panel.webview.html = this._getHtmlForWebview(webview, isSetupRequired);
    }

    private async _handleSearch(query: string, type: 'web' | 'image', page: number = 1) {
        const apiKey = getApiKey();
        const searchEngineId = getSearchEngineId();

        // Show loading state
        this._panel.webview.postMessage({
            command: 'loading',
            message: 'Searching...'
        });

        console.log('Debug - API Key:', apiKey);
        console.log('Debug - Search Engine ID:', searchEngineId);
        console.log('Debug - Search Engine ID length:', searchEngineId?.length);

        if (!apiKey || !searchEngineId) {
            this._panel.webview.postMessage({
                command: 'error',
                message: 'API Key or Search Engine ID not configured'
            });
            return;
        }

        // Clean up Search Engine ID (remove any 'w' prefix if present)
        const cleanSearchEngineId = searchEngineId.replace(/^w/, '');
        console.log('Debug - Cleaned Search Engine ID:', cleanSearchEngineId);

        // Validate Search Engine ID format
        if (!cleanSearchEngineId.match(/^[a-z0-9]{17}$/i)) {
            console.log('Debug - Search Engine ID validation failed');
            console.log('Debug - Search Engine ID format:', cleanSearchEngineId);
            this._panel.webview.postMessage({
                command: 'error',
                message: `Invalid Search Engine ID format. Current ID: ${searchEngineId}`
            });
            return;
        }

        try {
            const startIndex = (page - 1) * 10 + 1; // Google Custom Search uses 1-based indexing
            const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cleanSearchEngineId}&q=${encodeURIComponent(query)}${type === 'image' ? '&searchType=image' : ''}&start=${startIndex}&num=10`;
            console.log('Search URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Search error:', errorData);
                
                if (errorData.error?.message?.includes('invalid argument')) {
                    throw new Error('Invalid Search Engine ID. Please check your CX value in settings.');
                }
                
                throw new Error(errorData.error?.message || 'Search request failed');
            }

            const data = await response.json();
            console.log('Search results:', data);

            if (!data.items || data.items.length === 0) {
                this._panel.webview.postMessage({
                    command: 'error',
                    message: 'No results found'
                });
                return;
            }

            // Calculate total pages (Google Custom Search typically returns 10 results per page)
            const totalResults = parseInt(data.searchInformation.totalResults) || 0;
            const totalPages = Math.ceil(Math.min(totalResults, 100) / 10); // Google limits to 100 results

            console.log('Debug - Total Results:', totalResults);
            console.log('Debug - Total Pages:', totalPages);
            console.log('Debug - Current Page:', page);

            this._panel.webview.postMessage({
                command: 'searchResults',
                results: data.items,
                type,
                totalPages,
                currentPage: page
            });
        } catch (error: any) {
            console.error('Search error:', error);
            this._panel.webview.postMessage({
                command: 'error',
                message: error?.message || 'An unknown error occurred'
            });
        }
    }

    private _openInWebview(url: string) {
        // Show loading state
        this._panel.webview.postMessage({
            command: 'loading',
            message: 'Loading content...'
        });

        this._panel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; }
                    .loading {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        background-color: var(--background-color);
                        color: var(--text-color);
                    }
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid var(--border-color);
                        border-top: 4px solid var(--primary-color);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-right: 10px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                        display: none;
                    }
                    iframe.loaded {
                        display: block;
                    }
                </style>
            </head>
            <body>
                <div class="loading">
                    <div class="spinner"></div>
                    <span>Loading content...</span>
                </div>
                <iframe src="${url}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" onload="this.classList.add('loaded'); document.querySelector('.loading').style.display='none';"></iframe>
            </body>
            </html>
        `;
    }

    private _getHtmlForWebview(webview: vscode.Webview, isSetupRequired: boolean) {
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'webview-ui', 'styles.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'webview-ui', 'script.js')
        );

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BrowserX Search</title>
                <link href="${styleUri}" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <header>
                        <h1>BrowserX</h1>
                        <p>by Ridham Savaliya</p>
                        <div class="theme-toggle">
                            <button id="themeToggle">Toggle Dark Mode</button>
                        </div>
                    </header>
                    
                    ${isSetupRequired ? this._getSetupHtml() : this._getSearchHtml()}
                </div>
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    private _getSetupHtml() {
        return `
            <div class="setup-container">
                <h2>Setup Required</h2>
                <p>Please configure your Google API Key and Search Engine ID to use BrowserX.</p>
                <button onclick="configureSettings()">Configure Now</button>
            </div>
        `;
    }

    private _getSearchHtml() {
        return `
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search...">
                    <button onclick="performSearch('web')">Web Search</button>
                    <button onclick="performSearch('image')">Image Search</button>
                </div>
                <div class="tabs">
                    <button class="tab-btn active" data-tab="web">Web Results</button>
                    <button class="tab-btn" data-tab="image">Image Results</button>
                </div>
                <div id="results" class="results"></div>
            </div>
        `;
    }

    public dispose() {
        WebviewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
} 
