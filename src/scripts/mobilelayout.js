/**
 * Mobile Layout Handler for Twitter Post Mockup
 * 
 * Simplified version that relies on CSS media queries instead of DOM manipulation
 */

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize when DOM is fully loaded - only in browser
if (isBrowser) {
  document.addEventListener('DOMContentLoaded', () => {
    // Add platform toggle listeners
    setupPlatformToggle();
    
    // Initialize theme-aware styles
    initializeThemeStyles();
    
    // Listen for theme changes
    document.addEventListener('themeChanged', updateThemeStyles);
  });
}

/**
 * Setup platform toggle functionality
 */
function setupPlatformToggle() {
  // Use event delegation for platform toggle
  document.addEventListener('change', (e) => {
    // Check if the change event is from a platform toggle radio button
    if (e.target.name === 'platform-toggle' || e.target.name === 'mobile-platform-toggle') {
      const platform = e.target.value;
      
      // Update the data-platform attribute on the body
      document.body.setAttribute('data-platform', platform);
      localStorage.setItem('platform', platform);
      
      // Sync the other platform toggles
      syncPlatformToggles(platform);
      
      // Update toggle position for animation
      updateTogglePosition(platform);
      
      // Update preview button onclick attribute
      updatePreviewButtons(platform);
    }
  });
  
  // Ensure initial state is correct
  const savedPlatform = localStorage.getItem('platform') || 'twitter';
  document.body.setAttribute('data-platform', savedPlatform);
  
  // Make sure the correct toggle is selected
  syncPlatformToggles(savedPlatform);
  
  // Apply initial toggle position
  updateTogglePosition(savedPlatform);
  
  // Set initial preview button
  updatePreviewButtons(savedPlatform);
}

/**
 * Update all preview buttons with the current platform
 */
function updatePreviewButtons(platform) {
  // Update desktop preview button
  const desktopPreviewBtn = document.querySelector('.preview-btn');
  if (desktopPreviewBtn) {
    desktopPreviewBtn.setAttribute('onclick', `showPreviewModal('${platform}')`);
  }
  
  // Update mobile preview button
  const mobilePreviewBtn = document.getElementById('mobile-preview-btn');
  if (mobilePreviewBtn) {
    mobilePreviewBtn.setAttribute('onclick', `showPreviewModal('${platform}')`);
    }
  }

/**
 * Sync platform toggles between mobile and desktop views
 */
function syncPlatformToggles(platform) {
  // Update desktop toggle
  const desktopToggle = document.querySelector(`input[name="platform-toggle"][value="${platform}"]`);
  if (desktopToggle && !desktopToggle.checked) {
    desktopToggle.checked = true;
  }
  
  // Update mobile toggle
  const mobileToggle = document.querySelector(`input[name="mobile-platform-toggle"][value="${platform}"]`);
  if (mobileToggle && !mobileToggle.checked) {
    mobileToggle.checked = true;
  }
}

/**
 * Update toggle position for animation
 */
function updateTogglePosition(platform) {
  // Find all platform switches and update their position
  const switches = document.querySelectorAll('.platform-switch');
  switches.forEach(switchEl => {
    if (platform === 'twitter') {
      switchEl.style.setProperty('--toggle-position', '0');
    } else {
      switchEl.style.setProperty('--toggle-position', '100%');
    }
  });
}

/**
 * Initialize theme-aware styles for inputs and controls
 */
function initializeThemeStyles() {
  // Get saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Update theme for all relevant containers
  updateTheme(savedTheme);
  
  // Update input styles based on theme
  const isDarkTheme = savedTheme === 'dark' || savedTheme === 'dim';
  updateInputStyles(isDarkTheme);
  
  // Listen for theme toggle clicks
  const themeToggles = document.querySelectorAll('input[name="theme"], input[name="mobile-theme"]');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const theme = e.target.value;
      const isDark = theme === 'dark' || theme === 'dim';
      
      // Save theme to localStorage
      localStorage.setItem('theme', theme);
      
      // Update input styles
      updateInputStyles(isDark);
      
      // Update theme for all containers
      updateTheme(theme);
      
      // Sync theme between mobile and desktop
      syncThemeToggles(theme);
    });
  });
  
  // Set initial theme toggle state
  syncThemeToggles(savedTheme);
  }
  
