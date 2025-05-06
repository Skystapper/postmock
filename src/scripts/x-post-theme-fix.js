/**
 * X Post Theme Fixer
 * This script ensures X post containers correctly apply themes
 * Simplified version that only handles themes, not visibility
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing X post theme handler");
  
  // Apply initial theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  updateXContainers(savedTheme);
  
  // Listen for theme changes
  document.addEventListener('change', (e) => {
    if (e.target.name === 'theme' || e.target.name === 'mobile-theme') {
      const theme = e.target.value;
      updateXContainers(theme);
    }
  });
  
  // Custom event listener for theme changes from other scripts
  document.addEventListener('themeChanged', (e) => {
    if (e.detail?.theme) {
      updateXContainers(e.detail.theme);
    }
  });
});

/**
 * Update all X post containers with the selected theme
 * This function ONLY handles theme attribute, NOT visibility
 */
function updateXContainers(theme) {
  console.log("Updating X containers with theme:", theme);
  
  // Find all x-container elements
  const xContainers = document.querySelectorAll('.x-container');
  if (xContainers.length > 0) {
    console.log(`Found ${xContainers.length} X containers to update`);
    xContainers.forEach(container => {
      container.setAttribute('data-theme', theme);
    });
  }
  
  // Handle X preview containers that wrap the x-container
  const xWrappers = [
    document.getElementById('x-preview'),
    document.getElementById('mobile-x-preview')
  ];
  
  xWrappers.forEach(wrapper => {
    if (wrapper) {
      // Try to find nested x-container
      const nestedContainer = wrapper.querySelector('.x-container');
      if (nestedContainer) {
        nestedContainer.setAttribute('data-theme', theme);
      }
    }
  });
} 