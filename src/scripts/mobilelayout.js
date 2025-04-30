/**
 * Mobile Layout Handler for Twitter Post Mockup
 * 
 * This script handles dynamic repositioning of UI elements based on screen size
 * instead of relying solely on CSS media queries.
 */

// Store original positions/states of elements
let originalPositions = {};
let mobileContainer = null;
let mainContentWrapper = null;

// Elements that need repositioning
let themeToggleGroup;
let hamburgerMenu;
let sizeControls;
let previewBtn;
let randomizeStatsBtn;
let platformToggle;
let tweetWrapper;
let xWrapper;
let tweetPreview;
let xPreview;

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize when DOM is fully loaded - only in browser
if (isBrowser) {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    // Get references to elements
    mainContentWrapper = document.querySelector('.content-wrapper');
    themeToggleGroup = document.querySelector('.theme-toggle-group');
    hamburgerMenu = document.querySelector('.sidebar-toggle');
    sizeControls = document.querySelector('.size-controls');
    previewBtn = document.querySelector('.preview-btn');
    randomizeStatsBtn = document.querySelector('.modern-btn.labeled-btn.tooltip-btn');
    platformToggle = document.querySelector('.platform-toggle-section');
    tweetWrapper = document.getElementById('tweet-wrapper');
    xWrapper = document.getElementById('x-wrapper');
    tweetPreview = document.getElementById('tweet-preview');
    xPreview = document.getElementById('x-preview');
    
    // Create mobile container
    createMobileContainer();
    
    // Store original positions
    storeOriginalPositions();
    
    // Initial layout adjustment
    handleLayoutChange();
    
    // Listen for window resize events
    window.addEventListener('resize', debounce(handleLayoutChange, 250));

    // Add platform toggle listeners
    setupPlatformToggle();
    
    // Initialize theme-aware styles
    initializeThemeStyles();
    
    // Listen for theme changes
    document.addEventListener('themeChanged', updateThemeStyles);

    // Ensure input container styles are applied on load
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateInputStyles(currentTheme === 'dark' || currentTheme === 'dim');
  });
}

/**
 * Setup platform toggle functionality
 */
function setupPlatformToggle() {
  // Use event delegation for platform toggle
  document.addEventListener('change', (e) => {
    // Check if the change event is from a platform toggle radio button
    if (e.target.name === 'platform-toggle') {
      const platform = e.target.value;
      updatePlatformView(platform);
    }
  });
  
  // Ensure initial state is correct
  const currentPlatform = document.querySelector('input[name="platform-toggle"]:checked')?.value || 'twitter';
  updatePlatformView(currentPlatform);
  
  // Apply initial toggle position
  updateTogglePosition(currentPlatform);
}

/**
 * Update the platform view
 */
