document.addEventListener('DOMContentLoaded', () => {


    // =========================================
    // 4. Hero Background Auto Slideshow
    // =========================================
    const heroSlides = document.querySelectorAll('.hero__slide');
    const heroDots = document.querySelectorAll('.hero__dot');
    let currentSlide = 0;
    let slideTimer;

    function goToSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        heroDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % heroSlides.length;
        goToSlide(next);
    }

        // Mobile Touch Swipe for Hero Slides
        const heroSectionEl = document.querySelector('.hero');
        if (heroSectionEl) {
            let heroTouchStartX = 0;
            let heroTouchEndX = 0;

            heroSectionEl.addEventListener('touchstart', (e) => {
                heroTouchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            heroSectionEl.addEventListener('touchend', (e) => {
                heroTouchEndX = e.changedTouches[0].screenX;
                if (heroTouchStartX - heroTouchEndX > 40) {
                    // Swipe Left -> Next Slide
                    clearInterval(slideTimer);
                    nextSlide();
                    slideTimer = setInterval(nextSlide, 5500);
                } else if (heroTouchEndX - heroTouchStartX > 40) {
                    // Swipe Right -> Prev Slide
                    clearInterval(slideTimer);
                    const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
                    goToSlide(prev);
                    slideTimer = setInterval(nextSlide, 5500);
                }
            }, { passive: true });
        }

    heroDots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideTimer);
            goToSlide(parseInt(dot.getAttribute('data-slide'), 10));
            slideTimer = setInterval(nextSlide, 5500);
        });
    });

    if (heroSlides.length) {
        slideTimer = setInterval(nextSlide, 5500);
    }

    // =========================================
    // 5. Navbar Scroll Effect
    // =========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // =========================================
    // 6. Hero Parallax Effect (Desktop Only)
    // =========================================
    const heroSection = document.querySelector('.hero');
    const heroContent = document.getElementById('heroContent');
    if (heroSection && heroContent && window.innerWidth > 1024) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 16;
            const yPos = (clientY / window.innerHeight - 0.5) * 16;
            heroContent.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = `translate3d(0, 0, 0)`;
        });
    }

    // =========================================
    // 7. Mobile Hamburger & Touch Drawer
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const active = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', active ? 'true' : 'false');
            document.body.style.overflow = active ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // 8. Smooth Anchor Scrolling
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // 9. Scroll Reveal & Number Counter
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => animateCounter(counter));
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .zoom-in').forEach(el => revealObserver.observe(el));

    function animateCounter(counter) {
        if (counter.classList.contains('counted')) return;
        counter.classList.add('counted');

        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let count = 0;
        const duration = 1400;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(count);
            }
        }, 16);
    }

    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar__links a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const navHeight = navbar ? navbar.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });


    // =========================================
    // 11. Food Sample Menu Modal Open / Close
    // =========================================
    const menuModal = document.getElementById('menuModal');
    const menuModalClose = document.getElementById('menuModalClose');
    const menuModalOverlay = document.getElementById('menuModalOverlay');
    const openMenuBtns = [
        document.getElementById('openMenuBtn'),
        document.getElementById('openMenuBtn2'),
        document.getElementById('openMenuBtn3')
    ];

    openMenuBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (menuModal) {
                    menuModal.classList.add('active');
                    menuModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    if (menuModalClose) menuModalClose.focus();
                }
            });
        }
    });

    function closeMenuModal() {
        if (menuModal) {
            menuModal.classList.remove('active');
            menuModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (menuModalClose) menuModalClose.addEventListener('click', closeMenuModal);
    if (menuModalOverlay) menuModalOverlay.addEventListener('click', closeMenuModal);

    // =========================================
    // 12. Copy to Clipboard Toast
    // =========================================
    const copyToast = document.getElementById('copyToast');
    const copyPhone = document.getElementById('copyPhone');
    const copyAddress = document.getElementById('copyAddress');

    function triggerCopy(text, label) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                if (copyToast) {
                    copyToast.textContent = `${label} copied!`;
                    copyToast.classList.add('show');
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 2500);
                }
            });
        }
    }

    if (copyPhone) {
        copyPhone.addEventListener('click', () => {
            triggerCopy('+917777066774', 'Phone number');
        });
    }

    if (copyAddress) {
        copyAddress.addEventListener('click', () => {
            triggerCopy('Khingar, Panchgani, Maharashtra 412805', 'Address');
        });
    }

    // =========================================
    // 13. Location Category Filter Buttons
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter');

            filterItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden-filter');
                } else {
                    item.classList.add('hidden-filter');
                }
            });
        });
    });

    // =========================================
    // 14. Subtle 3D Card Tilt Effect (Desktop Mouse Only)
    // =========================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (window.innerWidth > 1024) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 18;
                const rotateY = (centerX - x) / 18;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });
        });
    }

    // =========================================
    // 15. Universal Lightbox Gallery & Photo Viewer (Every Photo Clickable)
    // =========================================
    const photoTargets = document.querySelectorAll(
        '.gallery__item, .intro__image, .floor-row__image, .experience__image, .itinerary__image, .season-experience__image, .ig-card, [data-full]'
    );
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxOverlay = document.querySelector('.lightbox__overlay');

    let currentIndex = 0;
    const galleryImages = [];

    photoTargets.forEach((el) => {
        const img = el.querySelector('img');
        let fullSrc = el.getAttribute('data-full');

        if (img) {
            if (!fullSrc) {
                fullSrc = img.currentSrc || img.src;
            }

            let titleText = '';
            const captionTitle = el.querySelector('.caption-title, .floor-title, .season-name, .day-title, h3, h4');
            if (captionTitle) {
                titleText = captionTitle.textContent;
            } else if (img.alt) {
                titleText = img.alt;
            }

            const imageIndex = galleryImages.length;
            galleryImages.push({
                src: fullSrc,
                alt: titleText || img.alt || 'Meraki Hillside Villa Photo'
            });

            el.style.cursor = 'pointer';

            el.addEventListener('click', (e) => {
                if (el.classList.contains('ig-card')) {
                    e.preventDefault();
                }
                openLightbox(imageIndex);
            });
        }
    });

    // Hero background slide click to enlarge
    const heroSlideEls = document.querySelectorAll('.hero__slide');
    heroSlideEls.forEach((slide) => {
        const bgUrlMatch = slide.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (bgUrlMatch && bgUrlMatch[1]) {
            const fullSrc = bgUrlMatch[1];
            const slideIndex = galleryImages.length;
            galleryImages.push({
                src: fullSrc,
                alt: 'Meraki Hillside Villa Hero View'
            });
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', (e) => {
                if (e.target.classList.contains('hero__slide') || e.target.classList.contains('hero__overlay')) {
                    openLightbox(slideIndex);
                }
            });
        }
    });

    function openLightbox(index) {
        if (!lightbox || galleryImages.length === 0) return;
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        if (!lightboxImg) return;
        const image = galleryImages[currentIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        }
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateLightbox();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightbox();
    }

    if (lightbox) {
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

        // Touch Swipe Support for Lightbox on Smartphones
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                showNextImage();
            } else if (touchEndX - touchStartX > 50) {
                showPrevImage();
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

    // =========================================
    // 17. FAQ Accordion
    // =========================================
    const faqRows = document.querySelectorAll('.faq-row, .faq-item');
    faqRows.forEach((item, index) => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (questionBtn) {
            const answerId = `faq-answer-${index + 1}`;
            questionBtn.setAttribute('aria-expanded', 'false');
            if (answer) {
                answer.id = answerId;
                questionBtn.setAttribute('aria-controls', answerId);
            }
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqRows.forEach(i => {
                    i.classList.remove('active');
                    const btn = i.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                if (!isActive) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // =========================================
    // 18. Back to Top Button
    // =========================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // 19. Enquiry Form & Availability WhatsApp Handlers
    // =========================================
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const checkin = document.getElementById('form-checkin').value;
            const checkout = document.getElementById('form-checkout').value;
            const guests = document.getElementById('form-guests').value;
            const message = document.getElementById('form-message').value;

            let text = `Hi! I would like to enquire about staying at Meraki Hillside Villa.\n\n`;
            text += `👤 *Name:* ${name}\n`;
            text += `📞 *Phone:* ${phone}\n`;
            if (checkin) text += `📅 *Check-in:* ${checkin}\n`;
            if (checkout) text += `📅 *Check-out:* ${checkout}\n`;
            if (guests) text += `👥 *Guests:* ${guests}\n`;
            if (message) text += `📝 *Notes:* ${message}\n`;

            const waUrl = `https://wa.me/917777066774?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
        });
    }

    const widgetSubmit = document.getElementById('widget-submit');
    if (widgetSubmit) {
        widgetSubmit.addEventListener('click', () => {
            const checkin = document.getElementById('widget-checkin').value;
            const checkout = document.getElementById('widget-checkout').value;
            const guests = document.getElementById('widget-guests').value;

            let text = `Hi! I'd like to check availability at Meraki Hillside Villa.\n`;
            if (checkin) text += `📅 Check-in: ${checkin}\n`;
            if (checkout) text += `📅 Check-out: ${checkout}\n`;
            if (guests) text += `👥 Guests: ${guests}\n`;

            const waUrl = `https://wa.me/917777066774?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
        });
    }

    // Auto update copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});


// === Cinematic Video Poster Interaction ===
(function() {
  const videoPosterContainer = document.getElementById('videoPosterContainer');
  const videoPlayerContainer = document.getElementById('videoPlayerContainer');
  const villaTourVideo = document.getElementById('villaTourVideo');

  if (videoPosterContainer && videoPlayerContainer && villaTourVideo) {
    videoPosterContainer.addEventListener('click', function() {
      videoPosterContainer.style.display = 'none';
      videoPlayerContainer.style.display = 'block';
      villaTourVideo.play();
    });
  }
})();


