/* ==========================================================================
   SELFOWN PORTFOLIO - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ======================================================
       1. MOBILE NAV TOGGLE
       (nav-links is hidden via CSS below 768px, so we add
       a hamburger button dynamically and toggle a class)
       ====================================================== */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    if (navbar && navLinks) {
        // Create hamburger button
        const hamburger = document.createElement('div');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        navbar.appendChild(hamburger);

        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    /* ======================================================
       2. STICKY HEADER SHADOW ON SCROLL
       ====================================================== */
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /* ======================================================
       3. SMOOTH SCROLL FOR ANCHOR LINKS
       ====================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    /* ======================================================
       4. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
       ====================================================== */
    const sections = document.querySelectorAll('section[class]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        let scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (id && scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(function (link) {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    /* ======================================================
       5. SKILL BAR / PERCENTAGE ANIMATION
       (animates the numbers in .skill-card p from 0 to target)
       ====================================================== */
    const skillCards = document.querySelectorAll('.skill-card p');
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;

        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom >= 0;

        if (inView) {
            skillsAnimated = true;
            skillCards.forEach(function (el) {
                const target = parseInt(el.textContent, 10) || 0;
                let current = 0;
                const step = Math.max(1, Math.round(target / 40));

                const interval = setInterval(function () {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    el.textContent = current + '%';
                }, 20);
            });
        }
    }
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // run once in case skills are already in view on load

    /* ======================================================
       6. PROJECT FILTER (All / Angular / Mongodb / Bootstrap)
       Add a data-category attribute to each .project-card in
       your HTML for this to actually filter (see note below).
       ====================================================== */
    const filterList = document.querySelectorAll('.projects .list li');
    const projectCards = document.querySelectorAll('.project-card');

    filterList.forEach(function (item) {
        item.addEventListener('click', function () {
            filterList.forEach(function (li) { li.classList.remove('active'); });
            item.classList.add('active');

            const filter = item.textContent.trim().toLowerCase();

            projectCards.forEach(function (card) {
                const category = (card.getAttribute('data-category') || '').toLowerCase();

                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ======================================================
       7. CONTACT FORM VALIDATION & SUBMIT HANDLING
       (front-end only — no backend hooked up)
       ====================================================== */
    const contactForm = document.querySelector('.contact form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                showFormMessage('Please fill in your name, email, and message.', 'error');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Placeholder for actual submission (fetch/AJAX to your backend or a service like Formspree)
            showFormMessage('Thanks! Your message has been sent.', 'success');
            contactForm.reset();
        });
    }

    function showFormMessage(text, type) {
        let msgBox = document.querySelector('.form-message');

        if (!msgBox) {
            msgBox = document.createElement('p');
            msgBox.classList.add('form-message');
            contactForm.appendChild(msgBox);
        }

        msgBox.textContent = text;
        msgBox.classList.remove('error', 'success');
        msgBox.classList.add(type);

        setTimeout(function () {
            msgBox.textContent = '';
            msgBox.classList.remove('error', 'success');
        }, 4000);
    }

    /* ======================================================
       8. SCROLL-REVEAL FADE-IN FOR CARDS
       (adds a subtle fade/slide-up effect as sections enter view)
       ====================================================== */
    const revealTargets = document.querySelectorAll(
        '.skill-card, .service-card, .project-card, .blog-card, .timeline .box'
    );

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    const cvBtn = document.querySelector('a[download]');
    if (cvBtn) {
        cvBtn.addEventListener('click', function () {
            console.log('CV downloaded'); // replace with analytics call if needed
        });
    }

});
