document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Custom Luxury Ring Cursor (Desktop Only)
    // =========================================
    const customCursor = document.getElementById('customCursor');
    const cursorDot = document.querySelector('.custom-cursor__dot');
    const cursorRing = document.querySelector('.custom-cursor__ring');
    const cursorText = document.getElementById('cursorText');

    if (customCursor && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            customCursor.classList.add('active');
        });

        function renderCursor() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        document.querySelectorAll('[data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const text = el.getAttribute('data-cursor');
                cursorText.textContent = text || 'VIEW';
                customCursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hovered');
            });
        });
    }

    // =========================================
    // 2. Top Scroll Progress Bar
    // =========================================
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = `${progress}%`;
            }
        }
    }, { passive: true });

    // =========================================
    // 3. Preloader Fadeout
    // =========================================
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader--hidden');
        }, 600);
    }

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

    if (heroSlides.length > 0) {
        slideTimer = setInterval(nextSlide, 5500);

        heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(slideTimer);
                goToSlide(i);
                slideTimer = setInterval(nextSlide, 5500);
            });
        });
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
    // 10. Interactive Villa Capacity & Group Planner
    // =========================================
    const plannerSlider = document.getElementById('plannerSlider');
    const plannerGuestCount = document.getElementById('plannerGuestCount');
    const plannerBeds = document.getElementById('plannerBeds');
    const plannerMeals = document.getElementById('plannerMeals');
    const plannerAccess = document.getElementById('plannerAccess');
    const plannerWaBtn = document.getElementById('plannerWaBtn');

    if (plannerSlider) {
        function updatePlanner() {
            const guests = parseInt(plannerSlider.value, 10);
            if (plannerGuestCount) plannerGuestCount.textContent = guests;

            if (guests <= 4) {
                if (plannerBeds) plannerBeds.textContent = "2 Bedroom Suites (Cozy)";
            } else if (guests <= 8) {
                if (plannerBeds) plannerBeds.textContent = "3 Bedroom Suites (Spacious)";
            } else {
                if (plannerBeds) plannerBeds.textContent = "4 Full Bedroom Suites (Whole Villa)";
            }

            if (plannerMeals) plannerMeals.textContent = `Cook service for ${guests} guests`;
            if (plannerAccess) plannerAccess.textContent = `100% Exclusive Private Villa Access`;

            if (plannerWaBtn) {
                plannerWaBtn.textContent = `💬 Enquire for ${guests} Guests on WhatsApp`;
                plannerWaBtn.href = `https://wa.me/917777066774?text=Hi!%20I%20used%20the%20Group%20Planner%20on%20your%20website%20and%20would%20like%20to%20enquire%20for%20${guests}%20guests.`;
            }
        }

        plannerSlider.addEventListener('input', updatePlanner);
        updatePlanner();
    }

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
    // 15. Social Proof Toast Cycle
    // =========================================
    const socialToast = document.getElementById('socialProofToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastDesc = document.getElementById('toastDesc');
    const toastTime = document.getElementById('toastTime');
    const toastClose = document.getElementById('toastClose');

    const toastData = [
        { title: "Recent Enquiry", desc: "Sneha P. from Mumbai enquired for 12 guests", time: "2 minutes ago" },
        { title: "Verified Booking", desc: "Rahul M. from Pune booked Meraki for 3 nights", time: "15 minutes ago" },
        { title: "Dates Checked", desc: "Amit K. checked availability for Diwali weekend", time: "30 minutes ago" },
        { title: "5-Star Review", desc: "Parth left a ★★★★★ review on Google Maps", time: "1 hour ago" }
    ];

    let toastIndex = 0;

    function showToast() {
        if (!socialToast || window.innerWidth <= 768) return;
        const item = toastData[toastIndex];
        if (toastTitle) toastTitle.textContent = item.title;
        if (toastDesc) toastDesc.textContent = item.desc;
        if (toastTime) toastTime.textContent = item.time;

        socialToast.classList.add('show');

        setTimeout(() => {
            if (socialToast) socialToast.classList.remove('show');
        }, 5000);

        toastIndex = (toastIndex + 1) % toastData.length;
    }

    if (socialToast && window.innerWidth > 768) {
        setTimeout(showToast, 6000);
        setInterval(showToast, 16000);

        if (toastClose) {
            toastClose.addEventListener('click', () => {
                socialToast.classList.remove('show');
            });
        }
    }

    // =========================================
    // 16. Lightbox Gallery & Touch Swipe Navigation
    // =========================================
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxOverlay = document.querySelector('.lightbox__overlay');

    let currentIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            galleryImages.push({
                src: img.src,
                alt: img.alt
            });
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        }
    });

    function openLightbox(index) {
        if (galleryImages.length === 0) return;
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const image = galleryImages[currentIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
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
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
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
                faqItems.forEach(i => {
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

// === Instagram Showcase: Controls & Smooth Drag Scroll ===
(function() {
  const igSection = document.getElementById('instagram');
  if (!igSection) return;
  
  const carousel = document.getElementById('igCarousel');
  const prevBtn = document.getElementById('igPrevBtn');
  const nextBtn = document.getElementById('igNextBtn');

  if (carousel && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const cardWidth = carousel.querySelector('.instagram__item')?.offsetWidth || 340;
      carousel.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      const cardWidth = carousel.querySelector('.instagram__item')?.offsetWidth || 340;
      carousel.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
    });

    // Mouse Drag-to-Scroll support
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });
  }
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (window.instgrm && window.instgrm.Embeds) {
          window.instgrm.Embeds.process();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });
  
  observer.observe(igSection);
})();
