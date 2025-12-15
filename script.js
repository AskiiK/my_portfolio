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
});

// Podcast Carousel
(function () {
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('#next-podcast');

    if (track && nextButton) {
        let currentPage = 0;

        const getItemsPerView = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        const slideNext = () => {
            const items = document.querySelectorAll('.carousel-card');
            const totalItems = items.length;
            const itemsPerView = getItemsPerView();
            const totalPages = Math.ceil(totalItems / itemsPerView);

            currentPage++;
            if (currentPage >= totalPages) {
                currentPage = 0;
            }

            // Calculate move amount based on container width or card width
            // The flexible card width logic created gaps/issues.
            // Let's rely on the card's actual width + gap.

            const card = items[0];
            if (card) {
                const cardStyle = window.getComputedStyle(card);
                // We need margins if they exist? No, we used gap.

                // Gap
                const trackStyle = window.getComputedStyle(track);
                const trackGap = parseFloat(trackStyle.gap || '24px'); // 1.5rem default

                const cardWidth = card.getBoundingClientRect().width;

                // Amount to move for one "Page" of items
                const moveAmount = (cardWidth + trackGap) * itemsPerView;

                // If we are on the last page, we might overshoot whitespace if we just multiply.
                // But for "Next 3", it's expected behavior to shift the view.

                track.style.transform = `translateX(-${currentPage * moveAmount}px)`;
            }
        };

        nextButton.addEventListener('click', (e) => {
            e.preventDefault(); // Good practice
            slideNext();
            resetTimer();
        });

        // Auto Advance with error handling
        let timer = setInterval(slideNext, 3000);

        const resetTimer = () => {
            clearInterval(timer);
            timer = setInterval(slideNext, 3000);
        };

        window.addEventListener('resize', () => {
            currentPage = 0;
            track.style.transform = 'translateX(0)';
        });
    }
})();
