// CV Website JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initActiveNavigation();
    initScrollToTop();
    initResponsiveNavigation();
});

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state immediately for better UX
                updateActiveNavLink(this);
            }
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(activeLink) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

/**
 * Initialize scroll-based active navigation highlighting - improved version
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    function updateActiveOnScroll() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        let currentSection = '';
        
        // Handle case when at the bottom of the page
        if (scrollPosition + windowHeight >= documentHeight - 10) {
            currentSection = sections[sections.length - 1].getAttribute('id');
        } else {
            // Find the section that's currently most visible
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });
        }
        
        // If no section is active and we're near the top, activate the first section
        if (!currentSection && scrollPosition < 200) {
            currentSection = sections[0].getAttribute('id');
        }
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Use throttled scroll events for better performance
    let isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial call
    updateActiveOnScroll();
}

/**
 * Initialize scroll to top functionality - improved styling
 */
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    function toggleScrollToTopBtn() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus on the first navigation link after scrolling to top
        setTimeout(() => {
            const firstNavLink = document.querySelector('.nav-link');
            if (firstNavLink) {
                firstNavLink.focus();
            }
        }, 500);
    });
    
    // Throttled scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(toggleScrollToTopBtn, 10);
    });
    
    // Initial call
    toggleScrollToTopBtn();
}

/**
 * Initialize responsive navigation
 */
function initResponsiveNavigation() {
    const header = document.querySelector('.header');
    const navList = document.querySelector('.nav-list');
    
    // Create mobile menu toggle button for very small screens
    if (window.innerWidth <= 480) {
        createMobileMenu();
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth <= 480 && !document.querySelector('.mobile-menu-toggle')) {
            createMobileMenu();
        } else if (window.innerWidth > 480 && document.querySelector('.mobile-menu-toggle')) {
            removeMobileMenu();
        }
    }, 250));
}

/**
 * Create mobile menu for very small screens
 */
function createMobileMenu() {
    const headerContent = document.querySelector('.header__content');
    const nav = document.querySelector('.header__nav');
    const navList = document.querySelector('.nav-list');
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.style.cssText = `
        display: block;
        background: var(--color-surface);
        border: 2px solid var(--color-primary);
        border-radius: var(--radius-base);
        font-size: 20px;
        color: var(--color-primary);
        cursor: pointer;
        padding: var(--space-8) var(--space-12);
        margin-top: var(--space-16);
        transition: all var(--duration-fast) var(--ease-standard);
    `;
    
    // Insert toggle button before nav
    headerContent.insertBefore(toggleBtn, nav);
    
    // Initially hide nav on mobile
    nav.style.display = 'none';
    
    // Toggle functionality
    let isMenuOpen = false;
    toggleBtn.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            nav.style.display = 'block';
            navList.style.flexDirection = 'column';
            navList.style.width = '100%';
            navList.style.textAlign = 'center';
            navList.style.gap = 'var(--space-8)';
            navList.style.marginTop = 'var(--space-16)';
            toggleBtn.innerHTML = '✕';
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.style.backgroundColor = 'var(--color-primary)';
            toggleBtn.style.color = 'var(--color-btn-primary-text)';
        } else {
            nav.style.display = 'none';
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.style.backgroundColor = 'var(--color-surface)';
            toggleBtn.style.color = 'var(--color-primary)';
        }
    });
    
    // Close menu when nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            nav.style.display = 'none';
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.style.backgroundColor = 'var(--color-surface)';
            toggleBtn.style.color = 'var(--color-primary)';
            isMenuOpen = false;
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
            nav.style.display = 'none';
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.style.backgroundColor = 'var(--color-surface)';
            toggleBtn.style.color = 'var(--color-primary)';
            isMenuOpen = false;
        }
    });
}

/**
 * Remove mobile menu for larger screens
 */
function removeMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.header__nav');
    const navList = document.querySelector('.nav-list');
    
    if (toggleBtn) {
        toggleBtn.remove();
    }
    
    // Reset nav styles
    nav.style.display = '';
    navList.style.flexDirection = '';
    navList.style.width = '';
    navList.style.textAlign = '';
    navList.style.gap = '';
    navList.style.marginTop = '';
}

/**
 * Initialize intersection observer for animations
 */
