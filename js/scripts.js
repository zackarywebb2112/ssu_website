

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