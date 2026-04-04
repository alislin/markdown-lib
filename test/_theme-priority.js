(function() {
  var systemThemeDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function init() {
    initVscodeControls();
    initUserControls();
    updateStatus();
    
    systemThemeDark.addEventListener('change', function() {
      updateStatus();
    });
  }
  
  function initVscodeControls() {
    var savedVscodeTheme = localStorage.getItem('vscode-theme') || 'none';
    setVscodeTheme(savedVscodeTheme);
    
    var vscodeButtons = document.querySelectorAll('.vscode-theme-btn');
    vscodeButtons.forEach(function(btn) {
      if (btn.dataset.vscode === savedVscodeTheme) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', function() {
        vscodeButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setVscodeTheme(btn.dataset.vscode);
        updateStatus();
      });
    });
  }
  
  function initUserControls() {
    var savedUserTheme = localStorage.getItem('md-theme') || 'auto';
    setUserTheme(savedUserTheme);
    
    var userButtons = document.querySelectorAll('.user-theme-btn');
    userButtons.forEach(function(btn) {
      if (btn.dataset.user === savedUserTheme) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', function() {
        userButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setUserTheme(btn.dataset.user);
        updateStatus();
      });
    });
  }
  
  function setVscodeTheme(theme) {
    if (theme === 'none' || theme === 'auto') {
      document.body.removeAttribute('data-vscode-theme-kind');
      if (theme === 'auto') {
        document.body.setAttribute('data-vscode-theme-kind', 'auto');
      }
    } else {
      document.body.setAttribute('data-vscode-theme-kind', 'vscode-' + theme);
    }
    localStorage.setItem('vscode-theme', theme);
  }
  
  function setUserTheme(theme) {
    if (theme === 'auto') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem('md-theme', theme);
    
    var navButtons = document.querySelectorAll('.md-nav-theme button');
    navButtons.forEach(function(btn) {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  function updateStatus() {
    var systemDark = systemThemeDark.matches;
    var userTheme = document.body.getAttribute('data-theme');
    var vscodeTheme = document.body.getAttribute('data-vscode-theme-kind');
    
    var systemStatusEl = document.querySelector('.system-theme-status');
    if (systemStatusEl) {
      systemStatusEl.textContent = systemDark ? '深色 (dark)' : '浅色 (light)';
    }
    
    var activeInfo = calculateActiveTheme(userTheme, vscodeTheme, systemDark);
    
    var themeValueEl = document.querySelector('.active-theme-value');
    if (themeValueEl) {
      themeValueEl.textContent = activeInfo.theme === 'dark' ? '深色主题' : '浅色主题';
    }
    
    var themeSourceEl = document.querySelector('.active-theme-source');
    if (themeSourceEl) {
      themeSourceEl.textContent = '来源: ' + activeInfo.source;
    }
    
    var indicatorEl = document.querySelector('.active-theme-indicator');
    if (indicatorEl) {
      if (activeInfo.theme === 'dark') {
        indicatorEl.classList.add('dark-active');
      } else {
        indicatorEl.classList.remove('dark-active');
      }
    }
    
    highlightCurrentScenario(userTheme, vscodeTheme, systemDark);
  }
  
  function calculateActiveTheme(userTheme, vscodeTheme, systemDark) {
    if (userTheme) {
      return { theme: userTheme, source: '用户选择' };
    }
    
    if (vscodeTheme && vscodeTheme !== 'auto') {
      var themeValue = vscodeTheme.replace('vscode-', '');
      return { theme: themeValue, source: 'VSCode 设置' };
    }
    
    return { theme: systemDark ? 'dark' : 'light', source: '系统主题' };
  }
  
  function highlightCurrentScenario(userTheme, vscodeTheme, systemDark) {
    var rows = document.querySelectorAll('.scenario-table tbody tr');
    rows.forEach(function(row) {
      row.classList.remove('current-scenario');
      
      var rowData = {
        system: row.dataset.system,
        vscode: row.dataset.vscode,
        user: row.dataset.user
      };
      
      var matches = true;
      
      if (rowData.system !== (systemDark ? 'dark' : 'light')) {
        matches = false;
      }
      
      var currentVscode = vscodeTheme ? vscodeTheme.replace('vscode-', '') : 'none';
      if (rowData.vscode !== currentVscode) {
        matches = false;
      }
      
      var currentUser = userTheme || 'none';
      if (rowData.user !== currentUser) {
        matches = false;
      }
      
      if (matches) {
        row.classList.add('current-scenario');
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();