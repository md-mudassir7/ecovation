// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Initialize all features
  initTabSystem();
  initScrollReveal();
  initNavbarScroll();
  initMobileMenu();
  initBackToTop();
  initImageGalleries();
  initServiceButtons();
  addRevealClasses();
});

// Tab System
function initTabSystem() {
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');
  const footerLinks = document.querySelectorAll('.footer-links a[data-tab]');
  const allLinks = [...navLinks, ...footerLinks];
  
  allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetTab = this.getAttribute('data-tab');
      if (!targetTab) return;
      
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show target tab
      const targetTabContent = document.getElementById(`${targetTab}-tab`);
      if (targetTabContent) {
        targetTabContent.classList.add('active');
      }
      
      // Update navigation active states
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Add active class to current nav link
      const currentNavLink = document.querySelector(`.nav-link[data-tab="${targetTab}"]`);
      if (currentNavLink) {
        currentNavLink.classList.add('active');
      }
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const menuToggle = document.getElementById('mobile-menu');
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        resetHamburgerIcon();
      }
      
      // Re-initialize animations for new content
      setTimeout(() => {
        initScrollReveal();
      }, 100);
    });
  });
}

// Service Button Functionality
function initServiceButtons() {
  const serviceButtons = document.querySelectorAll('.service-btn');
  
  serviceButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetTab = this.getAttribute('data-tab');
      if (targetTab) {
        // Trigger tab switch
        const tabEvent = new Event('click');
        const targetNavLink = document.querySelector(`.nav-link[data-tab="${targetTab}"]`);
        if (targetNavLink) {
          targetNavLink.dispatchEvent(tabEvent);
        }
      }
    });
  });
}

// Image Gallery functionality
function initImageGalleries() {
  const galleries = document.querySelectorAll('.image-gallery');
  
  galleries.forEach(gallery => {
    const mainImage = gallery.querySelector('.main-image');
    const thumbnails = gallery.querySelectorAll('.thumbnail');
    
    if (!mainImage || !thumbnails.length) return;
    
    // Set first thumbnail as active
    thumbnails[0].classList.add('active-thumb');
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Update main image
        const newSrc = this.src;
        const newAlt = this.alt;
        
        mainImage.style.opacity = '0';
        setTimeout(() => {
          mainImage.src = newSrc;
          mainImage.alt = newAlt;
          mainImage.style.opacity = '1';
        }, 150);
        
        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active-thumb'));
        this.classList.add('active-thumb');
      });
    });
  });
}

// Type image change functionality
function changeTypeImage(thumbnail) {
  const container = thumbnail.closest('.type-card');
  const mainImage = container.querySelector('.type-main-image');
  
  if (mainImage && thumbnail.src) {
    // Add loading effect
    mainImage.style.opacity = '0.3';
    mainImage.style.transform = 'scale(0.95)';
    
    // Create a new image to preload
    const newImg = new Image();
    newImg.onload = function() {
      mainImage.src = this.src;
      mainImage.alt = thumbnail.alt;
      mainImage.style.opacity = '1';
      mainImage.style.transform = 'scale(1)';
    };
    
    newImg.onerror = function() {
      // If image fails to load, restore original state
      mainImage.style.opacity = '1';
      mainImage.style.transform = 'scale(1)';
      console.log('Failed to load image:', thumbnail.src);
    };
    
    newImg.src = thumbnail.src;
  }
  
  // Update active thumbnail
  const thumbnails = container.querySelectorAll('.type-thumb');
  thumbnails.forEach(thumb => thumb.classList.remove('active-thumb'));
  thumbnail.classList.add('active-thumb');
}

// Initialize all scroll reveal animations
function initScrollReveal() {
  const fadeElements = document.querySelectorAll('.fade-in');
  const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-down, .reveal-zoom');
  
  // Initial check
  checkReveal(fadeElements);
  checkReveal(revealElements);
  
  // Check on scroll (with throttling for better performance)
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        checkReveal(fadeElements);
        checkReveal(revealElements);
        scrollTimeout = null;
      }, 10);
    }
  });
  
  // Check on resize
  window.addEventListener('resize', function() {
    checkReveal(fadeElements);
    checkReveal(revealElements);
  });
}

