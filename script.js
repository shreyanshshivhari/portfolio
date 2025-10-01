// Theme Management - Enhanced and Functional
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Define light and dark theme colors
const themes = {
    dark: {
        '--bg-primary': '#0f0f0f',
        '--bg-secondary': '#1a1a1a',
        '--bg-tertiary': '#2a2a2a',
        '--text-primary': '#ffffff',
        '--text-secondary': '#b0b0b0',
        '--text-muted': '#808080',
        '--accent-primary': '#00d4ff',
        '--accent-secondary': '#ff6b6b',
        '--accent-gradient': 'linear-gradient(135deg, #00d4ff 0%, #ff6b6b 100%)',
        '--accent-gradient-alt': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--border-color': '#333333',
        '--shadow-color': 'rgba(0, 0, 0, 0.5)',
        '--card-bg': '#1f1f1f',
        '--success-color': '#00ff88',
        '--warning-color': '#ffaa00',
        '--error-color': '#ff4757'
    },
    light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8fafc',
        '--bg-tertiary': '#f1f5f9',
        '--text-primary': '#1a202c',
        '--text-secondary': '#4a5568',
        '--text-muted': '#718096',
        '--accent-primary': '#3182ce',
        '--accent-secondary': '#e53e3e',
        '--accent-gradient': 'linear-gradient(135deg, #3182ce 0%, #e53e3e 100%)',
        '--accent-gradient-alt': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--border-color': '#e2e8f0',
        '--shadow-color': 'rgba(0, 0, 0, 0.1)',
        '--card-bg': '#ffffff',
        '--success-color': '#38a169',
        '--warning-color': '#d69e2e',
        '--error-color': '#e53e3e'
    }
};

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;

    setTheme(theme);
}

// Set theme by updating CSS custom properties
function setTheme(theme) {
    const root = document.documentElement;
    const themeColors = themes[theme];

    // Update CSS custom properties
    for (const [property, value] of Object.entries(themeColors)) {
        root.style.setProperty(property, value);
    }

    // Update body class
    body.className = body.className.replace(/\b(light-theme|dark-theme)\b/g, '');
    body.classList.add(`${theme}-theme`);

    // Update toggle button icon
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
            themeToggle.setAttribute('title', 'Switch to light mode');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            themeToggle.setAttribute('title', 'Switch to dark mode');
        }
    }

    // Store theme preference
    localStorage.setItem('theme', theme);

    // Update navbar transparency for light theme
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (theme === 'light') {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    }

    // Trigger a custom event for theme change
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// Toggle between themes
function toggleTheme() {
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Add transition effect
    body.style.transition = 'all 0.3s ease';

    setTheme(newTheme);

    // Show feedback
    showNotification(
        `Switched to ${newTheme} mode`, 
        'info', 
        2000
    );

    // Remove transition after animation
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Listen for theme changes to update other elements
document.addEventListener('themeChanged', (e) => {
    const theme = e.detail.theme;

    // Update any theme-specific animations or effects
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach(icon => {
        if (theme === 'light') {
            icon.style.filter = 'brightness(0.8)';
        } else {
            icon.style.filter = 'brightness(1)';
        }
    });

    // Update scroll indicator colors
    updateScrollIndicators(theme);
});

// Update scroll indicators based on theme
function updateScrollIndicators(theme) {
    const style = document.createElement('style');
    style.id = 'scroll-indicator-theme';

    // Remove existing theme styles
    const existingStyle = document.getElementById('scroll-indicator-theme');
    if (existingStyle) {
        existingStyle.remove();
    }

    if (theme === 'light') {
        style.textContent = `
            ::-webkit-scrollbar-track {
                background: #f1f5f9;
            }
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #3182ce 0%, #e53e3e 100%);
            }
        `;
    } else {
        style.textContent = `
            ::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #00d4ff 0%, #ff6b6b 100%);
            }
        `;
    }

    document.head.appendChild(style);
}

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Navbar scroll effects
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';

    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        if (currentTheme === 'light') {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
            navbar.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.5)';
        }
    } else {
        navbar.classList.remove('scrolled');
        if (currentTheme === 'light') {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        }
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// Active navigation link highlighting
function updateActiveNavLink() {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Initialize scroll animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.skill-category, .project-card, .info-item, .contact-item, .about-text, .contact-info'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        animationObserver.observe(el);
    });
}

// Enhanced Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            projectType: formData.get('project-type'),
            message: formData.get('message')
        };

        // Basic validation
        if (!data.name || !data.email || !data.projectType || !data.message) {
            showNotification('Please fill in all fields', 'error');
            resetSubmitButton();
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            resetSubmitButton();
            return;
        }

        // Simulate form submission (replace with actual API call)
        try {
            await simulateFormSubmission(data);
            showNotification(
                `Thank you ${data.name}! I'll get back to you soon about your ${data.projectType} project.`, 
                'success'
            );
            contactForm.reset();
        } catch (error) {
            showNotification('Something went wrong. Please try again later.', 'error');
        }

        function resetSubmitButton() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }

        resetSubmitButton();
    });
}