/**
 * Update theme for tweet and X containers
 */
function updateTheme(theme) {
  // Desktop containers
  const tweetPreview = document.getElementById('tweet-preview');
  const xPreview = document.getElementById('x-preview');
  
  if (tweetPreview) {
    tweetPreview.setAttribute('data-theme', theme);
}

  if (xPreview) {
    // For XPost component, find the x-container inside
    const xContainer = xPreview.querySelector('.x-container');
    if (xContainer) {
      xContainer.setAttribute('data-theme', theme);
    } else {
      xPreview.setAttribute('data-theme', theme);
    }
  }
  
  // Mobile containers
  const mobileTweetPreview = document.getElementById('mobile-tweet-preview');
  const mobileXPreview = document.getElementById('mobile-x-preview');
  
  if (mobileTweetPreview) {
    mobileTweetPreview.setAttribute('data-theme', theme);
  }
  
  if (mobileXPreview) {
    // For XPost component, find the x-container inside
    const xContainer = mobileXPreview.querySelector('.x-container');
    if (xContainer) {
      xContainer.setAttribute('data-theme', theme);
        } else {
      mobileXPreview.setAttribute('data-theme', theme);
      }
  }
  
  // Handle all x-container elements globally (fallback)
  document.querySelectorAll('.x-container').forEach(container => {
    container.setAttribute('data-theme', theme);
  });
}

/**
 * Sync theme toggles between mobile and desktop views
 */
function syncThemeToggles(theme) {
  // Update desktop toggle
  const desktopToggle = document.querySelector(`input[name="theme"][value="${theme}"]`);
  if (desktopToggle && !desktopToggle.checked) {
    desktopToggle.checked = true;
  }
  
  // Update mobile toggle
  const mobileToggle = document.querySelector(`input[name="mobile-theme"][value="${theme}"]`);
  if (mobileToggle && !mobileToggle.checked) {
    mobileToggle.checked = true;
  }
}

/**
 * Update styles based on current theme
 */
function updateThemeStyles(e) {
  if (e.detail?.theme) {
    // Update theme for all containers
    updateTheme(e.detail.theme);
    
    // Update input styles
    const isDark = e.detail.theme === 'dark' || e.detail.theme === 'dim';
  updateInputStyles(isDark);
    
    // Sync theme between mobile and desktop
    syncThemeToggles(e.detail.theme);
    
    // Save theme to localStorage
    localStorage.setItem('theme', e.detail.theme);
  }
}

/**
 * Update input styles based on theme
 */
function updateInputStyles(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
}

// Add minimal styles for toggle animation
const style = document.createElement('style');
style.textContent = `
  /* Platform switch styling */
  .platform-switch {
    position: relative;
    overflow: hidden;
  }
  
  .platform-switch::before {
    content: '';
    position: absolute;
    height: calc(100% - 8px);
    top: 4px;
    width: 50%;
    background: rgba(29, 155, 240, 0.1);
    border-radius: 9999px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 0;
    transform: translateX(var(--toggle-position, 0));
  }
  
  .switch-option input:checked ~ * {
    position: relative;
    z-index: 1;
  }
  
  /* Apply correct display based on platform */
  body[data-platform="twitter"] #x-wrapper,
  body[data-platform="twitter"] #x-preview {
    display: none !important;
  }
  
  body[data-platform="twitter"] #tweet-wrapper,
  body[data-platform="twitter"] #tweet-preview {
    display: block !important;
    }
    
  body[data-platform="x"] #tweet-wrapper,
  body[data-platform="x"] #tweet-preview {
    display: none !important;
    }
  
  body[data-platform="x"] #x-wrapper,
  body[data-platform="x"] #x-preview {
    display: block !important;
  }
  
  /* Mobile container display rules */
  body[data-platform="twitter"] .mobile-preview-containers #mobile-tweet-wrapper {
    display: block !important;
  }
  
  body[data-platform="twitter"] .mobile-preview-containers #mobile-x-wrapper {
    display: none !important;
  }
  
  body[data-platform="x"] .mobile-preview-containers #mobile-tweet-wrapper {
    display: none !important;
  }
  
  body[data-platform="x"] .mobile-preview-containers #mobile-x-wrapper {
    display: block !important;
  }
`;
document.head.appendChild(style);