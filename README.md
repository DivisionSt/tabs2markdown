# Why this Extension?
I find I often end up with an overly cluttered tab bar in Chrome. As an avid Obsidian user, I developed this extension to help me transition these select tabs from my browser to my Obsidian vault where they can be referenced again any time.

The thing I like about this extension is how it grabs the Title of each tab and builds it into a Markdown link that is ready to paste into Obsidian.


# Chrome Extension Installation Instructions

## 📁 Clone repository

Clone the repository to your local filesystem

## 🚀 Installation Steps

1. **Open Chrome Extensions page:**
   - Go to `chrome://extensions/`
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the extension:**
   - Click "Load unpacked"
   - Select your `tabs2markdown` folder (note, not the repository root, but the nested `tabs2markdown` folder)
   - The extension should appear in your extensions list

4. **Pin the extension (recommended):**
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Tabs2Markdown" and click the pin icon

## ✨ Features

- **Search tabs**: Type to filter tabs by title or URL
- **Select specific tabs**: Check/uncheck individual tabs
- **Option to close tabs from the list**: Click the `x` to close a tab
- **Bulk selection**: Select all, none, or only visible tabs
- **Export to markdown**: Generate `[Title](URL)` format
- **Copy to clipboard**: One-click copying
- **Download as file**: Save as `.md` file
- **Option to close tabs after export**: Check the box before exporting to close tabs
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