// Simulate form submission
async function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 2000);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system with theme support
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Add icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    const colors = {
        success: '#00ff88',
        error: '#ff4757',
        info: '#00d4ff',
        warning: '#ffaa00'
    };

    // Adjust colors for light theme
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    if (currentTheme === 'light') {
        colors.success = '#38a169';
        colors.error = '#e53e3e';
        colors.info = '#3182ce';
        colors.warning = '#d69e2e';
    }

    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: currentTheme === 'light' ? '0 10px 25px rgba(0, 0, 0, 0.15)' : '0 10px 25px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        background: colors[type] || colors.info,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem'
    });

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 1rem;
    `;

    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, duration);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Enhanced typing animation for hero subtitle
class TypeWriter {
    constructor(element, words, speed = 100, delay = 2000) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.delay = delay;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        if (this.wordIndex === this.words.length) {
            this.wordIndex = 0;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Parallax effect for hero section
function initializeParallax() {
    const hero = document.querySelector('.hero');
    const floatingIcons = document.querySelectorAll('.floating-icon');

    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        hero.style.transform = `translate3d(0, ${rate}px, 0)`;

        floatingIcons.forEach((icon, index) => {
            const speed = (index + 1) * 0.3;
            icon.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Skill categories hover effect
function initializeSkillEffects() {
    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const skillTags = category.querySelectorAll('.skill-tag');

        category.addEventListener('mouseenter', () => {
            skillTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-5px) scale(1.05)';
                }, index * 50);
            });
        });

        category.addEventListener('mouseleave', () => {
            skillTags.forEach(tag => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });
    });
}

// Project card interactions
function initializeProjectEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Log page load performance
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`🚀 Page loaded in ${pageLoadTime}ms`);
    });

    // Monitor scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                // Perform scroll-based calculations
            }, 16); // ~60fps
        }
    });
}

// Easter egg: Konami code
function initializeEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        userInput = userInput.slice(-konamiCode.length);

        if (userInput.join('') === konamiCode.join('')) {
            activateEasterEgg();
        }
    });

    function activateEasterEgg() {
        showNotification('🎮 Konami Code Activated! You found the secret!', 'success');
        document.body.style.animation = 'rainbow 2s ease-in-out';

        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 2000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme FIRST - this is crucial
    initializeTheme();

    // Initialize animations
    initializeScrollAnimations();

    // Initialize typing effect
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        new TypeWriter(heroSubtitle, [
            originalText,
            'Blockchain Developer',
            'DeFi Specialist',
            'Full Stack Engineer'
        ], 100, 2000);
    }

    // Initialize parallax
    initializeParallax();

    // Initialize effects
    initializeSkillEffects();
    initializeProjectEffects();

    // Initialize performance monitoring
    initializePerformanceMonitoring();

    // Initialize easter egg
    initializeEasterEgg();

    // Initialize scroll indicators
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    updateScrollIndicators(currentTheme);

    console.log('🌟 Shreyansh\'s Portfolio loaded successfully!');
    console.log('💡 Try the Konami Code for a surprise!');
    console.log(`🎨 Current theme: ${currentTheme} mode`);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👋 Welcome back!');
    }
});

// Add loading states for better UX
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Remove loading overlay if exists
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }
});

// Handle project link clicks
document.addEventListener('DOMContentLoaded', () => {
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                const projectName = link.closest('.project-card').querySelector('h3').textContent;
                showNotification(`${projectName} repository will be available soon! 🚀`, 'info');
            }
        });
    });
});

// Add smooth reveal animation for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionVisible = 150;

        if (sectionTop < window.innerHeight - sectionVisible) {
            section.classList.add('section-visible');
        }
    });
};

window.addEventListener('scroll', revealSections);
document.addEventListener('DOMContentLoaded', revealSections);

// Add CSS for section visibility
const additionalCSS = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }

    section.section-visible {
        opacity: 1;
        transform: translateY(0);
    }

    .hero {
        opacity: 1;
        transform: none;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }

    // Allow 't' key to toggle theme
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isInInput = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA' || 
                         activeElement.isContentEditable;

        if (!isInInput) {
            e.preventDefault();
            toggleTheme();
        }
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const focusCSS = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent-primary) !important;
        outline-offset: 2px !important;
    }
`;

const focusStyleSheet = document.createElement('style');
focusStyleSheet.textContent = focusCSS;
document.head.appendChild(focusStyleSheet);