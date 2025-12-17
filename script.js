document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

            const mailtoLink = `mailto:abhishek3kumar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
        });
    }

    // Generic Carousel Logic
    const initCarousel = (trackSelector, btnSelector, autoSlideInterval = 3000, customGetItemsPerView = null) => {
        const track = document.querySelector(trackSelector);
        const nextButton = document.querySelector(btnSelector);

        if (track && nextButton) {
            let currentPage = 0;

            const getItemsPerView = () => {
                // Explicitly force 1 item for Infographics track
                if (trackSelector.includes('infographics')) return 1;

                if (customGetItemsPerView) return customGetItemsPerView();

                if (window.innerWidth <= 768) return 1;
                if (window.innerWidth <= 1024) return 2;
                return 3;
            };

            const slideNext = () => {
                const items = track.querySelectorAll('.carousel-card');
                const totalItems = items.length;
                const itemsPerView = getItemsPerView();
                const totalPages = Math.ceil(totalItems / itemsPerView);

                currentPage++;
                if (currentPage >= totalPages) {
                    currentPage = 0;
                }

                const card = items[0];
                if (card) {
                    // Robust Gap Calculation: Measure distance between first two items if available
                    let gap = 24; // Default fallback
                    if (items.length > 1) {
                        const firstRect = items[0].getBoundingClientRect();
                        const secondRect = items[1].getBoundingClientRect();
                        gap = secondRect.left - firstRect.right;
                    }

                    // Sanity check: if gap is negative or excessively large (e.g., due to wrapping), reset to a safe default
                    if (gap < 0 || gap > 100) gap = 24;

                    const cardWidth = card.getBoundingClientRect().width;
                    const moveAmount = (cardWidth + gap) * itemsPerView;

                    track.style.transform = `translateX(-${currentPage * moveAmount}px)`;
                }
            };

            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                slideNext();
                resetTimer();
            });

            // Auto Advance
            let timer = setInterval(slideNext, autoSlideInterval);

            const resetTimer = () => {
                clearInterval(timer);
                timer = setInterval(slideNext, autoSlideInterval);
            };

            window.addEventListener('resize', () => {
                currentPage = 0;
                track.style.transform = 'translateX(0)';
            });
        }
    };

    // Initialize Podcast Carousel
    initCarousel('#podcasts .carousel-track', '#next-podcast', 3000);

    // Initialize Experience Carousel
    initCarousel('#experience-track', '#next-experience', 4000); // Slightly different timing to offset animations

    // Initialize Infographics Carousel
    // User requested "1 at a time".
    initCarousel('#infographics-track', '#next-infographics', 5000, () => {
        return 1;
    });

    // Lightbox Logic
    const lightbox = document.getElementById('infographic-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox) {
        // Use delegated event listener or select all current images
        // Since images are static in DOM, direct selection is fine.
        document.querySelectorAll('.infographic-img').forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                // Small delay to allow display:flex to apply before opacity transition
                setTimeout(() => lightbox.classList.add('active'), 10);
                lightboxImg.src = img.src;
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Request Access Button Handler
    const requestBtns = document.querySelectorAll('.request-btn');
    requestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const subject = btn.getAttribute('data-subject');
            const messageBox = document.getElementById('message');
            if (messageBox) {
                messageBox.value = `Hi Abhishek,\n\nI am interested in your ${subject} and would like to discuss it further.\n\nBest regards,`;
                // Allow smooth scroll to finish then focus
                setTimeout(() => messageBox.focus(), 800);
            }
        });
    });
});
