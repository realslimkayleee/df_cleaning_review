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
  }

  // --- Services Dropdown Navigation ---
  const dropdownToggle = document.getElementById('services-dropdown-toggle');
  const dropdownMenu = document.getElementById('services-dropdown-menu');

  if (dropdownToggle && dropdownMenu) {
    // Toggle dropdown on click (essential for touch screens & mobile viewports)
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', !isExpanded);
      dropdownMenu.classList.toggle('active');
    });

    // Close dropdown and mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('active');
      }
      
      if (mainNav && menuToggle && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
      }
    });

    // Keyboard Accessibility (Esc key to close)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('active');
        
        if (mainNav && menuToggle && mainNav.classList.contains('active')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('active');
          mainNav.classList.remove('active');
          menuToggle.focus();
        }
      }
    });
  }
});
