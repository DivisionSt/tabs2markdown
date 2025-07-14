# Chrome Extension Installation Instructions

## 📁 Files to Create

Create a new folder called `tabs-to-markdown` and add these files:

### 1. manifest.json
```json
{
  "manifest_version": 3,
  "name": "Tabs to Markdown",
  "version": "1.0",
  "description": "Convert Chrome tabs to markdown format with search and selection features",
  "permissions": ["tabs"],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Tabs to Markdown"
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

### 2. popup.html
Copy the HTML content from the popup.html artifact above.

### 3. popup.css
Copy the CSS content from the popup.css artifact above.

### 4. popup.js
Copy the JavaScript content from the popup.js artifact above.

### 5. Icons (Optional)
You can create simple icons or use placeholder icons:
- **icon16.png** (16x16 pixels)
- **icon48.png** (48x48 pixels)  
- **icon128.png** (128x128 pixels)

If you don't want to create icons, you can remove the "icons" section from manifest.json.

## 🚀 Installation Steps

1. **Create the folder structure:**
   ```
   tabs-to-markdown/
   ├── manifest.json
   ├── popup.html
   ├── popup.css
   ├── popup.js
   └── icons/ (optional)
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```

2. **Open Chrome Extensions page:**
   - Go to `chrome://extensions/`
   - Or click the three dots menu → More tools → Extensions

3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the extension:**
   - Click "Load unpacked"
   - Select your `tabs-to-markdown` folder
   - The extension should appear in your extensions list

5. **Pin the extension (recommended):**
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Tabs to Markdown" and click the pin icon

## ✨ Features

- **Search tabs**: Type to filter tabs by title or URL
- **Select specific tabs**: Check/uncheck individual tabs
- **Bulk selection**: Select all, none, or only visible tabs
- **Export to markdown**: Generate `[Title](URL)` format
- **Copy to clipboard**: One-click copying
- **Download as file**: Save as `.md` file
- **Visual indicators**: Shows active tabs (green dot) and pinned tabs (📌)
- **Responsive design**: Clean, modern interface

## 🔧 Usage

1. Click the extension icon in your toolbar
2. Use the search bar to filter tabs (optional)
3. Select the tabs you want to export
4. Click "Export Selected Tabs"
5. Copy the markdown or download as a file

## 🛠️ Troubleshooting

- **Extension not loading**: Make sure all files are in the correct folder and manifest.json is valid
- **No tabs showing**: Check that the extension has "tabs" permission
- **Search not working**: Refresh the extension popup
- **Icons not showing**: Remove the "icons" section from manifest.json if you don't have icon files

## 🎨 Customization

You can modify the CSS to change colors, fonts, or layout. The extension uses a modern design with:
- Clean typography
- Smooth transitions
- Responsive layout
- Accessible colors
- Intuitive controls