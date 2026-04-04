(function() {
  function initNav() {
    var currentPage = location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.md-nav-links a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
    
    if (document.querySelector('.user-theme-btn')) {
      return;
    }
    
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
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
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
  
  function init() {
    if (document.body) {
      initNav();
    } else {
      document.addEventListener('DOMContentLoaded', initNav);
    }
  }
  
  init();
})();