function updatePlatformView(platform) {
  if (!tweetPreview || !xPreview) return;

  const appContainer = document.querySelector('.app-container');
  if (!appContainer) return;
  
  // Update platform state
  appContainer.setAttribute('data-platform', platform);
  localStorage.setItem('platform', platform);
  
  // Update toggle position for animation
  updateTogglePosition(platform);

  // Ensure both containers have the same positioning and dimensions before transitioning
  if (tweetPreview && xPreview) {
    // Set the same height to prevent layout shifts
    const activeContainer = platform === 'twitter' ? tweetPreview : xPreview;
    const inactiveContainer = platform === 'twitter' ? xPreview : tweetPreview;
    
    // Set active state for shadow effect
    activeContainer.setAttribute('data-active', 'true');
    inactiveContainer.removeAttribute('data-active');
    
    // Ensure both containers are in the DOM and visible for measurement
    inactiveContainer.style.opacity = '0';
    inactiveContainer.style.display = 'block';
    inactiveContainer.style.position = 'absolute';
    
    // Apply absolute positioning to both containers to prevent layout shifts
    activeContainer.style.position = 'relative';
    activeContainer.style.zIndex = '2';
    inactiveContainer.style.zIndex = '1';
    
    // Set the same height, width and position properties
    if (activeContainer.offsetHeight) {
      inactiveContainer.style.height = `${activeContainer.offsetHeight}px`;
      inactiveContainer.style.width = `${activeContainer.offsetWidth}px`;
      inactiveContainer.style.top = '0';
      inactiveContainer.style.left = '0';
    }
  }

  // Toggle preview visibility with smooth transition
  if (platform === 'twitter') {
    // Make sure we're working with the correct DOM elements
    if (tweetPreview.id === 'tweet-preview') {
      tweetPreview.style.display = 'block';
      // Use a small delay to ensure display:block has taken effect
      setTimeout(() => {
        tweetPreview.style.opacity = '1';
        tweetPreview.style.transform = 'translateY(0)';
      }, 10);
    }
    if (xPreview.id === 'x-preview') {
      xPreview.style.opacity = '0';
      xPreview.style.transform = 'translateY(10px)';
      setTimeout(() => {
        xPreview.style.display = 'none';
        // Reset the transform after it's hidden
        setTimeout(() => {
          xPreview.style.transform = 'translateY(0)';
        }, 50);
      }, 300);
    }
  } else {
    // Make sure we're working with the correct DOM elements
    if (xPreview.id === 'x-preview') {
      xPreview.style.display = 'block';
      // Use a small delay to ensure display:block has taken effect
      setTimeout(() => {
        xPreview.style.opacity = '1';
        xPreview.style.transform = 'translateY(0)';
      }, 10);
    }
    if (tweetPreview.id === 'tweet-preview') {
      tweetPreview.style.opacity = '0';
      tweetPreview.style.transform = 'translateY(10px)';
      setTimeout(() => {
        tweetPreview.style.display = 'none';
        // Reset the transform after it's hidden
        setTimeout(() => {
          tweetPreview.style.transform = 'translateY(0)';
        }, 50);
      }, 300);
    }
  }
  
  // Ensure the correct content is shown inside mobile container
  if (mobileContainer && mobileContainer.style.display === 'block') {
    const contentSection = mobileContainer.querySelector('.mobile-content-section');
    if (contentSection) {
      // Make sure both wrappers are available in the content section
      if (tweetWrapper && !contentSection.contains(tweetWrapper)) {
        contentSection.appendChild(tweetWrapper);
      }
      if (xWrapper && !contentSection.contains(xWrapper)) {
        contentSection.appendChild(xWrapper);
      }
    }
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
 * Create mobile container for reorganized elements
 */
function createMobileContainer() {
  mobileContainer = document.createElement('div');
  mobileContainer.className = 'mobile-layout-container';
  mobileContainer.style.display = 'none';
  
  // Create sections for organized layout
  const topSection = document.createElement('div');
  topSection.className = 'mobile-top-section';
  
  const controlsSection = document.createElement('div');
  controlsSection.className = 'mobile-controls-section';
  
  const contentSection = document.createElement('div');
  contentSection.className = 'mobile-content-section';
  
  const bottomSection = document.createElement('div');
  bottomSection.className = 'mobile-bottom-section';
  
  mobileContainer.appendChild(topSection);
  mobileContainer.appendChild(controlsSection);
  mobileContainer.appendChild(contentSection);
  mobileContainer.appendChild(bottomSection);
  
  // Store the original content
  if (mainContentWrapper) {
    originalPositions.mainContent = {
      content: mainContentWrapper.innerHTML
    };
  }
}

/**
 * Store the original positions and parent elements
 */
function storeOriginalPositions() {
  const elements = {
    themeToggle: themeToggleGroup,
    hamburger: hamburgerMenu,
    sizeControls: sizeControls,
    previewBtn: previewBtn,
    randomizeBtn: randomizeStatsBtn,
    platformToggle: platformToggle,
    tweetWrapper: tweetWrapper,
    xWrapper: xWrapper
  };
  
  for (const [key, element] of Object.entries(elements)) {
    if (element) {
      originalPositions[key] = {
        parent: element.parentElement,
        nextSibling: element.nextElementSibling,
        styles: {
          position: element.style.position,
          top: element.style.top,
          right: element.style.right,
          left: element.style.left,
          bottom: element.style.bottom,
          transform: element.style.transform,
          width: element.style.width,
          margin: element.style.margin,
          padding: element.style.padding,
          zIndex: element.style.zIndex,
          display: element.style.display
        }
      };
    }
  }
}

/**
 * Apply mobile-specific layout
 */
function applyMobileLayout() {
  if (!mobileContainer || !mainContentWrapper) return;
  
  const topSection = mobileContainer.querySelector('.mobile-top-section');
  const controlsSection = mobileContainer.querySelector('.mobile-controls-section');
  const contentSection = mobileContainer.querySelector('.mobile-content-section');
  const bottomSection = mobileContainer.querySelector('.mobile-bottom-section');
  
  // Clear previous content
  [topSection, controlsSection, contentSection, bottomSection].forEach(section => {
    section.innerHTML = '';
  });
  
  // 1. Top section: Hamburger and Theme Toggle
  if (hamburgerMenu) {
    hamburgerMenu.style.position = 'fixed';
    hamburgerMenu.style.top = '5px';
    hamburgerMenu.style.left = '5px';
    hamburgerMenu.style.zIndex = '10';
    topSection.appendChild(hamburgerMenu);
  }
  
  if (themeToggleGroup) {
    themeToggleGroup.style.position = 'fixed';
    themeToggleGroup.style.top = '5px';
    themeToggleGroup.style.right = '5px';
    themeToggleGroup.style.zIndex = '10';
    topSection.appendChild(themeToggleGroup);
  }
  
  // 2. Controls section: Size controls and Preview button
  if (sizeControls) {
    sizeControls.style.margin = '40px 0 10px';
    controlsSection.appendChild(sizeControls);
  }
  
  if (previewBtn) {
    previewBtn.style.margin = '0 0 10px 5px';
    controlsSection.appendChild(previewBtn);
  }
  
  // 3. Content section: Tweet wrapper and X wrapper
  if (tweetWrapper) {
    contentSection.appendChild(tweetWrapper);
  }
  
  if (xWrapper) {
    contentSection.appendChild(xWrapper);
  }
  
  // 4. Bottom section: Randomize stats and Platform toggle
  if (randomizeStatsBtn) {
    randomizeStatsBtn.style.margin = '10px auto';
    randomizeStatsBtn.style.display = 'block';
    bottomSection.appendChild(randomizeStatsBtn);
  }
  
  if (platformToggle) {
    platformToggle.style.margin = '10px 0';
    bottomSection.appendChild(platformToggle);
  }
  
  // Replace content wrapper's content with mobile container
  mainContentWrapper.innerHTML = '';
  mainContentWrapper.appendChild(mobileContainer);
  mobileContainer.style.display = 'block';

  // Ensure correct platform view is shown
  const currentPlatform = document.querySelector('input[name="platform-toggle"]:checked')?.value || 'twitter';
  updatePlatformView(currentPlatform);

  // Ensure input styles are applied
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateInputStyles(currentTheme === 'dark' || currentTheme === 'dim');
}

/**
 * Restore desktop layout
 */
function restoreDesktopLayout() {
  if (!mobileContainer || !mainContentWrapper) return;
  
  // Restore original content wrapper content
  if (originalPositions.mainContent) {
    mainContentWrapper.innerHTML = originalPositions.mainContent.content;
  }
  
  // Restore all elements to their original positions and styles
  for (const [key, data] of Object.entries(originalPositions)) {
    if (key === 'mainContent') continue; // Skip the main content entry
    const element = document.querySelector(`.${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
    if (element && data.parent) {
      // Restore position in DOM
      if (data.nextSibling) {
        data.parent.insertBefore(element, data.nextSibling);
      } else {
        data.parent.appendChild(element);
      }
      
      // Restore original styles
      Object.assign(element.style, data.styles);
    }
  }
}

/**
 * Handle layout changes based on screen width
 */
function handleLayoutChange() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    applyMobileLayout();
  } else {
    restoreDesktopLayout();
  }
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Initialize theme-aware styles for inputs and controls
 */
function initializeThemeStyles() {
  // Check if dark theme is active
  const isDarkTheme = document.body.classList.contains('dark-theme') || 
                     document.documentElement.getAttribute('data-theme') === 'dark' ||
                     document.querySelector('input[name="theme"][value="dark"]')?.checked ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  updateInputStyles(isDarkTheme);
  
  // Also listen for theme toggle clicks
  const themeToggles = document.querySelectorAll('input[name="theme"]');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const isDark = e.target.value === 'dark' || e.target.value === 'dim';
      updateInputStyles(isDark);
    });
  });
}

/**
 * Update styles based on current theme
 */
function updateThemeStyles(e) {
  const isDark = e.detail?.theme === 'dark' || e.detail?.theme === 'dim';
  updateInputStyles(isDark);
}

/**
 * Update input styles based on theme
 */
function updateInputStyles(isDark) {
  const inputs = document.querySelectorAll('.field-input');
  const inputContainers = document.querySelectorAll('.input-container');
  
  if (isDark) {
    inputs.forEach(input => {
      input.style.color = '#e0e0e0';
      input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    inputContainers.forEach(container => {
      container.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    });
  } else {
    inputs.forEach(input => {
      input.style.color = '';
      input.style.borderColor = '';
    });
    
    inputContainers.forEach(container => {
      container.style.backgroundColor = '';
    });
  }
}

// Add styles for mobile container
const style = document.createElement('style');
style.textContent = `
  .mobile-layout-container {
    position: relative;
    padding: 10px;
    min-height: 100vh;
    background: var(--bg-primary);
  }
  

  
  .mobile-controls-section {
    padding: 0 10px;
    margin-top: 60px;
  }
  
  .mobile-content-section {
    padding: 20px 10px;
    position: relative;
  }
  
  .mobile-bottom-section {
    padding: 10px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .content-wrapper {
      margin: 0;
      padding: 0;
    }
  }
  
  /* Enhanced transitions for platform toggle */
  #tweet-preview,
  #x-preview {
    transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    will-change: opacity, transform;
  }
  
  /* Add shadow effect during transitions */
  #tweet-preview[data-active="true"],
  #x-preview[data-active="true"] {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  [data-theme="dark"] #tweet-preview[data-active="true"],
  [data-theme="dark"] #x-preview[data-active="true"] {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  /* Improved switch styling */
  .platform-switch {
    overflow: hidden;
    position: relative;
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
  
  .x-option input:checked ~ * {
    position: relative;
    z-index: 1;
  }
  
  /* Custom input styling for dark mode */
  @media (prefers-color-scheme: dark) {
    .input-container {
      background-color: rgba(255, 255, 255, 0.08);
    }
    
    .field-input {
      color: #e0e0e0;
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .field-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  
  /* Reduce spacing */
  .size-controls {
    gap: 0.5rem;
  }
  
  .dimension-field {
    gap: 0.15rem;
  }
  
  /* Improve Twitter and X post container appearance */
  .tweet-container, 
  .x-container {
    transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
  }
  
  .tweet-container:hover,
  .x-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;
document.head.appendChild(style);

// Export functions for potential use in other modules
export {
  handleLayoutChange,
  applyMobileLayout,
  restoreDesktopLayout
};