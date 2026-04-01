

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Contact form: submit via fetch and show success modal (prevents redirect)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitButton');
            if (submitBtn) submitBtn.disabled = true;
            const formData = new FormData(contactForm);
            // remove any redirect field just in case
            formData.delete('redirect');

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (submitBtn) submitBtn.disabled = false;
                    if (response.ok) {
                        const modalEl = document.getElementById('contactSuccessModal');
                        if (modalEl) {
                            const modal = new bootstrap.Modal(modalEl);
                            contactForm.reset();
                            modal.show();
                        } else {
                            alert('Message sent. Thank you.');
                        }
                    } else {
                        return response.text().then(text => { throw new Error(text || 'Request failed'); });
                    }
                })
                .catch(() => {
                    if (submitBtn) submitBtn.disabled = false;
                    alert('There was an error sending your message. Please try again later.');
                });
        });
    }

    // ================================================================
    // Scroll-Driven Parallax & Reveal Animations
    // ================================================================
    (function () {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ---- IntersectionObserver: scroll reveal (fade + rise) --------
        const revealEls      = document.querySelectorAll('.scroll-reveal');
        const staggerChildren = document.querySelectorAll('.scroll-reveal-stagger > *');

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            revealEls.forEach(function (el) { revealObserver.observe(el); });
            staggerChildren.forEach(function (el) { revealObserver.observe(el); });
        } else {
            // Fallback for very old browsers: show everything immediately
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
            staggerChildren.forEach(function (el) { el.classList.add('is-visible'); });
        }

        // ---- rAF-throttled parallax ------------------------------------
        if (prefersReducedMotion) return;

        var masthead   = document.querySelector('header.masthead');
        var teamPhoto  = document.querySelector('.team-photo');
        var aboutVideo = document.querySelector('#about video');
        var rafId      = null;

        function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

        function updateParallax() {
            rafId = null;
            var scrollY = window.scrollY;
            var vh      = window.innerHeight;

            // Masthead hero: background moves at 35% of scroll speed.
            // As user scrolls DOWN the background shifts DOWN (positive Y)
            // which makes it appear to lag behind — classic parallax depth.
            if (masthead) {
                var offset = scrollY * 0.35;
                masthead.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
            }

            // Team photo: subtle background pan relative to viewport centre.
            // When element is above centre, offset is negative (image pans up);
            // when below, offset is positive (image pans down).
            if (teamPhoto) {
                var rect = teamPhoto.getBoundingClientRect();
                var dist = (rect.top + rect.height * 0.5) - vh * 0.5;
                var tpOffset = clamp(dist * 0.10, -40, 40);
                teamPhoto.style.backgroundPositionY = 'calc(50% + ' + tpOffset + 'px)';
            }

            // Video: translateY pan within the scale(1.08) headroom (~±20 px).
            if (aboutVideo) {
                var vRect = aboutVideo.getBoundingClientRect();
                var vDist = (vRect.top + vRect.height * 0.5) - vh * 0.5;
                var vOffset = clamp(vDist * 0.06, -20, 20);
                aboutVideo.style.transform = 'scale(1.08) translateY(' + vOffset + 'px)';
            }
        }

        function onScroll() {
            if (!rafId) { rafId = requestAnimationFrame(updateParallax); }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        updateParallax(); // set initial positions on page load
    }());

});
