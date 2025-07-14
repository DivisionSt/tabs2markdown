class Tabs2Markdown {
    constructor() {
        this.tabs = [];
        this.selectedTabs = new Set();
        this.filteredTabs = [];
        this.init();
    }

    async init() {
        await this.loadTabs();
        this.setupEventListeners();
        this.renderTabs();
        this.updateCounts();
    }

    async loadTabs() {
        try {
            this.tabs = await chrome.tabs.query({});
            this.filteredTabs = [...this.tabs];
        } catch (error) {
            console.error('Error loading tabs:', error);
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
        });

        // Selection controls
        document.getElementById('selectAll').addEventListener('click', () => this.selectAll());
        document.getElementById('selectNone').addEventListener('click', () => this.selectNone());
        document.getElementById('selectVisible').addEventListener('click', () => this.selectVisible());

        // Export functionality
        document.getElementById('exportButton').addEventListener('click', () => this.exportTabs());

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('copyToClipboard').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('downloadFile').addEventListener('click', () => this.downloadFile());

        // Close modal on outside click
        document.getElementById('outputModal').addEventListener('click', (e) => {
            if (e.target.id === 'outputModal') {
                this.closeModal();
            }
        });
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredTabs = [...this.tabs];
        } else {
            this.filteredTabs = this.tabs.filter(tab => 
                tab.title.toLowerCase().includes(searchTerm) || 
                tab.url.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderTabs();
        this.updateCounts();
    }

    renderTabs() {
        const tabsList = document.getElementById('tabsList');
        tabsList.innerHTML = '';

        this.filteredTabs.forEach(tab => {
            const tabItem = this.createTabItem(tab);
            tabsList.appendChild(tabItem);
        });
    }

    createTabItem(tab) {
        const tabItem = document.createElement('div');
        tabItem.className = 'tab-item';
        tabItem.dataset.tabId = tab.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'tab-checkbox';
        checkbox.checked = this.selectedTabs.has(tab.id);
        checkbox.addEventListener('change', (e) => this.toggleTabSelection(tab.id, e.target.checked));

        const favicon = document.createElement('img');
        favicon.className = 'tab-favicon';
        favicon.src = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23999" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>';
        favicon.onerror = () => {
            favicon.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23999" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>';
        };

        const tabInfo = document.createElement('div');
        tabInfo.className = 'tab-info';

        const title = document.createElement('div');
        title.className = 'tab-title';
        title.textContent = tab.title || 'Untitled';
        title.title = tab.title || 'Untitled';

        const url = document.createElement('div');
        url.className = 'tab-url';
        url.textContent = tab.url;
        url.title = tab.url;

        tabInfo.appendChild(title);
        tabInfo.appendChild(url);

        const indicator = document.createElement('div');
        indicator.className = 'tab-indicator';

        if (tab.active) {
            const activeIndicator = document.createElement('div');
            activeIndicator.className = 'active-indicator';
            activeIndicator.title = 'Active tab';
            indicator.appendChild(activeIndicator);
        }

        if (tab.pinned) {
            const pinnedIndicator = document.createElement('div');
            pinnedIndicator.className = 'pinned-indicator';
            pinnedIndicator.textContent = '📌';
            pinnedIndicator.title = 'Pinned tab';
            indicator.appendChild(pinnedIndicator);
        }

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'tab-close-button';
        closeButton.textContent = '×';
        closeButton.title = 'Close tab';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            this.closeTab(tab.id, tabItem);
        });

        tabItem.appendChild(checkbox);
        tabItem.appendChild(favicon);
        tabItem.appendChild(tabInfo);
        tabItem.appendChild(indicator);
        tabItem.appendChild(closeButton);

        return tabItem;
    }

    closeTab(tabId, tabItemElement) {
        // Store the tab data and parent element for potential restoration
        const tabData = {
            id: tabId,
            title: tabItemElement.querySelector('.tab-title').textContent,
            url: tabItemElement.querySelector('.tab-url').textContent,
            favIconUrl: tabItemElement.querySelector('.tab-favicon').src,
            active: tabItemElement.querySelector('.active-indicator') !== null,
            pinned: tabItemElement.querySelector('.pinned-indicator') !== null
        };
        
        const parentElement = tabItemElement.parentElement;
        const nextSibling = tabItemElement.nextSibling;
        const wasSelected = this.selectedTabs.has(tabId);
        
        // Remove from UI immediately for better UX
        tabItemElement.remove();
        
        // Remove from selectedTabs if it was selected
        this.selectedTabs.delete(tabId);
        
        // Close the actual tab
        chrome.tabs.remove(tabId, () => {
            if (chrome.runtime.lastError) {
                console.error('Error closing tab:', chrome.runtime.lastError);
                
                // Restore the tab item to the UI
                const restoredTabItem = this.createTabItem(tabData);
                
                // Re-insert at the same position
                if (nextSibling) {
                    parentElement.insertBefore(restoredTabItem, nextSibling);
                } else {
                    parentElement.appendChild(restoredTabItem);
                }
                
                // Restore selection state
                if (wasSelected) {
                    this.selectedTabs.add(tabId);
                }
                
                // Show error message to user
                this.showErrorMessage(`Failed to close tab: ${tabData.title}`);
                
                // Optional: Add visual feedback to indicate the error
                restoredTabItem.classList.add('tab-close-error');
                setTimeout(() => {
                    restoredTabItem.classList.remove('tab-close-error');
                }, 3000);
            }
        });
    }

    showErrorMessage(message) {
        // Create or update error message element
        let errorElement = document.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            
            // Insert at the top of the popup
            const popupContainer = document.querySelector('.popup-container') || document.body;
            popupContainer.insertBefore(errorElement, popupContainer.firstChild);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // Optional: Add method to manually dismiss error
    dismissError() {
        const errorElement = document.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    toggleTabSelection(tabId, isSelected) {
        if (isSelected) {
            this.selectedTabs.add(tabId);
        } else {
            this.selectedTabs.delete(tabId);
        }
        this.updateCounts();
        this.updateExportButton();
    }

    selectAll() {
        this.tabs.forEach(tab => this.selectedTabs.add(tab.id));
        this.updateCheckboxes();
        this.updateCounts();
        this.updateExportButton();
    }

    selectNone() {
        this.selectedTabs.clear();
        this.updateCheckboxes();
        this.updateCounts();
        this.updateExportButton();
    }

    selectVisible() {
        this.filteredTabs.forEach(tab => this.selectedTabs.add(tab.id));
        this.updateCheckboxes();
        this.updateCounts();
        this.updateExportButton();
    }

    updateCheckboxes() {
        const checkboxes = document.querySelectorAll('.tab-checkbox');
        checkboxes.forEach(checkbox => {
            const tabId = parseInt(checkbox.closest('.tab-item').dataset.tabId);
            checkbox.checked = this.selectedTabs.has(tabId);
        });
    }

    updateCounts() {
        const selectedCount = this.selectedTabs.size;
        const totalCount = this.tabs.length;
        
        document.getElementById('selectedCount').textContent = selectedCount;
        document.getElementById('totalCount').textContent = totalCount;
    }

    updateExportButton() {
        const exportButton = document.getElementById('exportButton');
        exportButton.disabled = this.selectedTabs.size === 0;
    }

    exportTabs() {
        const selectedTabsData = this.tabs.filter(tab => this.selectedTabs.has(tab.id));
        const markdown = this.generateMarkdown(selectedTabsData);
        
        document.getElementById('markdownOutput').value = markdown;
        document.getElementById('outputModal').style.display = 'block';
    }

    generateMarkdown(tabs) {
        return tabs.map(tab => {
            const cleanTitle = tab.title.replace(/[\[\]]/g, '');
            return `[${cleanTitle}](${tab.url})`;
        }).join('\n');
    }

    closeModal() {
        document.getElementById('outputModal').style.display = 'none';
    }

    async copyToClipboard() {
        const output = document.getElementById('markdownOutput');
        try {
            await navigator.clipboard.writeText(output.value);
            this.showNotification('Copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            output.select();
            document.execCommand('copy');
            this.showNotification('Copied to clipboard!');
        }
    }

    downloadFile() {
        const output = document.getElementById('markdownOutput');
        const blob = new Blob([output.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tabs-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('File downloaded!');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Tabs2Markdown();
});