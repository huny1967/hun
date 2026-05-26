document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Cover Image Crossfade Slider
    // ==========================================
    const slides = document.querySelectorAll('.cover-slider .slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Run crossfade every 5 seconds
    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }

    // ==========================================
    // 2. Background Music (BGM) Player
    // ==========================================
    const bgm = document.getElementById('bgm');
    const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    
    if (bgm && bgmToggleBtn) {
        bgmToggleBtn.addEventListener('click', () => {
            if (bgm.paused) {
                bgm.play().then(() => {
                    bgmToggleBtn.classList.add('playing');
                }).catch(error => {
                    console.log('Audio autoplay blocked or failed:', error);
                    showToast('음악 재생을 시작할 수 없습니다.');
                });
            } else {
                bgm.pause();
                bgmToggleBtn.classList.remove('playing');
            }
        });
    }

    // ==========================================
    // 3. Countdown Timer
    // ==========================================
    // Target date: November 7, 2026 at 14:00 (Year, Month Index 10 for November, Day, Hour, Min, Sec)
    const weddingDate = new Date(2026, 10, 7, 14, 0, 0);
    
    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const messageEl = document.getElementById('countdown-msg');
        
        if (diff <= 0) {
            if (daysEl) daysEl.innerText = '00';
            if (hoursEl) hoursEl.innerText = '00';
            if (minutesEl) minutesEl.innerText = '00';
            if (secondsEl) secondsEl.innerText = '00';
            if (messageEl) {
                messageEl.innerHTML = "의찬과 수현의 결혼식이 <strong>진행 중</strong>이거나 <strong>완료</strong>되었습니다.";
            }
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        
        if (messageEl) {
            messageEl.innerHTML = `의찬 ♥ 수현의 결혼식까지 <strong>${days}일 ${hours}시간 ${minutes}분 ${seconds}초</strong> 남았습니다.`;
        }
    }
    
    // Initial call and run every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target); // Only trigger once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ==========================================
    // 5. Groom & Bride Contact Modals
    // ==========================================
    const groomBtn = document.getElementById('groom-contact-btn');
    const brideBtn = document.getElementById('bride-contact-btn');
    const groomModal = document.getElementById('groom-contact-modal');
    const brideModal = document.getElementById('bride-contact-modal');
    const groomClose = document.getElementById('groom-modal-close-btn');
    const brideClose = document.getElementById('bride-modal-close-btn');
    
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scroll
    }
    
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Enable background scroll
    }
    
    if (groomBtn && groomModal) {
        groomBtn.addEventListener('click', () => openModal(groomModal));
        groomClose.addEventListener('click', () => closeModal(groomModal));
        groomModal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(groomModal));
    }
    
    if (brideBtn && brideModal) {
        brideBtn.addEventListener('click', () => openModal(brideModal));
        brideClose.addEventListener('click', () => closeModal(brideModal));
        brideModal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(brideModal));
    }

    // ==========================================
    // 6. Photo Gallery Expand & Lightbox
    // ==========================================
    const galleryExpandBtn = document.getElementById('gallery-expand-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryImgs = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCloseBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.next') : null;
    
    let activeImgIndex = 0;
    const imgUrls = Array.from(galleryImgs).map(img => img.src);
    
    // Gallery Expand
    if (galleryExpandBtn && galleryGrid) {
        galleryExpandBtn.addEventListener('click', () => {
            galleryGrid.classList.add('expanded');
            galleryExpandBtn.style.display = 'none';
        });
    }
    
    // Lightbox Open
    galleryImgs.forEach((img, idx) => {
        img.parentNode.addEventListener('click', () => {
            if (!lightbox || !lightboxImg) return;
            activeImgIndex = idx;
            showLightboxImage(activeImgIndex);
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    function showLightboxImage(index) {
        if (!lightboxImg) return;
        lightboxImg.classList.remove('loaded');
        lightboxImg.src = imgUrls[index];
        lightboxImg.onload = () => {
            lightboxImg.classList.add('loaded');
        };
    }
    
    function showNextImage() {
        activeImgIndex = (activeImgIndex + 1) % imgUrls.length;
        showLightboxImage(activeImgIndex);
    }
    
    function showPrevImage() {
        activeImgIndex = (activeImgIndex - 1 + imgUrls.length) % imgUrls.length;
        showLightboxImage(activeImgIndex);
    }
    
    if (lightbox) {
        // Lightbox Close
        lightboxCloseBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Prev/Next Nav
        if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);
        
        // Keyboard arrow navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Touch events for mobile swiping
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50; // swipe minimum distance in px
            if (touchEndX < touchStartX - threshold) {
                showNextImage(); // Swiped left, show next
            }
            if (touchEndX > touchStartX + threshold) {
                showPrevImage(); // Swiped right, show prev
            }
        }
    }

    // ==========================================
    // 7. Account Information Accordion
    // ==========================================
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other accordions first
                accordions.forEach(acc => {
                    acc.classList.remove('active');
                });
                
                // Toggle clicked accordion
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==========================================
    // 8. Copy to Clipboard & Toast Notifications
    // ==========================================
    const copyButtons = document.querySelectorAll('.btn-copy');
    const toastContainer = document.getElementById('toast-container');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering accordion actions if clicked inside
            
            const accountNum = btn.getAttribute('data-account');
            const bankName = btn.getAttribute('data-bank');
            
            if (!accountNum) return;
            
            // Modern copy logic
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(accountNum)
                    .then(() => {
                        showToast(`${bankName} 계좌번호가 복사되었습니다.`);
                    })
                    .catch(err => {
                        console.error('Clipboard write failed, using fallback:', err);
                        fallbackCopy(accountNum, bankName);
                    });
            } else {
                fallbackCopy(accountNum, bankName);
            }
        });
    });
    
    function fallbackCopy(text, bank) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        // Make it invisible
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast(`${bank} 계좌번호가 복사되었습니다.`);
            } else {
                showToast('계좌번호 복사에 실패했습니다.');
            }
        } catch (err) {
            showToast('계좌번호 복사에 실패했습니다.');
        }
        
        document.body.removeChild(textarea);
    }
    
    function showToast(message) {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide and remove after 2.5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 2500);
    }
});
