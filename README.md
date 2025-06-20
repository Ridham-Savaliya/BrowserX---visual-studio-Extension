# BrowserX - VS Code Extension

A powerful browser extension for VS Code that integrates Google Custom Search for both web and image searches right in the VS CODE IDE.

## Features

- 🔍 Google Custom Search integration (Web + Images)
- 🌓 Dark Mode support with smooth transitions
- 🎨 Modern, responsive UI with animations
- ⚡ Fast and efficient search results
- 🔐 Secure API key management
- 🎯 Easy setup wizard

## Installation

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "BrowserX"
4. Click Install


## Initial Setup Guide

Before you can use Google Search Pro, you'll need to set up two important credentials:

### 1. Get Your Google API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one.  
   ![Create Project in Google Cloud Console](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723844/promotions/isjrubao6zdrvzndxnum.png)
3. Enable the Custom Search API:  
   a. In the navigation menu, click "APIs & Services" > "Library"  
   b. Search for "Custom Search API"  
   c. Click "Enable"  
   ![Enable Custom Search API](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723866/promotions/n8pxb9ppjm6y13v9ygth.png)
4. Create API credentials:  
   a. Go to "APIs & Services" > "Credentials"  
   b. Click "Create Credentials" > "API Key"  
   c. Copy your API key  
   ![Get API Key](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723904/promotions/xrm7zcv3fkomezxrodrb.png)

### 2. Create a Custom Search Engine ID

1. Visit the [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/)
2. Click "Get Started" or "Create Search Engine"  
   ![Create Search Engine](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723650/promotions/rayiixfduwy4py39dugh.png)
3. Configure your search engine:  
   a. Select "Search the entire web" option  
   b. Name your search engine (any name you prefer)  
   c. In "Sites to search", select "Search the entire web"  
   d. Make sure to enable "Search the entire web" option  
   e. Click "Create"  
   ![Configure Search Engine](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723815/promotions/w20krh0r8ey5qfl3lysk.png)
4. After creation:
   a. Click on "Customize"
   b. Go to "Basic" tab
   c. Make sure "Search the entire web" is enabled
   d. Find your Search Engine ID (it looks like: `012345678901234567890:abcdefghijk`)  
   ![Find Search Engine ID](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723532/promotions/egmfe7ext9w95orsxclm.png)

Important Notes:
- The Search Engine MUST be configured to "Search the entire web"
- If you see "Search only included sites" option, change it to "Search the entire web"
- The Search Engine ID is case-sensitive
- Double-check for any extra spaces when copying the ID

### 3. Configure the Extension in VS Code

1. Open VS Code Settings (File > Preferences > Settings or `Ctrl+,`)
2. Search for "Google Search Pro"
3. Enter your API Key in the `Google Search Pro: API Key` field  
   ![VS Code Settings for API Key](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723936/promotions/p3um9gsv3jtudvej1zv3.png)
4. Enter your Search Engine ID in the `Google Search Pro: Search Engine ID` field  
   ![VS Code Settings for Search Engine ID](https://res.cloudinary.com/dzrzfsu9u/image/upload/v1745723979/promotions/ntxzknuedvntctc41lol.png)
5. Save the settings

## Usage

1. Open the command palette (Ctrl+Shift+P)
2. Type "BrowserX: Open Search"
3. Enter your search query
4. Choose between Web or Image search
5. Click on results to open them in your default browser

## Features in Detail

### Search
- Web search with rich snippets
- Image search with grid view
- Instant results with smooth animations

### UI/UX
- Dark/Light mode toggle
- Responsive design
- Smooth animations
- Tab-based navigation

### Security
- Secure API key storage
- No data collection
- Privacy-focused

## Requirements

- VS Code 1.60.0 or higher
- Google API Key
- Google Custom Search Engine ID

## Known Issues

- None at the moment

## Release Notes

### 0.1.0
- Initial release
- Basic search functionality
- Dark mode support
- Setup wizard

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

## Author

Ridham Savaliya 
