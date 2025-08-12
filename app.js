// Pricing data
const pricingData = {
  starter: { veg: 2599, nonveg: 3199 },
  standard: { veg: 4999, nonveg: 6199 },
  complete: { veg: 7499, nonveg: 8999 },
  flexi15: { veg: 1699, nonveg: 2199 },
  flexi30: { veg: 2999, nonveg: 3599 }
};

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const orderForm = document.getElementById('orderForm');
const mealPlanSelect = document.getElementById('mealPlan');
const mealTypeSelect = document.getElementById('mealType');
const priceDisplay = document.getElementById('priceDisplay');
const successModal = document.getElementById('successModal');

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation();
  initializeMenuTabs();
  initializePriceCalculator();
  initializeFormSubmission();
  initializeSmoothScrolling();
  initializeScrollAnimations();
  addFocusEffects();
});

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');

        // Update active navigation state
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Update active nav on scroll
  window.addEventListener('scroll', updateActiveNavOnScroll);
}

// Update active navigation based on scroll position
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });

  // Navbar background change
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(139, 21, 56, 0.98)';
    } else {
      navbar.style.background = 'rgba(139, 21, 56, 0.95)';
    }
  }
}

// Scroll to section function (for hero CTA button)
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}


// Menu tabs functionality
function initializeMenuTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Determine which menu to show based on button text
      const buttonText = this.textContent.toLowerCase();
      if (buttonText.includes('breakfast')) {
        showMenu('breakfast');
      } else if (buttonText.includes('non-veg lunch')) {
        showMenu('nonveg-lunch');
      } else if (buttonText.includes('veg lunch')) {
        showMenu('veg-lunch');
      } else if (buttonText.includes('non-veg dinner')) {
        showMenu('nonveg-dinner');
      } else if (buttonText.includes('veg dinner')) {
        showMenu('veg-dinner');
      }

      // Update active tab
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Set initial state
  showMenu('breakfast');
}


function showMenu(menuType) {
  // Hide all menu contents
  const menuContents = document.querySelectorAll('.menu-content');
  menuContents.forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });

  // Show selected menu content
  const targetMenu = document.getElementById(`${menuType}-menu`);
  if (targetMenu) {
    targetMenu.style.display = 'block';
    targetMenu.classList.add('active');
  }
}

// Price calculator functionality
function initializePriceCalculator() {
  if (mealPlanSelect && mealTypeSelect) {
    // Add event listeners to plan and meal type selects
    mealPlanSelect.addEventListener('change', updatePrice);
    mealTypeSelect.addEventListener('change', updatePrice);
  }
}

function updatePrice() {
  if (!mealPlanSelect || !mealTypeSelect || !priceDisplay) return;

  const selectedPlan = mealPlanSelect.value;
  const selectedMealType = mealTypeSelect.value;

  if (selectedPlan && selectedMealType) {
    const price = pricingData[selectedPlan] && pricingData[selectedPlan][selectedMealType];

    if (price) {
      priceDisplay.style.display = 'block';
      priceDisplay.innerHTML = `
        <strong>Selected Plan Price: ₹${price.toLocaleString('en-IN')}</strong>
        <br><small>Monthly subscription price</small>
      `;
    }
  } else {
    priceDisplay.style.display = 'none';
  }
}

// Form submission functionality
function initializeFormSubmission() {
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (validateForm()) {
        submitOrder();
      }
    });
  }
}

function validateForm() {
  const requiredFields = [
    'customerName',
    'customerPhone',
    'customerAddress',
    'mealPlan',
    'mealType'
  ];

  let isValid = true;
  const errors = [];

  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const value = field.value.trim();

    if (!value) {
      isValid = false;
      field.style.borderColor = '#ff4757';
      errors.push(`${getFieldLabel(fieldId)} is required`);
    } else {
      field.style.borderColor = 'rgba(139, 21, 56, 0.2)';
    }
  });

  // Validate phone number format
  const phoneField = document.getElementById('customerPhone');
  if (phoneField) {
    const phoneValue = phoneField.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;

    if (phoneValue && !phoneRegex.test(phoneValue)) {
      isValid = false;
      phoneField.style.borderColor = '#ff4757';
      errors.push('Please enter a valid 10-digit phone number');
    }
  }

  if (!isValid) {
    alert('Please fill in all required fields correctly:\n• ' + errors.join('\n• '));
  }

  return isValid;
}

function getFieldLabel(fieldId) {
  const labels = {
    customerName: 'Name',
    customerPhone: 'Phone Number',
    customerAddress: 'Address',
    mealPlan: 'Meal Plan',
    mealType: 'Meal Preference'
  };

  return labels[fieldId] || fieldId;
}