function initAnimations() {
    // Only run animations if user doesn't prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    const animatedElements = document.querySelectorAll('.card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Initialize theme toggle (optional - for future enhancement)
 */
function initThemeToggle() {
    // This could be enhanced to add theme switching functionality
    // For now, the site uses CSS prefers-color-scheme
    
    // Detect system theme preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for changes in system theme
    prefersDarkScheme.addEventListener('change', function(e) {
        // Could add custom handling here if needed
        console.log('System theme changed to:', e.matches ? 'dark' : 'light');
    });
}

/**
 * Initialize print functionality
 */
function initPrintFeatures() {
    // Add print button functionality if needed
    window.addEventListener('beforeprint', function() {
        // Expand all collapsed sections for print
        document.querySelectorAll('.card').forEach(card => {
            card.style.pageBreakInside = 'avoid';
        });
        
        // Ensure all content is visible for print
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.header__nav');
        if (mobileToggle && nav) {
            nav.style.display = 'block';
        }
    });
    
    window.addEventListener('afterprint', function() {
        // Reset any print-specific changes
        console.log('Print job completed');
        
        // Reset mobile navigation if needed
        if (window.innerWidth <= 480) {
            const nav = document.querySelector('.header__nav');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (nav && mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'false') {
                nav.style.display = 'none';
            }
        }
    });
}

/**
 * Initialize performance optimizations
 */
function initPerformanceOptimizations() {
    // Lazy load images if any were added
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preconnect to external domains for performance
    const linkPreconnect = document.createElement('link');
    linkPreconnect.rel = 'preconnect';
    linkPreconnect.href = 'https://orcid.org';
    document.head.appendChild(linkPreconnect);
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        padding: 8px 12px;
        text-decoration: none;
        border-radius: var(--radius-base);
        z-index: 1001;
        transition: top 0.3s ease;
        font-weight: var(--font-weight-medium);
    `;
    
    // Show skip link on focus
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main';
        main.setAttribute('role', 'main');
    }
    
    // Improve keyboard navigation for cards
    document.querySelectorAll('.card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Focus on first focusable element within the card
                const focusable = card.querySelector('a, button, [tabindex]');
                if (focusable) {
                    focusable.focus();
                }
            }
        });
    });
}

/**
 * Initialize smooth section transitions
 */
function initSectionTransitions() {
    // Add smooth transitions between sections when scrolling
    const sections = document.querySelectorAll('.section');
    
    function handleSectionTransition() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + sectionHeight / 2;
            
            // Add subtle parallax effect for non-essential content
            // if (index % 2 === 0) {
            //     section.style.transform = `translateY(${parallax * 0.1}px)`;
            // }
        });
    }
    
    // Only add parallax if user doesn't prefer reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', debounce(handleSectionTransition, 10));
    }
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initThemeToggle();
    initPrintFeatures();
    initPerformanceOptimizations();
    initAccessibility();
    initSectionTransitions();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any animations or heavy operations
        console.log('Page hidden - pausing operations');
    } else {
        // Page is visible, resume operations
        console.log('Page visible - resuming operations');
    }
});

// Handle keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Handle Escape key to close mobile menu
    if (e.key === 'Escape') {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.header__nav');
        if (mobileToggle && nav && mobileToggle.getAttribute('aria-expanded') === 'true') {
            nav.style.display = 'none';
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.style.backgroundColor = 'var(--color-surface)';
            mobileToggle.style.color = 'var(--color-primary)';
            mobileToggle.focus();
        }
    }
});

// Export functions for potential external use
window.CVWebsite = {
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            // const targetPosition = section.offsetTop - headerHeight - 10;
            const targetPosition = targetSection.offsetTop - headerHeight + 8;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    getCurrentSection: function() {
        const sections = document.querySelectorAll('.section');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 50;
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        return currentSection;
    },
    
    updateNavigation: function() {
        // Force update navigation highlighting
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }
};

document.querySelectorAll('.zoomable-image').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.style.maxWidth = '90%';
    fullImg.style.maxHeight = '90%';
    fullImg.style.borderRadius = '12px';
    fullImg.style.cursor = 'zoom-out';
    fullImg.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

    overlay.appendChild(fullImg);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => overlay.remove());
  });
});
