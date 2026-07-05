/* ============================================
   ESWAREVENTS - JAVASCRIPT FUNCTIONALITY
   Premium Event Management Website
   ============================================ */

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // NAVIGATION MENU TOGGLE (Mobile)
    // ============================================

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    // Toggle mobile menu when hamburger button is clicked
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Handle dropdown in mobile view
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });

    // ============================================
    // STICKY NAVIGATION ON SCROLL
    // ============================================

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when page is scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveNavLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================

    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // STATISTICS COUNTER ANIMATION
    // ============================================

    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;

                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on page load

    // ============================================
    // GALLERY FILTER TABS
    // ============================================

    const tabBtns = document.querySelectorAll('.tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const gallerySections = document.querySelectorAll('.gallery-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Show/hide gallery sections based on filter
            gallerySections.forEach(section => {
                if (filter === 'all') {
                    section.style.display = 'block';
                } else {
                    const sectionId = section.id;
                    const category = sectionId.replace('-gallery', '');
                    if (category === filter) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
        });
    });

    // ============================================
    // FULL SCREEN GALLERY MODAL
    // ============================================

    const galleryModal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const viewBtns = document.querySelectorAll('.view-btn');

    let currentImageIndex = 0;
    let allImages = [];

    // Collect all gallery images
    function collectAllImages() {
        allImages = [];
        document.querySelectorAll('.gallery-item img').forEach((img, index) => {
            const viewBtn = img.closest('.gallery-item').querySelector('.view-btn');
            if (viewBtn) {
                allImages.push({
                    src: viewBtn.getAttribute('data-image'),
                    alt: img.alt
                });
            }
        });
    }

    collectAllImages();

    // Open modal when view button is clicked
    viewBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageSrc = this.getAttribute('data-image');
            currentImageIndex = allImages.findIndex(img => img.src === imageSrc);
            openModal(imageSrc);
        });
    });

    // Also open modal when gallery item is clicked
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-btn') || e.target.closest('.view-btn')) return;
            const viewBtn = this.querySelector('.view-btn');
            if (viewBtn) {
                const imageSrc = viewBtn.getAttribute('data-image');
                currentImageIndex = allImages.findIndex(img => img.src === imageSrc);
                openModal(imageSrc);
            }
        });
    });

    function openModal(imageSrc) {
        modalImage.src = imageSrc;
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close modal when close button is clicked
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeModal();
        }
    });

    // Navigate to previous image
    modalPrev.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        modalImage.src = allImages[currentImageIndex].src;
    });

    // Navigate to next image
    modalNext.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        modalImage.src = allImages[currentImageIndex].src;
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeModal();
        }
        // Navigate with arrow keys
        if (galleryModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                modalPrev.click();
            } else if (e.key === 'ArrowRight') {
                modalNext.click();
            }
        }
    });

    // ============================================
    // REVIEWS SLIDER
    // ============================================

    const reviewsTrack = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.getElementById('sliderDots');

    let currentSlide = 0;
    let slidesToShow = 3;
    let totalSlides = document.querySelectorAll('.review-card').length;

    // Update slides to show based on screen size
    function updateSlidesToShow() {
        if (window.innerWidth <= 768) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 1200) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
    }

    // Create slider dots
    function createDots() {
        sliderDots.innerHTML = '';
        const dotsCount = Math.ceil(totalSlides / slidesToShow);

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            sliderDots.appendChild(dot);
        }
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }

    // Update slider position
    function updateSlider() {
        updateSlidesToShow();
        const slideWidth = 100 / slidesToShow;
        const maxSlide = Math.ceil(totalSlides / slidesToShow) - 1;

        if (currentSlide > maxSlide) currentSlide = maxSlide;
        if (currentSlide < 0) currentSlide = 0;

        reviewsTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

        // Update dots
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Previous slide
    prevBtn.addEventListener('click', function() {
        currentSlide--;
        if (currentSlide < 0) currentSlide = Math.ceil(totalSlides / slidesToShow) - 1;
        updateSlider();
    });

    // Next slide
    nextBtn.addEventListener('click', function() {
        currentSlide++;
        const maxSlide = Math.ceil(totalSlides / slidesToShow) - 1;
        if (currentSlide > maxSlide) currentSlide = 0;
        updateSlider();
    });

    // Initialize slider
    createDots();
    updateSlider();

    // Handle window resize
    window.addEventListener('resize', function() {
        updateSlidesToShow();
        createDots();
        updateSlider();
    });

    // Auto-slide every 5 seconds
    let autoSlide = setInterval(() => {
        nextBtn.click();
    }, 5000);

    // Pause auto-slide on hover
    reviewsTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    reviewsTrack.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            nextBtn.click();
        }, 5000);
    });

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!validateForm(data)) {
            return;
        }

        // Show success message (in real app, this would send to server)
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = '#28a745';

            // Reset form
            this.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Form validation
    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;

        if (!data.name || data.name.trim().length < 2) {
            alert('Please enter a valid name');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        if (!phoneRegex.test(data.phone)) {
            alert('Please enter a valid phone number');
            return false;
        }

        if (!data.service) {
            alert('Please select a service');
            return false;
        }

        if (!data.message || data.message.trim().length < 10) {
            alert('Please enter a message (at least 10 characters)');
            return false;
        }

        return true;
    }

    // ============================================
    // FORM INPUT ANIMATIONS
    // ============================================

    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(input => {
        // Check if input has value on load
        if (input.value) {
            input.classList.add('has-value');
        }

        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================

    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .about-feature, .info-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ============================================
    // PRELOAD IMAGES FOR SMOOTH GALLERY EXPERIENCE
    // ============================================

    function preloadImages() {
        allImages.forEach(img => {
            const newImg = new Image();
            newImg.src = img.src;
        });
    }

    preloadImages();

    // ============================================
    // HERO PARALLAX EFFECT (Optional Enhancement)
    // ============================================

    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // ============================================
    // UTILITY: THROTTLE FUNCTION
    // ============================================

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // PHONE NUMBER FORMAT (Auto-format)
    // ============================================

    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    }

    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================

    console.log('%c Eswar Events ', 'background: #d4af37; color: #000; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
    console.log('%cPremium Event Management Website', 'color: #d4af37; font-size: 14px;');

});

// ============================================
// END OF JAVASCRIPT
// ============================================
