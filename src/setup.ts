import * as vscode from 'vscode';

export async function checkSetup(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration('browserx');
    const apiKey = config.get<string>('apiKey');
    const searchEngineId = config.get<string>('searchEngineId');

    console.log('Setup Check - API Key:', apiKey);
    console.log('Setup Check - Search Engine ID:', searchEngineId);

    return !apiKey || !searchEngineId;
}

export function showSetupNotification() {
    vscode.window.showInformationMessage(
        'BrowserX Setup Required: Please configure your Google API Key and Search Engine ID in the Extension Settings.',
        'Open Settings'
    ).then(selection => {
        if (selection === 'Open Settings') {
            vscode.commands.executeCommand(
                'workbench.action.openSettings',
                'browserx'
            );
        }
    });
}

export function getApiKey(): string | undefined {
    const config = vscode.workspace.getConfiguration('browserx');
    const apiKey = config.get<string>('apiKey');
    console.log('Get API Key - Value:', apiKey);
    return apiKey;
}

export function getSearchEngineId(): string | undefined {
    const config = vscode.workspace.getConfiguration('browserx');
    const searchEngineId = config.get<string>('searchEngineId');
    console.log('Get Search Engine ID - Value:', searchEngineId);
    return searchEngineId;
} 
