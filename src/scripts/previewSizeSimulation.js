/**
 * Preview Size Simulation Script
 * 
 * This script handles screen size simulation in the preview modal,
 * allowing users to see components at specific screen sizes regardless
 * of their actual device screen size.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the viewport size simulation from any stored user preferences
  initViewportSizes();
  
  // Set up dimension change listeners for the Twitter tab
  setupDimensionListeners();
  
  // Add listener for the preview modal opening
  addPreviewModalListener();
});

/**
 * Add a listener for when the preview modal opens
 */
function addPreviewModalListener() {
  // Create a MutationObserver to watch for the preview modal becoming visible
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.style.display === 'block') {
        // Modal has been shown
        optimizePreviewContent();
      }
    });
  });
  
  // Start observing the preview modal
  const previewModal = document.getElementById('previewModal');
  if (previewModal) {
    observer.observe(previewModal, { attributes: true, attributeFilter: ['style'] });
  }
}

/**
 * Optimize the content inside the preview modal
 */
function optimizePreviewContent() {
  // Get the viewport frame and content container
  const frame = document.getElementById('previewViewportFrame');
  if (!frame) return;
  
  // Find the tweet or X container
  const tweetContainer = frame.querySelector('.tweet-container');
  const xContainer = frame.querySelector('.x-container-wrapper') || frame.querySelector('.x-container');
  const contentContainer = tweetContainer || xContainer;
  
  if (contentContainer) {
    // Ensure content is properly sized
    contentContainer.style.width = contentContainer.clientWidth + 'px';
    contentContainer.style.margin = '0 auto';
    
    // Make sure the content is visible
    setTimeout(() => {
      // Force a repaint after a short delay
      if (window.setViewportSize && window.currentViewport) {
        window.setViewportSize(window.currentViewport);
      }
    }, 100);
  }
}

/**
 * Initialize viewport sizes from storage or defaults
 */
function initViewportSizes() {
  // Define default viewport sizes
  if (!window.viewportSizes) {
    window.viewportSizes = {
      desktop: { width: 1440, height: 900 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 667 },
      custom: { width: 1200, height: 675 }
    };
  }
  
  // Get user-defined dimensions from inputs
  const widthInput = document.getElementById('image-width');
  const heightInput = document.getElementById('image-height');
  
  if (widthInput && heightInput) {
    const userWidth = parseInt(widthInput.value) || 1200;
    const userHeight = parseInt(heightInput.value) || 675;
    
    // Update custom viewport with user dimensions
    window.viewportSizes.custom = { 
      width: userWidth, 
      height: userHeight 
    };
  }
}

/**
 * Set up event listeners for dimension changes in the Twitter tab
 */
function setupDimensionListeners() {
  // Create function to handle dimension changes and update viewport simulation
  function handleDimensionChange() {
    const widthInput = document.getElementById('image-width');
    const heightInput = document.getElementById('image-height');
    
    if (widthInput && heightInput) {
      const userWidth = parseInt(widthInput.value) || 1200;
      const userHeight = parseInt(heightInput.value) || 675;
      
      // Update custom viewport with user dimensions
      if (window.viewportSizes) {
        window.viewportSizes.custom = { 
          width: userWidth, 
          height: userHeight 
        };
      }
    }
  }
  
  // Make sure a global adjustDimension function exists if it doesn't already
  if (typeof window.adjustDimension !== 'function') {
    window.adjustDimension = function(dimension, change) {
      const input = document.getElementById(`image-${dimension}`);
      if (!input) return;
      
      let value = parseInt(input.value) || (dimension === 'width' ? 1200 : 675);
      
      // Adjust by 10px for each click, or by 1px if holding shift
      const step = window.event && window.event.shiftKey ? 1 : 10;
      value += (change * step);
      
      // Validate min/max
      value = Math.max(300, Math.min(value, 4096));
      
      // Update input
      input.value = value.toString();
      
      // Trigger change event
      input.dispatchEvent(new Event('change'));
      
      // Also update the mobile input if it exists
      const mobileInput = document.getElementById(`mobile-image-${dimension}`);
      if (mobileInput) {
        mobileInput.value = value.toString();
        mobileInput.dispatchEvent(new Event('change'));
      }
    };
  }
  
  // Implement validateDimension function if it doesn't exist
  if (typeof window.validateDimension !== 'function') {
    window.validateDimension = function(input, min, max) {
      if (!input) return;
      
      let value = parseInt(input.value) || (input.id.includes('width') ? 1200 : 675);
      
      // Validate min/max
      value = Math.max(min, Math.min(value, max));
      
      // Update input
      input.value = value.toString();
      
      // If this is a desktop input, update mobile input too
      if (!input.id.includes('mobile')) {
        const mobileInput = document.getElementById(`mobile-${input.id}`);
        if (mobileInput) {
          mobileInput.value = value.toString();
          mobileInput.dispatchEvent(new Event('change'));
        }
      }
      
      // Update viewport sizes
      handleDimensionChange();
    };
  }
  
  // Implement resetSize function if it doesn't exist
  if (typeof window.resetSize !== 'function') {
    window.resetSize = function() {
      const defaultWidth = window.innerWidth < 768 ? 360 : 1200;
      const defaultHeight = window.innerWidth < 768 ? 640 : 675;
      
      // Update desktop inputs
      const widthInput = document.getElementById('image-width');
      const heightInput = document.getElementById('image-height');
      
      if (widthInput) {
        widthInput.value = defaultWidth.toString();
        widthInput.dispatchEvent(new Event('change'));
      }
      
      if (heightInput) {
        heightInput.value = defaultHeight.toString();
        heightInput.dispatchEvent(new Event('change'));
      }
      
      // Update mobile inputs
      const mobileWidthInput = document.getElementById('mobile-image-width');
      const mobileHeightInput = document.getElementById('mobile-image-height');
      
      if (mobileWidthInput) {
        mobileWidthInput.value = defaultWidth.toString();
        mobileWidthInput.dispatchEvent(new Event('change'));
      }
      
      if (mobileHeightInput) {
        mobileHeightInput.value = defaultHeight.toString();
        mobileHeightInput.dispatchEvent(new Event('change'));
      }
      
      // Update viewport sizes
      handleDimensionChange();
    };
  }
  
  // Attach listeners to dimension inputs
  const widthInput = document.getElementById('image-width');
  const heightInput = document.getElementById('image-height');
  
  if (widthInput) {
    widthInput.addEventListener('change', handleDimensionChange);
  }
  
  if (heightInput) {
    heightInput.addEventListener('change', handleDimensionChange);
  }
  
  // Also attach to mobile inputs
  const mobileWidthInput = document.getElementById('mobile-image-width');
  const mobileHeightInput = document.getElementById('mobile-image-height');
  
  if (mobileWidthInput) {
    mobileWidthInput.addEventListener('change', handleDimensionChange);
  }
  
  if (mobileHeightInput) {
    mobileHeightInput.addEventListener('change', handleDimensionChange);
  }
} 