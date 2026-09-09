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
        document.getElementById('openMenuBtn3'),
        document.getElementById('openMenuBtn4')
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
    // 12. Copy to Clipboard
    // =========================================
    const copyPhone = document.getElementById('copyPhone');
    const copyAddress = document.getElementById('copyAddress');

    function triggerCopy(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }

    if (copyPhone) {
        copyPhone.addEventListener('click', () => {
            triggerCopy('+917777066774');
        });
    }

    if (copyAddress) {
        copyAddress.addEventListener('click', () => {
            triggerCopy('Khingar, Panchgani, Maharashtra 412805');
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
    // 14A. Ground-floor photo carousel
    // =========================================
    const groundFloorGallery = document.querySelector('#ground-floor .floor-row__media');
    if (groundFloorGallery) {
        const mainFrame = groundFloorGallery.querySelector('.floor-row__image');
        const mainImage = mainFrame?.querySelector('picture img');
        const mainSources = mainFrame ? Array.from(mainFrame.querySelectorAll('picture source')) : [];
        const imageIndexLabel = groundFloorGallery.querySelector('.floor-image-count');
        const floorThumbs = Array.from(groundFloorGallery.querySelectorAll('[data-ground-index]'));
        const floorPhotos = floorThumbs.map((thumb) => ({
            full: thumb.getAttribute('data-full'),
            alt: thumb.querySelector('img')?.alt || 'Ground floor at Meraki Hillside Villa'
        }));
        let activeGroundPhoto = 0;

        const showGroundPhoto = (nextIndex) => {
            if (!mainFrame || !mainImage || floorPhotos.length === 0) return;
            activeGroundPhoto = (nextIndex + floorPhotos.length) % floorPhotos.length;
            const photo = floorPhotos[activeGroundPhoto];
            const webpSrc = photo.full.replace(/\.avif$/i, '.webp');

            mainFrame.setAttribute('data-full', photo.full);
            mainImage.src = webpSrc;
            mainImage.alt = photo.alt;
            mainSources.forEach((source) => {
                source.srcset = source.type === 'image/avif' ? photo.full : webpSrc;
            });
            if (imageIndexLabel) {
                imageIndexLabel.textContent = `${activeGroundPhoto + 1} / ${floorPhotos.length}`;
            }
            floorThumbs.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === activeGroundPhoto);
            });
        };

        floorThumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => showGroundPhoto(index));
        });

        groundFloorGallery.querySelectorAll('[data-ground-direction]').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                showGroundPhoto(activeGroundPhoto + (button.dataset.groundDirection === 'next' ? 1 : -1));
            });
        });
    }

    // =========================================
    // 14B. First-floor photo carousel
    // =========================================
    const firstFloorGallery = document.querySelector('.first-floor-gallery');
    if (firstFloorGallery) {
        const mainFrame = firstFloorGallery.querySelector('.floor-row__image');
        const mainImage = mainFrame?.querySelector('img');
        const mainSources = mainFrame ? Array.from(mainFrame.querySelectorAll('source')) : [];
        const imageIndexLabel = firstFloorGallery.querySelector('.floor-image-index');
        const floorThumbs = Array.from(firstFloorGallery.querySelectorAll('[data-floor-index]'));
        const floorPhotos = floorThumbs.map((thumb) => ({
            full: thumb.getAttribute('data-full'),
            alt: thumb.querySelector('img')?.alt || 'First floor at Meraki Hillside Villa'
        }));
        let activeFloorPhoto = 0;

        const showFloorPhoto = (nextIndex) => {
            if (!mainFrame || !mainImage || floorPhotos.length === 0) return;
            activeFloorPhoto = (nextIndex + floorPhotos.length) % floorPhotos.length;
            const photo = floorPhotos[activeFloorPhoto];
            const webpSrc = photo.full.replace(/\.avif$/i, '.webp');

            mainFrame.setAttribute('data-full', photo.full);
            mainImage.src = webpSrc;
            mainImage.alt = photo.alt;
            mainSources.forEach((source) => {
                source.srcset = source.type === 'image/avif' ? photo.full : webpSrc;
            });
            if (imageIndexLabel) {
                imageIndexLabel.textContent = `${activeFloorPhoto + 1} / ${floorPhotos.length}`;
            }
            floorThumbs.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === activeFloorPhoto);
            });
        };

        floorThumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => showFloorPhoto(index));
        });

        firstFloorGallery.querySelectorAll('[data-floor-direction]').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                showFloorPhoto(activeFloorPhoto + (button.dataset.floorDirection === 'next' ? 1 : -1));
            });
        });
    }

    // =========================================
    // 15. Universal Lightbox Gallery & Photo Viewer (Every Photo Clickable)
    // =========================================
    const photoTargets = document.querySelectorAll(
        '.gallery__item, .happy-guest, .intro__image, .floor-row__image, .experience__image, .itinerary__image, .season-experience__image, .ig-card, [data-full]'
    );
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxOverlay = document.querySelector('.lightbox__overlay');

    let currentIndex = 0;
    let activeLightboxSequence = null;
    const galleryImages = [];
    const groundFloorLightboxImages = [];
    const firstFloorLightboxImages = [];

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

            if (el.closest('.floor-thumbs--upper')) {
                firstFloorLightboxImages.push(imageIndex);
            }
            if (el.closest('.floor-thumbs--ground')) {
                groundFloorLightboxImages.push(imageIndex);
            }

            el.style.cursor = 'pointer';

            el.addEventListener('click', (e) => {
                const nestedControl = e.target.closest('a, button');
                if (nestedControl && nestedControl !== el) return;
                if (el.matches('a') || el.classList.contains('ig-card')) {
                    e.preventDefault();
                }
                const liveFullSrc = el.getAttribute('data-full');
                if (liveFullSrc) {
                    galleryImages[imageIndex].src = liveFullSrc;
                }

                let requestedIndex = imageIndex;
                let requestedSequence = null;
                if (el.closest('.first-floor-gallery')) {
                    requestedSequence = firstFloorLightboxImages;
                    if (el.classList.contains('floor-row__image') && liveFullSrc) {
                        const matchingIndex = firstFloorLightboxImages.find(
                            (index) => galleryImages[index].src === liveFullSrc
                        );
                        if (matchingIndex !== undefined) requestedIndex = matchingIndex;
                    }
                } else if (el.closest('#ground-floor')) {
                    requestedSequence = groundFloorLightboxImages;
                    if (el.classList.contains('floor-row__image') && liveFullSrc) {
                        const matchingIndex = groundFloorLightboxImages.find(
                            (index) => galleryImages[index].src === liveFullSrc
                        );
                        if (matchingIndex !== undefined) requestedIndex = matchingIndex;
                    }
                }
                openLightbox(requestedIndex, requestedSequence);
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

    function openLightbox(index, sequence = null) {
        if (!lightbox || galleryImages.length === 0) return;
        currentIndex = index;
        activeLightboxSequence = sequence && sequence.length ? sequence : null;
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
            if (activeLightboxSequence) {
                const sequenceIndex = activeLightboxSequence.indexOf(currentIndex);
                lightboxCounter.textContent = `${sequenceIndex + 1} / ${activeLightboxSequence.length}`;
            } else {
                lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
            }
        }
    }

    function showNextImage() {
        if (activeLightboxSequence) {
            const sequenceIndex = activeLightboxSequence.indexOf(currentIndex);
            currentIndex = activeLightboxSequence[(sequenceIndex + 1) % activeLightboxSequence.length];
        } else {
            currentIndex = (currentIndex + 1) % galleryImages.length;
        }
        updateLightbox();
    }

    function showPrevImage() {
        if (activeLightboxSequence) {
            const sequenceIndex = activeLightboxSequence.indexOf(currentIndex);
            currentIndex = activeLightboxSequence[(sequenceIndex - 1 + activeLightboxSequence.length) % activeLightboxSequence.length];
        } else {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        }
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
    // 18. Google Reviews - Continuous 1x Carousel
    // =========================================
    const googleReviewCarousel = document.getElementById('googleReviewCarousel');
    const googleReviewTrack = document.getElementById('googleReviewTrack');
    const googleReviewToggle = document.getElementById('googleReviewToggle');

    const googleReviews = [
        { name: 'mayank khiya', when: '4 months ago', text: 'A refreshing stay in a beautifully maintained villa with clean, spacious rooms, thoughtful interiors and peaceful outdoor spaces.' },
        { name: 'Samiksha', when: '3 months ago', text: 'A lovely family stay in a spacious four-bedroom villa with an infinity pool, modern rooms and mesmerizing valley views.' },
        { name: 'Jay Bhavsar', when: '2 months ago', text: 'Beautiful, well-maintained villa with a helpful caretaker, excellent food and a coordinating owner. We would definitely return.' },
        { name: 'Akshay A Rane', when: '3 months ago', text: 'Helpful staff, a cooperative chef, delicious food and wonderful morning views from the bedrooms. The overall stay was very good.' },
        { name: 'Disha jain', when: '3 months ago', text: 'A spacious villa with gorgeous views and cooperative caretakers. Access is steep and electricity can fluctuate, but everything else was great.' },
        { name: 'Amit Kumar Mishra', when: '3 months ago', text: 'A wonderful family stay with amazing views, attentive caretakers, delicious food and a host who accommodated every need.' },
        { name: 'Yamini thakur mejare', when: 'a year ago', text: 'Beautiful decor, clean rooms, a lovely pool, tasty food and genuinely good service made the visit memorable and great value.' },
        { name: 'Rahul Sharma', when: '2 years ago', text: 'A family-friendly villa with table tennis, a cozy pool, scenic bathrooms, delicious food and beautiful views from every bedroom.' },
        { name: 'Sonali Joshi', when: 'a year ago', text: 'An amazing, clean stay with kind caretakers, homely food, fresh farm vegetables and a memorable traditional chul menu.' },
        { name: 'Amar Godbole', when: '3 months ago', text: 'A spacious and beautiful villa for a friends getaway, with good food offered at a very reasonable cost.' },
        { name: 'Nirav Khiya', when: '4 months ago', text: 'A beautiful location for quality family time, complemented by very good food that feels comforting and home-cooked.' },
        { name: 'Sândëép Pítålíyã', when: 'a year ago', text: 'The approach road is narrow and steep, so guests driving a four-wheeler should arrive carefully and preferably during daylight.' },
        { name: 'Allan Sethi', when: '3 years ago', text: 'Clean, spacious and well maintained with helpful staff and a great valley location. The steep approach needs careful driving.' },
        { name: 'Priyank Gandhi', when: '3 years ago', text: 'Even more beautiful than the photos, with lavish interiors and a chef whose food rivals restaurants. A wonderful experience.' },
        { name: 'Yasmeen 1976', when: '2 years ago', text: 'A beautifully designed villa that leaves a strong impression from the moment you arrive.' },
        { name: 'Amit Balchandani', when: '2 years ago', text: 'Two excellent nights in a well-designed, clean bungalow with comfortable rooms, outstanding caretakers and superb homely meals.' },
        { name: 'Riya Rasane', when: 'a year ago', text: 'An amazing overall experience with a lovely location and enjoyable food.' },
        { name: 'Ishika Kataria', when: '4 years ago', text: 'A beautiful stay with lovely views, perfectly suited to a relaxed family vacation.' },
        { name: 'Charmi Gami', when: '4 years ago', text: 'A warm five-star greeting from a happy Google guest.' },
        { name: 'vimmi Choudhry', when: '4 years ago', text: 'A wonderfully designed bungalow with comfortable rooms, excellent caretakers and unforgettable homemade theplas. Highly recommended.' },
        { name: 'Megha Chandnani', when: '4 years ago', text: 'Perfect for spending time with loved ones, thanks to the amazing views, spacious rooms and welcoming family-getaway atmosphere.' },
        { name: 'Ridhi Umrania', when: '4 years ago', text: 'Mesmerizing views, a superb ambience, generous space and excellent amenities make this villa a perfect escape.' },
        { name: 'Meenal Shahapurkar', when: '3 years ago', text: 'Two relaxing nights in a spotless villa with wonderful views, courteous caretakers and a loving chef. A revisit is already tempting.' },
        { name: 'Alan Rodrigues', when: '4 years ago', text: 'Wonderful staff, amazing food and memorable chef-prepared dinners left the whole family eager to return.' },
        { name: 'Harshini Chowdary', when: '2 years ago', text: 'A peaceful, beautifully designed bungalow with super-clean rooms, great staff and tasty food. An awesome overall stay.' },
        { name: 'Sumera Shaikh', when: '2 years ago', text: 'One of the best villas this guest has experienced so far.' },
        { name: 'Sakshi Agarwal', when: '4 years ago', text: 'A huge yet cozy villa with outstanding views and warm, kind staff. The experience inspired an immediate desire to return.' },
        { name: 'Nitin Singh', when: 'a year ago', text: 'Good caretaking, excellent food, clean spaces and easy access to popular attractions make this a convenient holiday base.' },
        { name: 'Sriharsha Meka', when: '2 years ago', text: 'A great place to stay and unwind with friends or family.' },
        { name: 'Gaurav singh', when: 'a year ago', text: 'A well-kept villa in a convenient location near popular sights, supported by good food and caring staff.' }
    ];

    if (googleReviewCarousel && googleReviewTrack) {
        const googleReviewsUrl = 'https://www.google.com/search?sca_esv=a6de26ecf3f9c9fb&sxsrf=APpeQnv380kJkJ2aaVkLxccr-anZcA00Wg:1788898543675&q=meraki+hillside+villa&spell=1&sa=X&ved=2ahUKEwjPkfCx5t-WAxVDUGwGHRsMA9kQBSgAegQIERAB&biw=1396&bih=663&dpr=1.38#lrd=0x3bc26970ea800c0d:0x3bf3bb56323caee5,1,,,,';
        const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

        [...googleReviews, ...googleReviews].forEach((review, index) => {
            const card = document.createElement('article');
            card.className = 'review-card google-review-card';
            card.setAttribute('aria-hidden', index >= googleReviews.length ? 'true' : 'false');
            card.innerHTML = `
                <span class="quote-mark" aria-hidden="true">&ldquo;</span>
                <blockquote class="quote-body">${review.text}</blockquote>
                <div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <div class="quote-attribution">
                    <span class="review-platform review-platform--google">${initials(review.name)}</span>
                    <div><span class="author-name">${review.name}</span><span class="author-source">Google review &bull; ${review.when}</span></div>
                </div>
                <a class="google-review-card__source" href="${googleReviewsUrl}" target="_blank" rel="noopener">View on Google</a>`;
            googleReviewTrack.appendChild(card);
        });

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let reviewOffset = 0;
        let reviewLastFrame = performance.now();
        let reviewPausedByUser = false;
        let reviewPausedByHover = false;
        const reviewSpeed = 42;

        const animateReviews = (now) => {
            const elapsed = Math.min(now - reviewLastFrame, 64);
            reviewLastFrame = now;
            const loopWidth = googleReviewTrack.scrollWidth / 2;

            if (!reduceMotion.matches && !reviewPausedByUser && !reviewPausedByHover && !document.hidden && loopWidth > 0) {
                reviewOffset = (reviewOffset + (reviewSpeed * elapsed / 1000)) % loopWidth;
                googleReviewTrack.style.transform = `translate3d(${-reviewOffset}px, 0, 0)`;
            }

            requestAnimationFrame(animateReviews);
        };

        googleReviewCarousel.addEventListener('mouseenter', () => { reviewPausedByHover = true; });
        googleReviewCarousel.addEventListener('mouseleave', () => { reviewPausedByHover = false; });
        googleReviewCarousel.addEventListener('focusin', () => { reviewPausedByHover = true; });
        googleReviewCarousel.addEventListener('focusout', () => { reviewPausedByHover = false; });

        if (googleReviewToggle) {
            googleReviewToggle.addEventListener('click', () => {
                reviewPausedByUser = !reviewPausedByUser;
                googleReviewToggle.setAttribute('aria-pressed', String(reviewPausedByUser));
                googleReviewToggle.setAttribute('aria-label', reviewPausedByUser ? 'Play review carousel' : 'Pause review carousel');
                googleReviewToggle.textContent = reviewPausedByUser ? 'Play' : 'Pause';
            });
        }

        requestAnimationFrame(animateReviews);
    }

    // =========================================
    // 19. Back to Top Button
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
    // 20. Enquiry Form & Availability WhatsApp Handlers
    // =========================================
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const checkinInput = document.getElementById('form-checkin');
        const checkoutInput = document.getElementById('form-checkout');
        const guestsInput = document.getElementById('form-guests');
        const messageInput = document.getElementById('form-message');

        const parseDate = (value) => {
            const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
            if (!match) return null;
            return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
        };

        const formatDate = (value) => {
            const date = parseDate(value);
            if (!date) return value;
            return new Intl.DateTimeFormat('en-IN', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(date);
        };

        const today = new Date();
        const todayISO = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getDate()).padStart(2, '0')
        ].join('-');
        checkinInput.min = todayISO;
        checkoutInput.min = todayISO;

        checkinInput.addEventListener('change', () => {
            checkoutInput.min = checkinInput.value || todayISO;
            checkoutInput.setCustomValidity('');
            if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
                checkoutInput.value = '';
            }
        });

        checkoutInput.addEventListener('input', () => checkoutInput.setCustomValidity(''));

        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const checkin = checkinInput.value;
            const checkout = checkoutInput.value;
            const guests = guestsInput.value.trim();
            const message = messageInput.value.trim();

            if (!enquiryForm.checkValidity() || !name || !phone || !guests) {
                enquiryForm.reportValidity();
                return;
            }

            const checkinDate = parseDate(checkin);
            const checkoutDate = parseDate(checkout);
            if (checkinDate && checkoutDate && checkoutDate <= checkinDate) {
                checkoutInput.setCustomValidity('Check-out date must be after the check-in date.');
                checkoutInput.reportValidity();
                return;
            }

            const nights = checkinDate && checkoutDate
                ? Math.round((checkoutDate - checkinDate) / 86400000)
                : null;

            const lines = [
                '\uD83C\uDFE1 *NEW STAY ENQUIRY*',
                '*Meraki Hillside Villa, Panchgani*',
                '',
                '*GUEST DETAILS*',
                `Name: ${name}`,
                `WhatsApp / Phone: ${phone}`,
                '',
                '*STAY DETAILS*',
                `Check-in: ${formatDate(checkin)}`,
                `Check-out: ${formatDate(checkout)}`,
                ...(nights ? [`Duration: ${nights} night${nights === 1 ? '' : 's'}`] : []),
                `Guests: ${guests}`,
                '',
                '*REQUIREMENTS / NOTES*',
                message || 'No additional requirements shared.',
                '',
                'Please confirm availability and share the tariff.',
                '_Enquiry sent from the Meraki Hillside Villa website._'
            ];

            const text = lines.join('\n');

            const waUrl = `https://wa.me/917777066774?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank', 'noopener');
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
        yearEl.textContent = '2020';
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

// Mobile-only auto-scroll for compact horizontal content rails.
// The animation pauses while a guest swipes, taps or focuses a card.
const initMobileAutoRails = () => {
    const mobileRailQuery = window.matchMedia('(max-width: 600px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const disableAutoScrollForAudit = new URLSearchParams(window.location.search).has('no-auto-scroll');
    if (!mobileRailQuery.matches || reducedMotionQuery.matches || disableAutoScrollForAudit) return;

    const rails = Array.from(document.querySelectorAll([
        '.intro__facts-row',
        '.floor-feature-grid',
        '.video-tour__benefits',
        '.gallery__editorial-grid',
        '.amenities__grid',
        '.food-menu-preview',
        '.stay-times',
        '.house-rules__grid',
        '.attractions__grid',
        '.happy-guests__mosaic',
        '.faq-topics',
        '.contact__quick-info',
        '.contact__actions-panel',
        '.footer__feature-strip'
    ].join(',')));

    if (!rails.length) return;

    const pausedUntil = new WeakMap();
    const pauseRail = (rail, duration = 4200) => {
        pausedUntil.set(rail, performance.now() + duration);
    };

    rails.forEach((rail) => {
        rail.addEventListener('pointerdown', () => pauseRail(rail), { passive: true });
        rail.addEventListener('touchstart', () => pauseRail(rail), { passive: true });
        rail.addEventListener('wheel', () => pauseRail(rail), { passive: true });
        rail.addEventListener('focusin', () => pauseRail(rail, 6000));
    });

    document.documentElement.dataset.mobileRails = 'ready';

    window.setInterval(() => {
        const time = performance.now();
        rails.forEach((rail) => {
            const rect = rail.getBoundingClientRect();
            const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
            if (!isVisible || time < (pausedUntil.get(rail) || 0)) return;
            const maxScroll = rail.scrollWidth - rail.clientWidth;
            if (maxScroll <= 2) return;

            if (rail.scrollLeft >= maxScroll - 2) {
                rail.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const firstCard = rail.firstElementChild;
                const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : rail.clientWidth * 0.78;
                const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0;
                rail.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            }
        });
    }, 3000);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileAutoRails, { once: true });
} else {
    initMobileAutoRails();
}

// === Happy Guests Fan Carousel ===
(function() {
  const carousel = document.querySelector('[data-fan-carousel]');
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll('.happy-guest'));
  const shell = carousel.closest('.happy-guests__fan-shell');
  const prevButton = shell.querySelector('[data-guest-prev]');
  const nextButton = shell.querySelector('[data-guest-next]');
  const currentLabel = shell.querySelector('[data-guest-current]');
  const totalLabel = shell.querySelector('[data-guest-total]');
  const total = cards.length;
  let activeIndex = 0;
  let touchStartX = 0;

  if (totalLabel) totalLabel.textContent = String(total).padStart(2, '0');

  const getDistance = (index) => {
    let distance = index - activeIndex;
    if (distance > total / 2) distance -= total;
    if (distance < -total / 2) distance += total;
    return distance;
  };

  const updateCarousel = () => {
    cards.forEach((card, index) => {
      const distance = getDistance(index);
      const depth = Math.abs(distance);
      const isVisible = depth <= 2;
      const isActive = distance === 0;

      card.style.setProperty('--fan-offset', distance);
      card.style.setProperty('--fan-depth', depth);
      card.style.setProperty('--fan-scale', String(1 - Math.min(depth, 3) * 0.1));
      card.style.setProperty('--fan-opacity', isVisible ? String(1 - depth * 0.16) : '0');
      card.style.setProperty('--fan-z', String(30 - depth));
      card.classList.toggle('is-visible', isVisible);
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      card.setAttribute('aria-label', card.querySelector('img')?.alt || `Guest photo ${index + 1}`);
      card.tabIndex = isVisible ? 0 : -1;
    });

    if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
  };

  const goTo = (index) => {
    activeIndex = (index + total) % total;
    updateCarousel();
  };

  prevButton?.addEventListener('click', () => goTo(activeIndex - 1));
  nextButton?.addEventListener('click', () => goTo(activeIndex + 1));

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== activeIndex) goTo(index);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
    card.querySelector('img')?.setAttribute('draggable', 'false');
  });

  shell.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
    if (event.key === 'ArrowRight') goTo(activeIndex + 1);
  });

  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    goTo(distance < 0 ? activeIndex + 1 : activeIndex - 1);
  }, { passive: true });

  updateCarousel();
})();
