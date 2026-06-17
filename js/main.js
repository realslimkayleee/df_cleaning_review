document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Hamburger Menu Toggle ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-navigation');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
      }
    });

    // Keyboard Accessibility (Esc key to close)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.focus();
      }
    });
  }

  // --- Reviews Carousel ---
  const reviews = [
    {
      name: 'Arya Kannantha',
      initials: 'AK',
      date: '11 months ago',
      avatarClass: 'avatar-blue',
      text: 'Perfect job cleaning our house super time friendly and affordable. Their crew was super nice and made everything very easy.'
    },
    {
      name: 'Rayaan Bhagani',
      initials: 'RB',
      date: '11 months ago',
      avatarClass: 'avatar-teal',
      text: 'Had them clean my home. Flawless job!!'
    },
    {
      name: 'Aryan Satheesh',
      initials: 'AS',
      date: '11 months ago',
      avatarClass: 'avatar-light-blue',
      text: 'Darwin was great. Super smooth and pleasant interaction! Recommend his services to anyone!'
    },
    {
      name: 'Hannah Harvey',
      initials: 'HH',
      date: '11 months ago',
      avatarClass: 'avatar-blue',
      text: 'Very happy with the service!! Great attention to detail, amazing communication, very responsive after cleaning for setting up recurrent services!! Highly recommend!!'
    },
    {
      name: 'Gianmarco Cattinelli',
      initials: 'GC',
      date: '11 months ago',
      avatarClass: 'avatar-teal',
      text: 'Excelente servicio. Darwin es alguien muy amable y grato de conocer. Siempre está atento a cualquier necesidad que tenemos como cliente.'
    },
    {
      name: 'Людмила Должанська',
      initials: 'ЛД',
      date: '11 months ago',
      avatarClass: 'avatar-light-blue',
      text: 'I hired this team for a move out cleaning (exterior and interior) and what an amazing experience we had. The team was responsive and professional from the moment we first reached out to them, during the service and after. Our last tenant had pets in the home so a deep cleaning was required. Both teams got busy from the moment they got into the home and even sent me some pictures of things left behind just to make sure they were not throwing something away of value. We went to inspect the cleaning a day after and it was night and day. I am sure our listing won\'t stay long in the market because the house looks spotless!'
    },
    {
      name: 'Judit Melendez',
      initials: 'JM',
      date: '11 months ago',
      avatarClass: 'avatar-blue',
      text: 'If you\'re looking for clean and pristine, you\'re looking at the perfect company! Sparkly and squeaky clean is their specialty! There\'s not a mess they can\'t handle. Their customer service is admirable. Such a great experience overall, would recommend.'
    },
    {
      name: 'Kailey Klatt',
      initials: 'KK',
      date: '11 months ago',
      avatarClass: 'avatar-teal',
      text: 'An amazing experience! Highly recommend!'
    },
    {
      name: 'Dani C.R.',
      initials: 'DC',
      date: '11 months ago',
      avatarClass: 'avatar-light-blue',
      text: 'Awesome customer service, responds quickly! Their cleaning is top-notch.'
    },
    {
      name: 'Mike A',
      initials: 'MA',
      date: '11 months ago',
      avatarClass: 'avatar-blue',
      text: 'Great cleaning service. Fast response and great communication throughout. Will definitely use them again!'
    }
  ];

  const reviewCard = document.querySelector('.review-card');
  const avatar = document.querySelector('[data-review-avatar]');
  const name = document.querySelector('[data-review-name]');
  const date = document.querySelector('[data-review-date]');
  const text = document.querySelector('[data-review-text]');
  const prevButton = document.querySelector('[data-review-prev]');
  const nextButton = document.querySelector('[data-review-next]');
  const dotsWrapper = document.querySelector('[data-review-dots]');

  if (reviewCard && avatar && name && date && text && prevButton && nextButton && dotsWrapper) {
    let activeReviewIndex = 0;

    const dots = reviews.map((review, index) => {
      const dot = document.createElement('button');
      dot.className = 'review-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show review from ${review.name}`);
      dot.addEventListener('click', () => setReview(index));
      dotsWrapper.appendChild(dot);
      return dot;
    });

    const renderReview = () => {
      const review = reviews[activeReviewIndex];
      avatar.textContent = review.initials;
      avatar.className = `review-avatar ${review.avatarClass}`;
      name.textContent = review.name;
      date.textContent = review.date;
      text.textContent = review.text;

      dots.forEach((dot, index) => {
        dot.setAttribute('aria-current', index === activeReviewIndex ? 'true' : 'false');
      });
    };

    const setReview = (index) => {
      activeReviewIndex = (index + reviews.length) % reviews.length;
      reviewCard.classList.add('is-transitioning');

      window.setTimeout(() => {
        renderReview();
        reviewCard.classList.remove('is-transitioning');
      }, 180);
    };

    prevButton.addEventListener('click', () => setReview(activeReviewIndex - 1));
    nextButton.addEventListener('click', () => setReview(activeReviewIndex + 1));

    renderReview();
  }

  // --- Homepage Estimate Address Toggle ---
  const addressToggle = document.getElementById('home-address-toggle');
  const addressField = document.getElementById('home-address-field');
  const addressInput = document.getElementById('home-address');

  if (addressToggle && addressField && addressInput) {
    const syncAddressField = () => {
      const shouldShowAddress = addressToggle.checked;
      addressField.hidden = !shouldShowAddress;
      addressInput.disabled = !shouldShowAddress;

      if (shouldShowAddress) {
        addressInput.focus();
      } else {
        addressInput.value = '';
      }
    };

    addressToggle.addEventListener('change', syncAddressField);
    syncAddressField();
  }

  // --- Services Grid Intersection Observer ---
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered delay based on index
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    serviceCards.forEach((card) => {
      cardObserver.observe(card);

      // Tile Expand Logic
      card.addEventListener('click', function(e) {
        if (card.classList.contains('cta-card')) return;
        // Prevent toggling if clicking the 'More Information' button
        if (e.target.closest('.btn')) return;

        const isExpanded = this.classList.contains('is-expanded');
        
        // Optionally close others
        serviceCards.forEach(c => c.classList.remove('is-expanded'));

        if (!isExpanded) {
          this.classList.add('is-expanded');
          // Scroll into view if it expands out of viewport
          setTimeout(() => {
            const rect = this.getBoundingClientRect();
            if (rect.bottom > window.innerHeight || rect.top < 80) {
              this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 50);
        }
      });

      // Keyboard accessibility for cards
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // --- Mobile Accordion Toggle ---
  const accordionToggles = document.querySelectorAll('.mobile-accordion-toggle');
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (e.target.tagName.toLowerCase() === 'a') {
          return; // Let the link navigate normally
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
        const dropdownMenu = this.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
          dropdownMenu.classList.toggle('active');
        }
      }
    });
  });
  // --- Global Lenis Smooth Scroll ---
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis;
  if (typeof Lenis !== 'undefined' && !isReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Parallax Hero
    const heroBg = document.querySelector('.gallery-hero-bg');
    if (heroBg) {
      lenis.on('scroll', (e) => {
        heroBg.style.transform = `translateY(${e.scroll * 0.3}px)`;
      });
    }
  }

  // --- Gallery Page: Scroll Reveals ---
  const revealElements = document.querySelectorAll('.reveal-up, .fade-in');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Gallery Page: Lightbox ---
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  if (lightbox) {
    let currentImageIndex = 0;
    const visibleItems = () => Array.from(galleryItems);

    const openLightbox = (index) => {
      const items = visibleItems();
      if (items.length === 0) return;
      currentImageIndex = index;
      
      const item = items[currentImageIndex];
      const imgContainer = item.querySelector('.gallery-img');
      
      
      if(lightboxTitle) lightboxTitle.textContent = '';
      
      
      // Clone image block
      lightboxContent.innerHTML = '';
      const clone = imgContainer.cloneNode(true);
      clone.className = 'lightbox-img';
      clone.style.width = '100%';
      clone.style.height = '100%';
      clone.style.objectFit = 'contain';
      lightboxContent.appendChild(clone);
      
      lightbox.showModal();
      document.body.style.overflow = 'hidden';
      if (typeof lenis !== 'undefined') lenis.stop();
    };

    const closeLightbox = () => {
      lightbox.close();
      document.body.style.overflow = '';
      if (typeof lenis !== 'undefined') lenis.start();
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const items = visibleItems();
        const activeIndex = items.indexOf(item);
        if (activeIndex !== -1) openLightbox(activeIndex);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    const navigate = (direction) => {
      const items = visibleItems();
      currentImageIndex = (currentImageIndex + direction + items.length) % items.length;
      openLightbox(currentImageIndex);
    };

    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.open) return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // --- Sticky Quote Form (Centered Hero) ---
  const stickyQuoteForm = document.getElementById('sticky-quote-form');

  if (stickyQuoteForm) {
    // Scroll listener to toggle visibility
    const handleScroll = () => {
      // Trigger after just a little scroll
      if (window.scrollY > 50) {
        stickyQuoteForm.classList.add('visible');
      } else {
        stickyQuoteForm.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});


class SiteContactForm extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute("root-path") || "";
    const isHero = this.hasAttribute("hero");
    const isInline = this.hasAttribute("inline");
    
    const formHtml = `<div style="text-align: center; margin-block-end: 0.5rem;">
          <h2 style="font-family: var(--font-sans); color: var(--color-navy-dark); font-size: 1.75rem; margin-top: 0;">Get a Free Quote</h2>
          <p style="color: var(--color-gray-dark); margin-block-start: 0.5rem;">Request your free cleaning quote today!</p>
        </div>

        <form action="https://formsubmit.co/alejandra.fajardo71@gmail.com" method="POST" id="cleaning-estimate-form">
          <input type="hidden" name="_cc" value="darwinfajardo76@gmail.com">
          <input type="hidden" name="_subject" value="New Estimate Request from DF Cleaning Website">
          <!-- Name Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="first-name" class="form-label">First Name *</label>
              <input type="text" id="first-name" name="firstName" class="form-control" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="last-name" class="form-label">Last Name *</label>
              <input type="text" id="last-name" name="lastName" class="form-control" required aria-required="true">
            </div>
          </div>

          <!-- Contact Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="email" class="form-label">Email Address *</label>
              <input type="email" id="email" name="email" class="form-control" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Phone Number *</label>
              <input type="tel" id="phone" name="phone" class="form-control" placeholder="(555) 000-0000" required aria-required="true">
            </div>
          </div>

          <!-- Service Requirements -->
          <div class="form-group">
            <label for="service-type" class="form-label">Service Desired *</label>
            <select id="service-type" name="serviceType" class="form-control" required aria-required="true">
              <option value="" disabled selected>Select a service...</option>
              <option value="home">Home Cleaning</option>
              <option value="ongoing">On-Going Cleaning</option>
              <option value="commercial">Commercial / Industrial Cleaning</option>
              <option value="move-in-out">Move-In / Move-Out Cleaning</option>
              <option value="window">Window Washing</option>
              <option value="carpet">Carpet Cleaning</option>
              <option value="coaching">Coaching</option>
            </select>
          </div>

          <!-- Message -->
          <div class="form-group">
            <label for="details" class="form-label">Special Instructions or Details</label>
            <textarea id="details" name="details" class="form-control" rows="4" placeholder="Tell us more about your space, specific areas of focus, or preferred dates..."></textarea>
          </div>

          <!-- Submit Button -->
          <div style="text-align: center; margin-block-start: 2rem;">
            <button type="submit" class="btn btn-primary" style="inline-size: 100%; max-inline-size: 300px;">
              Submit Request
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </form>`;
    
    if (isHero) {
      this.innerHTML = formHtml;
    } else if (isInline) {
      this.innerHTML = `
        <div class="estimate-form-wrapper" style="background-color: var(--color-white); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); padding: 2rem; border: 2px solid var(--color-teal);">
          ${formHtml}
        </div>
      `;
    } else {
      this.innerHTML = `
        <section class="global-cta-section" style="padding-block: 4rem; background-color: transparent;">
          <div class="container">
            <div class="cta-band reveal-up" style="background-color: var(--color-blue-light); padding: 3rem 1.5rem; border-radius: 16px; text-align: center; max-width: 800px; margin: 0 auto;">
              <h2 style="font-size: 2rem; color: var(--color-navy-dark); margin-bottom: 1rem; font-weight: 800;">Ready for a spotless space?</h2>
              
              <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
                <a href="tel:+17373679177" class="btn" style="background-color: var(--color-teal); color: var(--color-white); border-radius: 50px; padding: 0.75rem 2rem; box-shadow: 0 4px 14px hsla(180, 70%, 42%, 0.3); text-decoration: none;">
                  Call Now
                </a>
              </div>
              
              <div style="margin-bottom: 1rem; font-weight: 800; color: var(--color-teal); font-size: 1.1rem;">OR</div>
              <p style="margin-bottom: 1.5rem; color: var(--color-text-main);">Fill out the form below to get your free quote.</p>
              
              <div style="text-align: left; background-color: var(--color-white); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); padding: 2rem; border: 2px solid var(--color-teal);">
                ${formHtml}
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // Add dynamic _next redirect for FormSubmit
    const form = this.querySelector('form');
    if (form) {
      const nextInput = document.createElement("input");
      nextInput.type = "hidden";
      nextInput.name = "_next";
      
      // Calculate absolute URL for thanks.html based on current location
      let currentPath = window.location.pathname;
      let pathBase = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      nextInput.value = window.location.origin + pathBase + "thanks.html";
      
      // We also add a captcha disabling field as a bonus, but let's stick to the user's request.
      form.appendChild(nextInput);
    }
  }
}
customElements.define("site-contact-form", SiteContactForm);


// FLOATING CALL BUTTON INJECTION
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.floating-call-btn')) {
    const callBtn = document.createElement('a');
    callBtn.href = "tel:+17373679177";
    callBtn.className = "floating-call-btn";
    callBtn.setAttribute("aria-label", "Call DF Cleaning");
    callBtn.innerHTML = `
      <div class="floating-call-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"></path>
        </svg>
      </div>
      <span class="floating-call-text">Call Now!</span>
    `;
    document.body.appendChild(callBtn);
  }
});
