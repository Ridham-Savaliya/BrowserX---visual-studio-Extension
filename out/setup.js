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
exports.getSearchEngineId = exports.getApiKey = exports.showSetupNotification = exports.checkSetup = void 0;
const vscode = __importStar(require("vscode"));
async function checkSetup() {
    const config = vscode.workspace.getConfiguration('browserx');
    const apiKey = config.get('apiKey');
    const searchEngineId = config.get('searchEngineId');
    console.log('Setup Check - API Key:', apiKey);
    console.log('Setup Check - Search Engine ID:', searchEngineId);
    return !apiKey || !searchEngineId;
}
exports.checkSetup = checkSetup;
function showSetupNotification() {
    vscode.window.showInformationMessage('BrowserX Setup Required: Please configure your Google API Key and Search Engine ID in the Extension Settings.', 'Open Settings').then(selection => {
        if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'browserx');
        }
    });
}
exports.showSetupNotification = showSetupNotification;
function getApiKey() {
    const config = vscode.workspace.getConfiguration('browserx');
    const apiKey = config.get('apiKey');
    console.log('Get API Key - Value:', apiKey);
    return apiKey;
}
exports.getApiKey = getApiKey;
function getSearchEngineId() {
    const config = vscode.workspace.getConfiguration('browserx');
    const searchEngineId = config.get('searchEngineId');
    console.log('Get Search Engine ID - Value:', searchEngineId);
    return searchEngineId;
}
exports.getSearchEngineId = getSearchEngineId;
//# sourceMappingURL=setup.js.map