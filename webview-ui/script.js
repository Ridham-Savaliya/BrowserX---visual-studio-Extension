// Get the VS Code API
const vscode = acquireVsCodeApi();

// Theme handling
let isDarkMode = localStorage.getItem('darkMode') === 'true';
updateTheme();

// Pagination state
let currentPage = 1;
let totalPages = 1;
let currentQuery = '';
let currentType = 'web';

document.getElementById('themeToggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
});

function updateTheme() {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('themeToggle').textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Tab handling
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const tabType = button.getAttribute('data-tab');
        currentType = tabType;
        currentPage = 1; // Reset page when changing tabs
        showResults(tabType);
    });
});

// Search functionality
function performSearch(type) {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    currentQuery = query;
    currentType = type;
    currentPage = 1;
    showLoading('Searching...');
    vscode.postMessage({
        command: 'search',
        query: query,
        type: type,
        page: currentPage
    });
}

// Handle search results
function showResults(type) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    if (type === 'web') {
        resultsContainer.classList.remove('image-result');
    } else {
        resultsContainer.classList.add('image-result');
    }
}

// Handle messages from the extension
window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.command) {
        case 'searchResults':
            hideLoading();
            currentPage = message.currentPage;
            totalPages = message.totalPages;
            displayResults(message.results, message.type);
            break;
        case 'error':
            hideLoading();
            showError(message.message);
            break;
        case 'loading':
            showLoading(message.message);
            break;
        case 'setQuery':
            document.getElementById('searchInput').value = message.query;
            break;
    }
});

function showLoading(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>${message}</span>
        </div>
    `;
}

function hideLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function displayResults(results, type) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }

    if (type === 'web') {
        const resultsWrapper = document.createElement('div');
        resultsWrapper.className = 'results-wrapper';
        
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.snippet}</p>
                <div class="result-actions">
                    <button onclick="openExternal('${result.link}')">Open in Browser</button>
                </div>
            `;
            resultsWrapper.appendChild(resultElement);
        });
        
        resultsContainer.appendChild(resultsWrapper);
    } else {
        const imageGrid = document.createElement('div');
        imageGrid.className = 'image-result';
        
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'image-item';
            resultElement.innerHTML = `
                <img src="${result.link}" alt="${result.title}" loading="lazy">
                <div class="image-actions">
                    <button onclick="openInWebview('${result.link}')">View</button>
                    <button onclick="openExternal('${result.link}')">Open</button>
                    <button onclick="copyImageLink('${result.link}')" class="copy-button">
                        <span class="copy-icon">📋</span>
                    </button>
                </div>
            `;
            imageGrid.appendChild(resultElement);
        });
        
        resultsContainer.appendChild(imageGrid);
    }

    // Add pagination
    if (totalPages > 1) {
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        
        // Previous page button
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'pagination-button';
            prevButton.innerHTML = '← Previous';
            prevButton.onclick = () => changePage(currentPage - 1);
            pagination.appendChild(prevButton);
        }

        // Page numbers
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        pagination.appendChild(pageInfo);

        // Next page button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.className = 'pagination-button';
            nextButton.innerHTML = 'Next →';
            nextButton.onclick = () => changePage(currentPage + 1);
            pagination.appendChild(nextButton);
        }

        resultsContainer.appendChild(pagination);
    }
}

function changePage(page) {
    currentPage = page;
    showLoading('Loading results...');
    vscode.postMessage({
        command: 'search',
        query: currentQuery,
        type: currentType,
        page: currentPage
    });
}

function showError(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
            <p class="error-help">Please check your API Key and Search Engine ID in the settings.</p>
        </div>
    `;
}

function openExternal(url) {
    vscode.postMessage({
        command: 'openExternal',
        url: url
    });
}

function openInWebview(url) {
    const resultsContainer = document.getElementById('results');
    const currentContent = resultsContainer.innerHTML;
    
    resultsContainer.innerHTML = `
        <div class="webview-container">
            <div class="webview-header">
                <button class="back-button" onclick="goBack()">← Back to Results</button>
            </div>
            <div class="webview-content">
                <img src="${url}" alt="Full size image" class="full-image" onload="this.style.opacity='1'">
            </div>
            <div class="image-preview-actions">
                <button onclick="copyImageLink('${url}')" class="copy-button">
                    <span class="copy-icon">📋</span>
                    Copy Link
                </button>
                <button onclick="openExternal('${url}')" class="action-button">
                    Open in Browser
                </button>
            </div>
        </div>
    `;
    
    // Store the previous content for back button
    resultsContainer.dataset.previousContent = currentContent;
}

function copyImageLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Link copied to clipboard!';
        document.body.appendChild(notification);
        
        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

function goBack() {
    const resultsContainer = document.getElementById('results');
    if (resultsContainer.dataset.previousContent) {
        resultsContainer.innerHTML = resultsContainer.dataset.previousContent;
        delete resultsContainer.dataset.previousContent;
    }
}

// Setup handling
function configureSettings() {
    vscode.postMessage({
        command: 'configureSettings'
    });
}

// Handle Enter key in search input
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-btn.active');
        performSearch(activeTab.getAttribute('data-tab'));
    }
}); 
