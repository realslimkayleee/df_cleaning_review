class SiteHeader extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute('root-path') || '';
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // helper to set active class
    const isActive = (path) => currentPath === path ? 'aria-current="page"' : '';

    this.innerHTML = `
    <header class="site-header-fixed">
      <!-- Top Bar: Reviews & Socials -->
      <div class="header-top-bar">
        <div class="container">
          <div class="header-reviews">
            <span class="review-desktop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span style="margin-left: 4px;"><strong>5.0</strong> Google Reviews</span>
            </span>
            <span class="review-desktop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span style="margin-left: 4px;"><strong>5.0</strong> Facebook Reviews</span>
            </span>
            <span class="review-mobile" style="display: none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FABB05" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span style="margin-left: 4px;"><strong>5.0</strong> Google & Facebook Reviews</span>
            </span>
          </div>
          <div class="header-socials">
            <a href="https://instagram.com/df.cleaning" target="_blank" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/df.cleaning1" target="_blank" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="container nav-wrapper">
        <!-- Logo -->
        <a href="${rootPath}index.html" class="logo-link" id="logo-home-link" aria-label="DF Cleaning Homepage">
          <img src="${rootPath}assets/logo2.png" alt="DF Cleaning Logo">
        </a>

        <!-- Desktop & Tablet Navigation -->
        <nav class="main-nav" id="main-navigation" aria-label="Primary Navigation">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="${rootPath}index.html" class="nav-link" ${isActive('index.html')}>HOME</a>
            </li>
            <li class="nav-item has-dropdown">
              <div class="nav-link-wrapper mobile-accordion-toggle" aria-expanded="false" style="position: relative; width: 100%; cursor: pointer;">
                <a href="${rootPath}services.html" class="nav-link" ${isActive('services.html')}>SERVICES</a>
                <span class="mobile-chevron" style="position: absolute; right: 0; top: 0; bottom: 0; width: 60px; display: flex; align-items: center; justify-content: center; z-index: 10;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              <ul class="dropdown-menu">
                <li><a href="${rootPath}services/home-cleaning.html" class="dropdown-link">Home Cleaning</a></li>
                <li><a href="${rootPath}services/on-going-cleaning.html" class="dropdown-link">Ongoing Cleaning</a></li>
                <li><a href="${rootPath}services/commercial-cleaning.html" class="dropdown-link">Commercial / Industrial Cleaning</a></li>
                <li><a href="${rootPath}services/move-in-move-out.html" class="dropdown-link">Move-In / Move-Out Cleaning</a></li>
                <li><a href="${rootPath}services/window-washing.html" class="dropdown-link">Window Washing</a></li>
                <li><a href="${rootPath}services/carpet-cleaning.html" class="dropdown-link">Carpet Cleaning</a></li>
                <li><a href="${rootPath}services/home-remodeling.html" class="dropdown-link">Home Remodeling</a></li>
                <li><a href="${rootPath}services/coaching.html" class="dropdown-link">Coaching</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="${rootPath}about.html" class="nav-link" ${isActive('about.html')}>ABOUT</a>
            </li>
            <li class="nav-item">
              <a href="${rootPath}gallery.html" class="nav-link" ${isActive('gallery.html')}>GALLERY</a>
            </li>
            <li class="nav-item">
              <a href="${rootPath}estimate.html" class="nav-link" ${isActive('estimate.html')}>CONTACT</a>
            </li>
          </ul>
        </nav>

        <!-- Action Buttons -->
        <div class="header-actions">
          <a href="tel:+17373679177" class="btn btn-outline" id="header-call-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            (737) 367-9177
          </a>
          <a href="${rootPath}estimate.html" class="btn btn-primary" id="header-estimate-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Get a Quote
          </a>
        </div>

        <!-- Mobile Hamburger Toggle Menu -->
        <button class="menu-toggle" id="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="main-navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
    `;

    // Wait for the next tick so the DOM is ready
    setTimeout(() => {
        const headerEl = this.querySelector('.site-header-fixed');
        if(!headerEl) return;
        const updateScroll = () => {
          if (window.scrollY > 20) {
            headerEl.classList.add('is-scrolled');
          } else {
            headerEl.classList.remove('is-scrolled');
          }
        };
        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();
    }, 0);
  }
}
customElements.define('site-header', SiteHeader);
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute('root-path') || '';

    this.innerHTML = `
  <footer class="main-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${rootPath}index.html" class="footer-logo-link" aria-label="DF Cleaning Homepage">
            <img src="${rootPath}assets/logo2.png" alt="DF Cleaning Logo">
          </a>
          <p>Professional residential and commercial cleaning services across Texas.</p>
          <div class="footer-socials" aria-label="Quick contact links">
            <a href="tel:+17373679177" aria-label="Call DF Cleaning">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 10.9a16 16 0 0 0 4.1 4.1l1.26-1.25a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
            <a href="mailto:info@dfcleaning.com" aria-label="Email DF Cleaning">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="m3 7 9 6 9-6"></path>
              </svg>
            </a>
          </div>
        </div>

        <nav class="footer-column" aria-label="Footer quick links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="${rootPath}index.html">Home</a></li>
            <li><a href="${rootPath}services.html">Services</a></li>
            <li><a href="${rootPath}about.html">About</a></li>
            <li><a href="${rootPath}gallery.html">Gallery</a></li>
            <li><a href="${rootPath}estimate.html">Contact</a></li>
          </ul>
        </nav>

        <div class="footer-column">
          <h3>Contact Information</h3>
          <ul>
            <li><span>Phone</span><a href="tel:+17373679177">(737) 367-9177</a></li>
            <li><span>Service Area</span><span>Texas</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 DF Cleaning. All Rights Reserved.</p>
        <p style="margin-top: 0.5rem; font-size: 0.9em; opacity: 0.8;">Website designed by <a href="https://cairnagency.io" class="cairn-agency-link" target="_blank" rel="noopener noreferrer">Cairn Agency</a></p>
      </div>
    </div>
  </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