function submitOrder() {
  const submitBtn = document.querySelector('.submit-btn');
  if (!submitBtn) return;

  const originalText = submitBtn.textContent;
  submitBtn.innerHTML = 'Sending...';
  submitBtn.disabled = true;

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    customerPhone: document.getElementById('customerPhone').value.trim(),
    customerAddress: document.getElementById('customerAddress').value.trim(),
    mealPlan: document.getElementById('mealPlan').value,
    mealType: document.getElementById('mealType').value,
    specialInstructions: document.getElementById('specialInstructions').value.trim()
  };

  // change this URL to your deployed backend when ready
  const API_URL = 'https://api.mealzaar.com/send-order';

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    if (data && data.success) {
      orderForm.reset();
      if (priceDisplay) priceDisplay.style.display = 'none';
      showModal();
    } else {
      alert('Failed to send order: ' + (data && data.detail ? data.detail : 'Unknown error'));
    }
  })
  .catch(err => {
    console.error(err);
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    alert('Error sending order. Check console for details.');
  });
}


// Modal functionality
function showModal() {
  if (successModal) {
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (successModal) {
    successModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
if (successModal) {
  successModal.addEventListener('click', function (event) {
    if (event.target === successModal) {
      closeModal();
    }
  });
}

// Add scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .menu-item, .pricing-card, .contact-item');
  animateElements.forEach(el => observer.observe(el));
}

// Add focus effects to form elements
function addFocusEffects() {
  const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

  formInputs.forEach(input => {
    input.addEventListener('focus', function (e) {
      e.preventDefault();
      this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
    });

    // Prevent unwanted scrolling on form input focus
    input.addEventListener('focusin', function (e) {
      e.stopPropagation();
    });
  });
}

// Prevent form submission on Enter key in specific fields
document.addEventListener('DOMContentLoaded', function () {
  const preventEnterFields = document.querySelectorAll('#customerName, #customerPhone');

  preventEnterFields.forEach(field => {
    field.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const nextField = getNextFormField(this);
        if (nextField) {
          nextField.focus();
        }
      }
    });
  });
});

function getNextFormField(currentField) {
  const formFields = Array.from(document.querySelectorAll('#orderForm input, #orderForm select, #orderForm textarea'));
  const currentIndex = formFields.indexOf(currentField);
  return formFields[currentIndex + 1] || null;
}

// Add keyboard navigation for menu tabs
document.addEventListener('keydown', function (e) {
  if (e.target.classList.contains('tab-btn')) {
    let newTab;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const tabs = Array.from(document.querySelectorAll('.tab-btn'));
      const currentIndex = tabs.indexOf(e.target);

      if (e.key === 'ArrowLeft') {
        newTab = tabs[currentIndex - 1] || tabs[tabs.length - 1];
      } else {
        newTab = tabs[currentIndex + 1] || tabs[0];
      }

      newTab.focus();
      newTab.click();
    }
  }
});

// Utility function to get current time greeting
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Add dynamic greeting to hero section
document.addEventListener('DOMContentLoaded', function () {
  const heroDescription = document.querySelector('.hero-description');
  if (heroDescription) {
    const greeting = getTimeGreeting();
    const currentText = heroDescription.textContent;
    heroDescription.textContent = `${greeting}! ${currentText}`;
  }
});

// Global function exports for HTML onclick handlers
window.scrollToSection = scrollToSection;
window.showMenu = showMenu;
window.closeModal = closeModal;

// Add required CSS for animations and fixes
const style = document.createElement('style');
style.textContent = `
  /* Animation keyframes */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Scroll animations */
  .feature-card,
  .menu-item,
  .pricing-card,
  .contact-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }
  
  .feature-card.animate-in,
  .menu-item.animate-in,
  .pricing-card.animate-in,
  .contact-item.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Stagger animation delays */
  .feature-card:nth-child(2) { transition-delay: 0.1s; }
  .feature-card:nth-child(3) { transition-delay: 0.2s; }
  .feature-card:nth-child(4) { transition-delay: 0.3s; }
  .feature-card:nth-child(5) { transition-delay: 0.4s; }
  .feature-card:nth-child(6) { transition-delay: 0.5s; }
  
  .menu-item:nth-child(2) { transition-delay: 0.1s; }
  .menu-item:nth-child(3) { transition-delay: 0.2s; }
  .menu-item:nth-child(4) { transition-delay: 0.3s; }
  .menu-item:nth-child(5) { transition-delay: 0.4s; }
  .menu-item:nth-child(6) { transition-delay: 0.5s; }
  .menu-item:nth-child(7) { transition-delay: 0.6s; }
  
  .pricing-card:nth-child(2) { transition-delay: 0.2s; }
  .pricing-card:nth-child(3) { transition-delay: 0.4s; }
  
  .contact-item:nth-child(2) { transition-delay: 0.2s; }
  .contact-item:nth-child(3) { transition-delay: 0.4s; }
  
  /* Form focus effects */
  .form-group.focused label {
    color: var(--brand-primary);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  /* Navigation active state */
  .nav-link.active {
    color: var(--brand-accent);
    background-color: rgba(255, 215, 0, 0.1);
  }
  
  /* Fix dropdown select appearance */
  .form-group select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding-right: 2.5rem;
  }
  
  /* Menu content visibility fix */
  .menu-content {
    display: none;
  }
  
  .menu-content.active {
    display: block;
  }
`;
document.head.appendChild(style);