(function() {
  var themes = ['green'];
  var currentTheme = localStorage.getItem('md-color-theme') || 'green';
  
  function init() {
    var selector = document.querySelector('.md-theme-selector');
    if (!selector) return;
    
    themes.forEach(function(theme) {
      var btn = document.createElement('button');
      btn.className = 'md-theme-btn';
      btn.dataset.theme = theme;
      btn.textContent = getThemeLabel(theme);
      if (theme === currentTheme) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', function() {
        switchTheme(theme);
      });
      selector.appendChild(btn);
    });
    
    applyTheme(currentTheme);
  }
  
  function getThemeLabel(theme) {
    var labels = {
      'green': '绿色',
    };
    return labels[theme] || theme;
  }
  
  function switchTheme(theme) {
    localStorage.setItem('md-color-theme', theme);
    currentTheme = theme;
    applyTheme(theme);
    
    document.querySelectorAll('.md-theme-btn').forEach(function(btn) {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  function applyTheme(theme) {
    var link = document.querySelector('link[data-theme-css]');
    if (link) {
      link.href = '../dist/md-' + theme + '.css';
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();