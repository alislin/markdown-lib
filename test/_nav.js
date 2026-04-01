(function() {
  function initNav() {
    var currentPage = location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.md-nav-links a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
    
    var savedTheme = localStorage.getItem('md-theme') || 'auto';
    applyTheme(savedTheme);
    highlightThemeButton(savedTheme);
    
    document.querySelectorAll('.md-nav-theme button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var theme = this.dataset.theme;
        localStorage.setItem('md-theme', theme);
        applyTheme(theme);
        highlightThemeButton(theme);
      });
    });
  }
  
  function applyTheme(theme) {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
  
  function highlightThemeButton(theme) {
    document.querySelectorAll('.md-nav-theme button').forEach(function(btn) {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();