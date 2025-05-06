/**
 * CSS-based Twitter Layout Fixer
 * This script avoids DOM manipulation and relies on CSS for layout changes
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing CSS-based layout manager");
  
  // Set platform from localStorage
  initializePlatform();
  
  // Set theme from localStorage
  initializeTheme();
  
  // Set up toggle listeners
  setupToggleListeners();
  
  // Add resize listener for responsive layouts
  window.addEventListener('resize', debounce(handleResize, 250));
});

// Helper function to debounce events
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Initialize platform selection from localStorage
function initializePlatform() {
  const savedPlatform = localStorage.getItem('platform') || 'twitter';
  
  // Set the platform attribute on body to control visibility via CSS
  document.body.setAttribute('data-platform', savedPlatform);
  
  // Select the appropriate toggle
  const platformToggle = document.querySelector(`input[name="platform-toggle"][value="${savedPlatform}"]`);
  if (platformToggle) {
    platformToggle.checked = true;
  }
  
  const mobilePlatformToggle = document.querySelector(`input[name="mobile-platform-toggle"][value="${savedPlatform}"]`);
  if (mobilePlatformToggle) {
    mobilePlatformToggle.checked = true;
  }
  
  // Update preview buttons with correct platform
  updatePreviewButtons(savedPlatform);
  
  // Update toggle position for animation
  updateTogglePosition(savedPlatform);
}

// Initialize theme selection from localStorage
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Select the appropriate toggle
  const themeToggle = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
  if (themeToggle) {
    themeToggle.checked = true;
  }
  
  const mobileThemeToggle = document.querySelector(`input[name="mobile-theme"][value="${savedTheme}"]`);
  if (mobileThemeToggle) {
    mobileThemeToggle.checked = true;
  }
  
  // Update tweet and X containers
  updateTheme(savedTheme);
}

// Set up toggle listeners for platform and theme
function setupToggleListeners() {
  // Platform toggle listeners
  document.querySelectorAll('input[name="platform-toggle"]').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const platform = this.value;
      
      // Store the selected platform
      localStorage.setItem('platform', platform);
      
      // Update body data attribute for CSS rules
      document.body.setAttribute('data-platform', platform);
      
      // Sync mobile toggles
      const mobilePlatformToggle = document.querySelector(`input[name="mobile-platform-toggle"][value="${platform}"]`);
      if (mobilePlatformToggle && !mobilePlatformToggle.checked) {
        mobilePlatformToggle.checked = true;
      }
      
      // Update toggle position styling
      updateTogglePosition(platform);
      
      // Update preview buttons
      updatePreviewButtons(platform);
    });
  });
  
  // Mobile platform toggle listeners
  document.querySelectorAll('input[name="mobile-platform-toggle"]').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const platform = this.value;
      
      // Store the selected platform
      localStorage.setItem('platform', platform);
      
      // Update body data attribute for CSS rules
      document.body.setAttribute('data-platform', platform);
      
      // Sync desktop toggles
      const desktopPlatformToggle = document.querySelector(`input[name="platform-toggle"][value="${platform}"]`);
      if (desktopPlatformToggle && !desktopPlatformToggle.checked) {
        desktopPlatformToggle.checked = true;
      }
      
      // Update toggle position styling
      updateTogglePosition(platform);
      
      // Update preview buttons
      updatePreviewButtons(platform);
    });
  });
  
  // Theme toggle listeners
  document.querySelectorAll('input[name="theme"]').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const theme = this.value;
      
      // Store the selected theme
      localStorage.setItem('theme', theme);
      
      // Sync mobile theme toggles
      const mobileThemeToggle = document.querySelector(`input[name="mobile-theme"][value="${theme}"]`);
      if (mobileThemeToggle && !mobileThemeToggle.checked) {
        mobileThemeToggle.checked = true;
      }
      
      // Update theme for tweet and X containers
      updateTheme(theme);
    });
  });
  
  // Mobile theme toggle listeners
  document.querySelectorAll('input[name="mobile-theme"]').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const theme = this.value;
      
      // Store the selected theme
      localStorage.setItem('theme', theme);
      
      // Sync desktop theme toggles
      const desktopThemeToggle = document.querySelector(`input[name="theme"][value="${theme}"]`);
      if (desktopThemeToggle && !desktopThemeToggle.checked) {
        desktopThemeToggle.checked = true;
      }
      
      // Update theme for tweet and X containers
      updateTheme(theme);
    });
  });
}

// Update preview buttons with the correct platform
function updatePreviewButtons(platform) {
  // Update all preview buttons with the current platform
  const previewButtons = document.querySelectorAll('.preview-btn');
  previewButtons.forEach(button => {
    const onclickAttr = button.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('showPreviewModal')) {
      button.setAttribute('onclick', `showPreviewModal('${platform}')`);
    }
  });
}

// Update toggle position for animation
function updateTogglePosition(platform) {
  const switches = document.querySelectorAll('.platform-switch');
  switches.forEach(switchEl => {
    if (platform === 'twitter') {
      switchEl.style.setProperty('--toggle-position', '0');
    } else {
      switchEl.style.setProperty('--toggle-position', '100%');
    }
  });
}

// Update theme for tweet and X containers
function updateTheme(theme) {
  // Desktop containers
  const tweetPreview = document.getElementById('tweet-preview');
  const xPreview = document.getElementById('x-preview');
  
    if (tweetPreview) {
    tweetPreview.setAttribute('data-theme', theme);
  }
  
  if (xPreview) {
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
  
  // For XPost component, find the x-container inside
  if (mobileXPreview) {
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

// Update the handleResize function to only maintain platform state
function handleResize() {
  // CSS media queries handle layout, just ensure platform state persists
  const currentPlatform = localStorage.getItem('platform') || 'twitter';
  document.body.setAttribute('data-platform', currentPlatform);
} 