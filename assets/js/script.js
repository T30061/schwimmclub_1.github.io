const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const yearEl = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const languageButtons = document.querySelectorAll('.lang-btn');

const languageLabels = {
  en: {
    nav: ['About', 'Programs', 'Schedule', 'Events', 'Gallery', 'Contact'],
    signin: 'Sign in',
    join: 'Join now'
  },
  de: {
    nav: ['Über uns', 'Programme', 'Zeitplan', 'Veranstaltungen', 'Galerie', 'Kontakt'],
    signin: 'Anmelden',
    join: 'Jetzt beitreten'
  }
};

const setLanguage = (lang) => {
  const labels = languageLabels[lang] || languageLabels.de;
  document.documentElement.lang = lang;

  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach((link, index) => {
    if (labels.nav[index]) {
      link.textContent = labels.nav[index];
    }
  });

  const signin = document.querySelector('.nav-signin');
  if (signin) signin.textContent = labels.signin;

  const join = document.querySelector('.nav-cta');
  if (join) join.textContent = labels.join;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  localStorage.setItem('marc-language', lang);
};

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const storedTheme = localStorage.getItem('marc-theme');
if (storedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

const storedLanguage = localStorage.getItem('marc-language') || 'de';
setLanguage(storedLanguage);

if (themeToggle) {
  const applyThemeLabel = () => {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  };

  applyThemeLabel();

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('marc-theme', isDark ? 'dark' : 'light');
    applyThemeLabel();
  });
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
  });
});

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