// Check if elements should be revealed
function checkReveal(elements) {
  elements.forEach(element => {
    // Skip if already active
    if (element.classList.contains('active')) return;
    
    // Skip client logos to prevent animation issues
    if (element.closest('.client-logos') || element.classList.contains('client-logo')) {
      element.classList.add('active');
      return;
    }
    
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}

// Add reveal classes to elements based on their position
function addRevealClasses() {
  // About section elements
  const aboutImage = document.querySelector('.about-image');
  const aboutText = document.querySelector('.about-text');
  if (aboutImage) aboutImage.classList.add('reveal-left');
  if (aboutText) aboutText.classList.add('reveal-right');
  
  // Mission and Vision boxes
  const missionVision = document.querySelectorAll('.mission, .vision');
  missionVision.forEach((element, index) => {
    if (index % 2 === 0) {
      element.classList.add('reveal-left');
    } else {
      element.classList.add('reveal-right');
    }
  });
  
  // Feature cards with alternating animations
  const featureCards = document.querySelectorAll('.service-card, .type-card');
  featureCards.forEach((card, index) => {
    if (index % 3 === 0) {
      card.classList.add('reveal-left');
    } else if (index % 3 === 1) {
      card.classList.add('reveal-up');
    } else {
      card.classList.add('reveal-right');
    }
  });
  
  // Content grid animations
  const contentTexts = document.querySelectorAll('.content-text');
  const contentImages = document.querySelectorAll('.content-images');
  contentTexts.forEach(text => text.classList.add('reveal-left'));
  contentImages.forEach(images => images.classList.add('reveal-right'));
}

// Navbar scroll behavior
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  
  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle hamburger animation
    if (menuToggle.classList.contains('active')) {
      animateHamburger();
    } else {
      resetHamburgerIcon();
    }
  });
}

function animateHamburger() {
  const bars = document.querySelectorAll('.bar');
  bars[0].style.transform = 'translateY(8px) rotate(45deg)';
  bars[1].style.opacity = '0';
  bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
}

function resetHamburgerIcon() {
  const bars = document.querySelectorAll('.bar');
  bars[0].style.transform = 'none';
  bars[1].style.opacity = '1';
  bars[2].style.transform = 'none';
}

// Back to top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });
  
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
  if (e.target.matches('a[href^="#"]')) {
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Add loading animation to buttons
document.addEventListener('click', function(e) {
  if (e.target.matches('.btn')) {
    const btn = e.target;
    const originalText = btn.textContent;
    
    btn.style.position = 'relative';
    btn.style.color = 'transparent';
    
    const loader = document.createElement('div');
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;
    
    // Add spinner keyframes if not exists
    if (!document.querySelector('#spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'spinner-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    btn.appendChild(loader);
    
    setTimeout(() => {
      if (btn.contains(loader)) {
        btn.removeChild(loader);
        btn.style.color = '';
      }
    }, 1000);
  }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(function() {
  // Performance-optimized scroll handlers can be added here
}, 16)); // ~60fps

// Add CSS for animations
const animationStyles = `
  .reveal-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.8s ease;
  }
  
  .reveal-right {
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.8s ease;
  }
  
  .reveal-up {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease;
  }
  
  .reveal-down {
    opacity: 0;
    transform: translateY(-50px);
    transition: all 0.8s ease;
  }
  
  .reveal-zoom {
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.8s ease;
  }
  
  .reveal-left.active,
  .reveal-right.active,
  .reveal-up.active,
  .reveal-down.active,
  .reveal-zoom.active {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  
  .active-thumb {
    opacity: 1 !important;
    border: 2px solid var(--secondary) !important;
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize thumbnails when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add error handling for images
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    img.addEventListener('error', function() {
      // If local image fails, try to use a fallback
      if (this.src.includes('images/Accoustic/')) {
        console.log('Image failed to load:', this.src);
        // You could add a default placeholder here if needed
        this.style.opacity = '0.5';
        this.style.border = '2px dashed #ccc';
      }
    });
    
    img.addEventListener('load', function() {
      this.style.opacity = '1';
      this.style.border = 'none';
    });
  });
});

// Legacy support for existing image gallery function
function showImage(el) {
  const container = el.closest(".container") || el.closest(".image-gallery") || el.closest(".type-card");
  const main = container.querySelector("img[id^='mainPreview']") || 
               container.querySelector(".main-image") ||
               container.querySelector(".type-main-image");
  const thumbnails = container.querySelectorAll(".thumbnail-gallery img") ||
                    container.querySelectorAll(".thumbnail") ||
                    container.querySelectorAll(".type-thumb");
  
  if (main && el.src) {
    // Add smooth transition effect
    main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    main.style.opacity = '0.3';
    main.style.transform = 'scale(0.95)';
    
    // Preload image before switching
    const newImg = new Image();
    newImg.onload = function() {
      main.src = this.src;
      main.alt = el.alt || '';
      main.style.opacity = '1';
      main.style.transform = 'scale(1)';
    };
    
    newImg.onerror = function() {
      // Restore original state if image fails
      main.style.opacity = '1';
      main.style.transform = 'scale(1)';
      console.log('Failed to load image:', el.src);
    };
    
    newImg.src = el.src;
  }
  
  if (thumbnails.length) {
    thumbnails.forEach(img => img.classList.remove("active-thumb"));
    el.classList.add("active-thumb");
  }
  }
  