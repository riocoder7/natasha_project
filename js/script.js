// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Validation and Submission
const appointmentForm = document.getElementById('appointment-form');

appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const childName = document.getElementById('name').value;
    const parentName = document.getElementById('parent-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value;

    // Basic form validation
    if (!childName || !parentName || !email || !phone || !date) {
        alert('Please fill in all required fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Date validation (ensure future date)
    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate < today) {
        alert('Please select a future date');
        return;
    }

    // Simulate form submission
    const formData = {
        childName,
        parentName,
        email,
        phone,
        date,
        message
    };

    // Show loading state
    const submitBtn = appointmentForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        console.log('Form submitted:', formData);
        
        // Reset form
        appointmentForm.reset();
        
        // Show success message
        alert('Appointment request submitted successfully! We will contact you shortly.');
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }, 1500);
});

// Scroll-based Navigation Highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === currentSection) {
            item.classList.add('active');
        }
    });
});

// Add active class style to navigation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .nav-links a.active {
            color: var(--primary-color) !important;
            font-weight: bold;
        }
    </style>
`);

// Animate service cards on scroll
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .service-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .service-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
`);

// Observe all service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Enhanced Intersection Observer for Animations
const animateOnScroll = (elements, options = {}) => {
    const defaultOptions = {
        threshold: 0.2,
        rootMargin: '0px',
        ...options
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (options.once) observer.unobserve(entry.target);
            } else if (!options.once) {
                entry.target.classList.remove('animate');
            }
        });
    }, defaultOptions);

    elements.forEach(el => observer.observe(el));
};

// Apply animations to various elements
document.addEventListener('DOMContentLoaded', () => {
    // Animate cards
    animateOnScroll(document.querySelectorAll('.service-card, .doctor-card, .contact-card'), { once: true });
    
    // Animate sections
    animateOnScroll(document.querySelectorAll('section'), {
        threshold: 0.1,
        once: false
    });

    // Enhanced mobile navigation
    const navbar = document.querySelector('.navbar');
    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Form validation and enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add loading indicator
            input.addEventListener('focus', () => {
                input.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.classList.remove('focused');
                validateInput(input);
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                try {
                    form.classList.add('submitting');
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    showNotification('Success! 🎉', 'success');
                } catch (error) {
                    showNotification('Something went wrong 😕', 'error');
                } finally {
                    form.classList.remove('submitting');
                }
            }
        });
    });

    // Initialize character animations
    const characters = document.querySelectorAll('.character');
    characters.forEach((character, index) => {
        setTimeout(() => {
            character.classList.add('animate-in');
        }, index * 200);
    });

    // Add click interaction
    characters.forEach(character => {
        character.addEventListener('click', () => {
            character.style.transform = 'scale(0.8)';
            setTimeout(() => {
                character.style.transform = '';
            }, 200);
        });
    });

    // Vaccination Form Handling
    const vaccinationForm = document.getElementById('vaccinationForm');
    if (vaccinationForm) {
        vaccinationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                childName: document.getElementById('childName').value,
                parentName: document.getElementById('parentName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                vaccine: document.getElementById('vaccine').value,
                date: document.getElementById('date').value
            };

            try {
                // Show loading state
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Scheduling...';
                submitBtn.disabled = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                showNotification('Vaccination scheduled successfully! 🎉', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('vaccinationModal'));
                modal.hide();
                
                // Reset form
                vaccinationForm.reset();
            } catch (error) {
                showNotification('Failed to schedule vaccination. Please try again. 😕', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Date input validation
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            
            dateInput.addEventListener('change', () => {
                const selectedDate = new Date(dateInput.value);
                const dayOfWeek = selectedDate.getDay();
                
                // Disable weekends
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    showNotification('Please select a weekday for vaccination. 📅', 'error');
                    dateInput.value = '';
                }
            });
        }
    }

    // Set minimum date to today for appointment date
    const appointmentDateInput = document.getElementById('appointmentDate');
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.setAttribute('min', today);

    // Handle form submission
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const childName = document.getElementById('childName').value;
            const parentName = document.getElementById('parentName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const appointmentDate = document.getElementById('appointmentDate').value;
            const notes = document.getElementById('notes').value;

            // Update confirmation modal with details
            document.getElementById('confirmChildName').textContent = childName;
            document.getElementById('confirmDate').textContent = new Date(appointmentDate).toLocaleDateString();
            document.getElementById('confirmContact').textContent = email;

            // Here you would typically send this data to your backend
            // For now, we'll just show the success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // Reset form
            appointmentForm.reset();

            // You could also send an email notification here using a backend service
        });
    }
});

// Form validation helper
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;

    if (input.required && !value) {
        isValid = false;
    } else if (input.type === 'email' && value) {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (input.type === 'tel' && value) {
        isValid = /^[\d\s-+()]{10,}$/.test(value);
    }

    input.classList.toggle('invalid', !isValid);
    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            background: #4CAF50;
            color: white;
        }

        .notification.error {
            background: #f44336;
            color: white;
        }

        .form-group input.invalid {
            border-color: #f44336;
        }

        .form-group input.focused {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 4px rgba(255, 69, 0, 0.1);
        }

        form.submitting {
            opacity: 0.7;
            pointer-events: none;
        }
    </style>
`);

// Add these authentication functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Add this function to handle account creation
async function createAccount(formData) {
    try {
        // Here you would typically make an API call to your backend
        // For now, we'll simulate the API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store user data in localStorage (temporary solution)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        
        return { success: true };
    } catch (error) {
        console.error('Account creation error:', error);
        throw new Error('Failed to create account');
    }
} 